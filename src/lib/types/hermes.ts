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
  // Optional fields used in memory page
  type?: string;
  lastUpdated?: string;
}

export interface WorkerManifest {
  name: string;
  role: string;
  capabilities: string[];
  systemPrompt: string;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: string;
  message: string;
  timestamp: string;
}

export interface HermesStatus {
  isHealthy: boolean;
  version: string;
  uptime: string;
  activeRunsCount: number;
  brain: {
    model: string;
    backend: string;
  };
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: string;
  enabled: boolean;
  lastUsed?: string;
}

/**
 * ChatMessage — extended with runtime fields populated by SSE stream.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  // SSE stream fields
  type?: string;
  status?: string;
  log?: string;
  runId?: string;
  tasks?: AgentTask[];
  events?: ExecutionEvent[];
}
