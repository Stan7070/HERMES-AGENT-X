import { HermesStatus, AgentRun, ChatMessage, SystemLog, Skill, MemoryEntry } from '../types/hermes';

/**
 * Base Hermes API Client for real backend integration.
 */
export class HermesClient {
  private baseUri: string;
  private apiKey?: string;

  constructor() {
    this.baseUri = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_HERMES_BACKEND_TYPE === 'OFFICIAL' 
      ? 'http://localhost:8642/v1' 
      : '/api/hermes';
    this.apiKey = 'ollama'; // Default for bridge
  }

  private async fetcher<T>(path: string, options?: RequestInit): Promise<T> {
    const headers = new Headers(options?.headers);
    if (this.apiKey) {
      headers.set('Authorization', `Bearer ${this.apiKey}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${this.baseUri}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `Hermes API Error: ${response.status}`);
    }

    const json = await response.json();
    return json.data as T;
  }

  public async getStatus(): Promise<HermesStatus> { return this.fetcher<HermesStatus>('/status'); }
  public async listRuns(): Promise<AgentRun[]> { return this.fetcher<AgentRun[]>('/runs'); }
  public async listLogs(): Promise<SystemLog[]> { return this.fetcher<SystemLog[]>('/logs'); }
  public async listMemory(): Promise<MemoryEntry[]> { return this.fetcher<MemoryEntry[]>('/memory'); }
  public async listSkills(): Promise<Skill[]> { return this.fetcher<Skill[]>('/skills'); }

  public streamChat(messages: ChatMessage[], onUpdate: (chunk: Partial<ChatMessage>) => void): AbortController {
    const controller = new AbortController();
    
    fetch(`${this.baseUri}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    }).then(async response => {
       const reader = response.body?.getReader();
       if (!reader) {
          onUpdate({ type: 'done' });
          return;
       }

       const decoder = new TextDecoder();
       const processLine = (line: string) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const jsonStr = trimmed.replace('data: ', '').trim();
              if (jsonStr === '[DONE]') return;
              const data = JSON.parse(jsonStr);
              onUpdate(data);
            } catch (e) {
              console.error('SSE Parse Error:', e, trimmed);
            }
          }
       };

       try {
          let buffer = '';
          while (true) {
             const { done, value } = await reader.read();
             if (done) break;
             
             buffer += decoder.decode(value, { stream: true });
             const lines = buffer.split('\n');
             buffer = lines.pop() || '';
             
             for (const line of lines) {
                processLine(line);
             }
          }
       } catch (err: any) {
          if (err.name !== 'AbortError') onUpdate({ type: 'error', content: err.message });
       } finally {
          reader.releaseLock();
          onUpdate({ type: 'done' });
       }
    }).catch(err => {
       if (err.name !== 'AbortError') onUpdate({ type: 'error', content: err.message });
    });

    return controller;
  }
}

export const hermesClient = new HermesClient();
