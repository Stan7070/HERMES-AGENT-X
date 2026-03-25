// HERMES SUPER-AGENT RUNTIME TYPES
export type RunStatus = 'pending' | 'planning' | 'executing' | 'validating' | 'completed' | 'failed' | 'cancelled' | 'retry_pending';
export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'paused';
export type TaskType = 'planning' | 'reasoning' | 'browser' | 'desktop' | 'terminal' | 'file' | 'vision' | 'summary' | 'validation';

export interface ToolCall {
  id: string;
  taskId: string;
  toolName: string;
  args: Record<string, any>;
  status: 'pending' | 'executing' | 'success' | 'error' | 'not_implemented';
  executed: boolean;   // Strictly true if run on the local machine
  simulated: boolean;  // Strictly true if faked/mocked
  result?: any;
  error?: string;
  artifactPath?: string; // Path to generated evidence (e.g. screenshot)
  retryCount: number;
  timestamp: string;
}

export interface ExecutionEvent {
  id: string;
  runId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'tool_call' | 'result';
  source: string; // worker name
  message: string;
  details?: any;
}

export interface AgentTask {
  id: string;
  runId: string;
  type: TaskType;
  title: string;
  description?: string;
  status: TaskStatus;
  workerName: string;
  startTime?: string;
  endTime?: string;
  result?: any;
  toolCalls?: ToolCall[];
  error?: string;
}

export interface AgentRun {
  id: string;
  projectId: string;
  mission: string;
  status: RunStatus;
  provider: string;
  model: string;
  tasks: AgentTask[];
  events: ExecutionEvent[];
  startTime: string;
  endTime?: string;
  latency?: number;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface MemoryEntry {
  id: string;
  timestamp: string;
  key: string;
  value: any;
  tags: string[];
}

export interface WorkerManifest {
  name: string;
  role: string;
  capabilities: string[];
  systemPrompt: string;
}
