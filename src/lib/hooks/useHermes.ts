'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { hermesClient } from '../services/hermes-client';
import {
  HermesStatus,
  ChatMessage,
  AgentRun,
  SystemLog,
  Skill,
  MemoryEntry,
  ExecutionEvent,
  AgentTask,
} from '../types/hermes';

/**
 * Hook to manage Hermes Agent real status.
 */
export function useHermesStatus() {
  const [status, setStatus] = useState<HermesStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await hermesClient.getStatus();
      setStatus(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 5000);
    return () => clearInterval(timer);
  }, [fetchStatus]);

  return { status, loading, error, refetch: fetchStatus };
}

/**
 * Hook for Hermes Command Center Chat Logic.
 * FIX: events are now correctly propagated from SSE stream to message state.
 * FIX: timestamps are generated client-side only to avoid hydration mismatch.
 */
export function useHermesChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Abort any in-flight request
    abortControllerRef.current?.abort();

    // 1. Add user message (timestamp generated client-side only)
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);
    setError(null);

    // 2. Add empty assistant message for streaming
    const assistantId = `assistant-${Date.now() + 1}`;
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const allMessages = [...messages, userMsg];
      const controller = hermesClient.streamChat(allMessages, (update: Partial<ChatMessage>) => {
        if (update.type === 'done') {
          setIsThinking(false);
          return;
        }
        if (update.type === 'error') {
          setError((update as any).content || 'Chat failure');
          setIsThinking(false);
          return;
        }

        setMessages(prev =>
          prev.map(msg => {
            if (msg.id !== assistantId) return msg;
            return {
              ...msg,
              // Append streamed content chunks
              content: update.content
                ? msg.content + update.content
                : msg.content,
              status: (update as any).status || msg.status,
              log: (update as any).log || msg.log,
              runId: (update as any).runId || msg.runId,
              // FIX: propagate tasks array from SSE updates
              tasks: (update as any).tasks ?? msg.tasks,
              // FIX: propagate events array from SSE updates
              events: (update as any).events ?? (msg as any).events,
            };
          })
        );
      });
      abortControllerRef.current = controller;
    } catch (err: any) {
      setError(err.message);
      setIsThinking(false);
    }
  }, [messages]);

  const clearChat = () => {
    abortControllerRef.current?.abort();
    setMessages([]);
    setIsThinking(false);
    setError(null);
  };

  return { messages, sendMessage, isThinking, error, clearChat };
}

/**
 * Hook to manage Hermes Active Runs.
 */
export function useHermesRuns() {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRuns = useCallback(async () => {
    try {
      const data = await hermesClient.listRuns();
      setRuns(data || []);
    } catch (e) {
      console.error('Failed to fetch runs:', e);
      setRuns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRuns();
    const interval = setInterval(fetchRuns, 5000);
    return () => clearInterval(interval);
  }, [fetchRuns]);

  return { runs, loading, refetch: fetchRuns };
}

/**
 * Hook to manage Hermes Memory Vault.
 */
export function useHermesMemory() {
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMemory = useCallback(async () => {
    try {
      const data = await hermesClient.listMemory();
      setMemory(data || []);
    } catch (e) {
      console.error('Failed to fetch memory:', e);
      setMemory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemory();
  }, [fetchMemory]);

  return { memory, loading, refetch: fetchMemory };
}

/**
 * Hook to manage Hermes System Logs.
 */
export function useHermesLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      const data = await hermesClient.listLogs();
      setLogs(data || []);
    } catch (e) {
      console.error('Failed to fetch logs:', e);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 4000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  return { logs, loading, refetch: fetchLogs };
}
