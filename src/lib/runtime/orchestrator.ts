import { 
  AgentRun, 
  AgentTask, 
  ExecutionEvent, 
  ToolCall, 
  WorkerManifest, 
  RunStatus, 
  TaskStatus 
} from '../types/hermes';
import { browserTool } from './tools/browser';

import { desktopTool } from './tools/desktop';

export const WORKER_REGISTRY: Record<string, WorkerManifest> = {
  'PlannerWorker': {
    name: 'PlannerWorker',
    role: 'Decomposer',
    capabilities: ['mission_planning', 'task_creation'],
    systemPrompt: 'Break down complex missions into atomic tasks for Browser, Desktop, and Terminal workers.'
  },
  'BrowserWorker': {
    name: 'BrowserWorker',
    role: 'Web Explorer',
    capabilities: ['browser_navigation', 'web_scraping', 'form_filling'],
    systemPrompt: 'Navigate sites, scroll, click, and interact with the web using Playwright.'
  },
  'DesktopWorker': {
    name: 'DesktopWorker',
    role: 'OS Automator',
    capabilities: ['app_management', 'desktop_control', 'system_automation'],
    systemPrompt: 'Open macOS apps, click desktop elements, type text, and use hotkeys specifically for macOS.'
  },
  'TerminalWorker': {
    name: 'TerminalWorker',
    role: 'Shell Executor',
    capabilities: ['command_execution', 'scripting', 'file_management'],
    systemPrompt: 'Execute zsh commands, read/write files, and manage the local file system.'
  },
  'ValidatorWorker': {
    name: 'ValidatorWorker',
    role: 'Quality Assurance',
    capabilities: ['task_verification', 'result_auditing'],
    systemPrompt: 'Verify that worker outputs match the mission requirements and handle retries if needed.'
  }
};

export class HermesOrchestrator {
  private runs: Map<string, AgentRun> = new Map();

  constructor() {}

  async createRun(mission: string, project: string): Promise<AgentRun> {
    const model = process.env.LLM_MODEL || 'llama3.1:8b';
    const runId = `run_${Math.random().toString(36).substr(2, 6)}`;
    
    const run: AgentRun = {
      id: runId,
      projectId: project,
      mission,
      status: 'pending',
      provider: 'Ollama',
      model: model,
      tasks: [],
      events: [],
      startTime: new Date().toISOString()
    };

    this.runs.set(runId, run);
    this.logEvent(runId, 'info', 'Orchestrator', `Run ${runId} initialized for mission: "${mission}"`);
    return run;
  }

  logEvent(runId: string, level: ExecutionEvent['level'], source: string, message: string, details?: any) {
    const run = this.runs.get(runId);
    if (!run) return;

    const event: ExecutionEvent = {
      id: `evt_${Math.random().toString(36).substr(2, 6)}`,
      runId,
      timestamp: new Date().toISOString(),
      level,
      source,
      message,
      details
    };

    run.events.push(event);
    console.log(`[${level.toUpperCase()}] ${source}: ${message}`);
  }

  async addTask(runId: string, task: Omit<AgentTask, 'id' | 'runId'>): Promise<AgentTask> {
    const run = this.runs.get(runId);
    if (!run) throw new Error('Run not found');

    const newTask: AgentTask = {
      ...task,
      id: `task_${Math.random().toString(36).substr(2, 6)}`,
      runId,
      toolCalls: []
    };

    run.tasks.push(newTask);
    this.logEvent(runId, 'info', task.workerName, `Task added: ${task.title}`);
    return newTask;
  }

  async executeTool(runId: string, taskId: string, toolName: string, args: any): Promise<any> {
    const run = this.runs.get(runId);
    const task = run?.tasks.find(t => t.id === taskId);
    if (!run || !task) throw new Error('Context not found');

    const toolCallId = `tc_${Math.random().toString(36).substr(2, 6)}`;
    const toolCall: ToolCall = {
      id: toolCallId,
      taskId,
      toolName,
      args,
      status: 'executing',
      executed: false,
      simulated: false,
      retryCount: 0,
      timestamp: new Date().toISOString()
    };

    task.toolCalls?.push(toolCall);
    this.logEvent(runId, 'tool_call', task.workerName, `TOOL CALL RECEIVED: ${toolName}`, args);

    try {
      // HONEST EXECUTION ROUTER
      if (toolName === 'desktop.screenshot') {
        const out = await desktopTool.screenshot(runId);
        toolCall.status = out.success ? 'success' : 'error';
        toolCall.executed = out.executed;
        toolCall.result = out.result;
        toolCall.error = out.error;
        toolCall.artifactPath = out.artifactPath;
      } 
      else if (toolName === 'desktop.open_app') {
        const out = await desktopTool.openApp(args.appName);
        toolCall.status = out.success ? 'success' : 'error';
        toolCall.executed = out.executed;
        toolCall.result = out.result;
        toolCall.error = out.error;
      }
      else if (toolName === 'system.info') {
        const out = await desktopTool.systemInfo();
        toolCall.status = out.success ? 'success' : 'error';
        toolCall.executed = out.executed;
        toolCall.result = out.result;
        toolCall.error = out.error;
      }
      else if (toolName.startsWith('browser.')) {
        // Due to lack of registry access in isolated network, browser is currently stubbed/unimplemented.
        toolCall.status = 'not_implemented';
        toolCall.executed = false;
        toolCall.simulated = true;
        toolCall.error = 'Browser capabilities temporarily unavailable due to sandbox networking bypass. Please use real macOS Desktop tools.';
      }
      else {
        // UNKNOWN OR MOCKED OUT
        toolCall.status = 'not_implemented';
        toolCall.executed = false;
        toolCall.simulated = true;
        toolCall.error = `Tool ${toolName} has no native implementation hook yet.`;
      }
      
      const evtLevel = toolCall.status === 'success' ? 'result' : toolCall.status === 'error' ? 'error' : 'warn';
      const msg = toolCall.status === 'success' ? `Tool ${toolName} REAL EXECUTION: Success.` : 
                  toolCall.status === 'not_implemented' ? `Tool ${toolName} ABORTED: Not natively implemented yet.` :
                  `Tool ${toolName} FAILED: ${toolCall.error}`;

      this.logEvent(runId, evtLevel, task.workerName, msg, { executed: toolCall.executed, result: toolCall.result, artifactPath: toolCall.artifactPath, error: toolCall.error });
      return toolCall;

    } catch (err: any) {
      toolCall.status = 'error';
      toolCall.executed = false;
      toolCall.error = err.message;
      this.logEvent(runId, 'error', task.workerName, `Tool ${toolName} crashed: ${err.message}`);
      throw err;
    }
  }

  getRun(runId: string): AgentRun | undefined {
    return this.runs.get(runId);
  }
}

// Global Singleton for the Runtime
export const globalOrchestrator = new HermesOrchestrator();
