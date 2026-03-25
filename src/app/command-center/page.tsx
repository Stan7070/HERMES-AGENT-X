'use client';
import {
  Terminal,
  Send,
  Cpu,
  Box,
  Clock,
  Activity,
  Zap,
  ChevronRight,
  RefreshCcw,
  Maximize2,
  AlertCircle,
  FileText,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Loader2,
  Paperclip,
  Smile,
  Mic,
  Check,
  CheckCheck,
  Brain,
  ListChecks,
  Monitor,
  MousePointer2,
  Keyboard,
  Eye,
  Settings,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useHermesChat, useHermesRuns, useHermesLogs, useHermesStatus } from '@/lib/hooks/useHermes';
import { ExecutionEvent, AgentTask } from '@/lib/types/hermes';

export default function CommandCenter() {
  const { status } = useHermesStatus();
  const { messages, sendMessage, isThinking, error, clearChat } = useHermesChat();
  const { runs } = useHermesRuns();
  const { logs } = useHermesLogs();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isThinking) return;
    sendMessage(input);
    setInput('');
  };

  // Extract latest events and tasks from the last assistant message
  const lastMsg = messages[messages.length - 1];
  // FIX: cast to any to access events field now correctly typed
  const activeEvents: ExecutionEvent[] = (lastMsg as any)?.events || [];
  const activeTasks: AgentTask[] = lastMsg?.tasks || [];

  return (
    <div className="flex h-full overflow-hidden bg-[#1c2833]">
      {/* ── Main Chat & Action Flow ── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 pb-32 custom-scrollbar scroll-smooth">

          {/* Empty state */}
          {messages.length === 0 && !isThinking && (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-[#2c3948] border border-[#ffffff]/10 flex items-center justify-center shadow-2xl">
                <Monitor size={48} strokeWidth={1} className="text-[#ffffff]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-display font-medium text-[#ffffff]">Hermes OS Runtime</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#94a3b8]">
                  Computer Use &amp; Computer Control Active
                </p>
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mx-auto max-w-2xl bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 rounded-xl px-5 py-3 flex items-center gap-3">
              <AlertCircle size={16} className="text-[#ffb4ab] shrink-0" />
              <span className="text-[12px] text-[#ffb4ab]">{error}</span>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg) => (
            <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {msg.role === 'user' ? (
                <div className="flex justify-end mb-6">
                  <div className="max-w-[70%] bg-[#4d79a0] px-5 py-4 rounded-2xl rounded-tr-none text-white text-[14px] shadow-xl leading-relaxed">
                    {msg.content}
                    {/* FIX: suppressHydrationWarning on timestamp to prevent SSR/client mismatch */}
                    <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                      <span
                        className="text-[9px] font-medium uppercase"
                        suppressHydrationWarning
                      >
                        {msg.timestamp?.slice(0, 5)}
                      </span>
                      <CheckCheck size={11} strokeWidth={2.5} className="text-[#83e1ff]" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* MISSION ORCHESTRATION STACK */}
                  {msg.tasks && msg.tasks.length > 0 && (
                    <div className="max-w-[85%] bg-[#162029] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="p-4 bg-[#1c2833] border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#83e1ff]">
                          <ListChecks size={14} /> Mission Execution Stack
                        </div>
                        <span className="text-[9px] font-mono text-[#94a3b8]/50 uppercase">{msg.runId}</span>
                      </div>
                      <div className="p-4 space-y-3">
                        {msg.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="bg-[#1c2833] border border-white/5 rounded-xl p-3 flex flex-col gap-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {task.status === 'running' ? (
                                  <Loader2 size={14} className="text-[#83e1ff] animate-spin" />
                                ) : task.status === 'completed' ? (
                                  <CheckCircle2 size={14} className="text-[#34c759]" />
                                ) : (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                )}
                                <span
                                  className={`text-[11px] font-bold ${
                                    task.status === 'running' ? 'text-white' : 'text-[#94a3b8]'
                                  }`}
                                >
                                  {task.title}
                                </span>
                              </div>
                              <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">
                                {task.workerName}
                              </span>
                            </div>

                            {/* TOOL CALLS */}
                            {task.toolCalls && task.toolCalls.length > 0 && (
                              <div className="pl-6 border-l border-white/5 space-y-3">
                                {task.toolCalls.map((tc) => (
                                  <div
                                    key={tc.id}
                                    className="flex flex-col gap-2 text-[10px] bg-black/20 p-3 rounded-lg border border-white/5"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Zap
                                          size={10}
                                          className={
                                            tc.status === 'success'
                                              ? 'text-[#34c759]'
                                              : tc.status === 'not_implemented'
                                              ? 'text-[#ffb000]'
                                              : tc.status === 'error'
                                              ? 'text-[#ffb4ab]'
                                              : 'text-[#83e1ff] animate-pulse'
                                          }
                                        />
                                        <span className="font-mono text-white/80">{tc.toolName}</span>
                                      </div>
                                      <span
                                        className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                          tc.executed && tc.status === 'success'
                                            ? 'bg-[#34c759]/10 text-[#34c759]'
                                            : tc.status === 'not_implemented'
                                            ? 'bg-[#ffb000]/10 text-[#ffb000] border border-[#ffb000]/30'
                                            : tc.status === 'error'
                                            ? 'bg-[#ffb4ab]/10 text-[#ffb4ab]'
                                            : 'bg-[#83e1ff]/10 text-[#83e1ff]'
                                        }`}
                                      >
                                        {tc.executed
                                          ? 'REAL EXECUTION'
                                          : tc.simulated
                                          ? 'SIMULATED / BLOCKED'
                                          : tc.status}
                                      </span>
                                    </div>

                                    {/* Artifact preview */}
                                    {tc.artifactPath && (
                                      <div className="mt-2 rounded-lg border border-white/10 overflow-hidden bg-black/40 relative group">
                                        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[8px] uppercase font-bold text-white/50 group-hover:opacity-0 transition-all z-10">
                                          Proof of Action
                                        </div>
                                        {tc.artifactPath.match(/\.(png|jpg|jpeg|webp)$/i) ? (
                                          // eslint-disable-next-line @next/next/no-img-element
                                          <img
                                            src={tc.artifactPath}
                                            alt="Tool Artifact"
                                            className="w-full h-auto max-h-40 object-cover object-top opacity-80 group-hover:opacity-100 transition-all cursor-zoom-in"
                                          />
                                        ) : (
                                          <div className="p-3 text-[#83e1ff] flex items-center gap-2">
                                            <FileText size={12} /> {tc.artifactPath}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {tc.error && (
                                      <div className="text-[9px] text-[#ffb4ab] bg-[#ffb4ab]/5 p-2 rounded border border-[#ffb4ab]/20 mt-1">
                                        {tc.error}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FINAL CONSOLIDATED RESPONSE */}
                  {msg.content && (
                    <div className="flex justify-start">
                      <div className="max-w-[70%] bg-[#2c3948] px-5 py-4 rounded-2xl rounded-tl-none text-white text-[14px] shadow-xl border border-white/10 leading-relaxed">
                        {msg.content}
                        <div className="flex items-center justify-end gap-1 mt-1 opacity-40">
                          <span
                            className="text-[9px] font-medium uppercase font-mono tracking-tighter"
                            suppressHydrationWarning
                          >
                            {msg.timestamp?.slice(0, 5)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-[#2c3948] px-5 py-4 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-3">
                <Loader2 size={16} className="text-[#83e1ff] animate-spin" />
                <span className="text-[12px] text-[#94a3b8] italic">Hermes is processing…</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* ── Action Input Area ── */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-[#1c2833] via-[#1c2833] to-transparent">
          <div className="max-w-4xl mx-auto space-y-5">
            {/* Quick-action buttons — FIX: typo "Analiser" → "Analyser" */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {[
                { label: 'Analyser MacOS', icon: Monitor },
                { label: 'Ouvrir Browser', icon: Eye },
                { label: 'Script Terminal', icon: Terminal },
                { label: 'Vision Audit', icon: MousePointer2 },
              ].map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInput(btn.label + ': ')}
                  className="px-4 py-2 rounded-xl bg-[#2c3948] border border-white/5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] hover:text-white hover:bg-[#3d4d5e] transition-all shadow-lg whitespace-nowrap"
                >
                  <btn.icon size={13} />
                  {btn.label}
                </button>
              ))}
            </div>

            {/* FIX: input field is now inside the form so Enter key submits */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="w-12 h-12 rounded-xl bg-[#2c3948] border border-white/5 text-[#94a3b8] flex items-center justify-center hover:bg-[#3d4d5e] transition-all"
              >
                <Settings size={22} strokeWidth={1.5} />
              </button>

              <form
                onSubmit={handleSubmit}
                className="flex-1 bg-[#2c3948] rounded-[18px] flex items-center px-5 py-3 gap-3 border border-white/5 focus-within:border-[#4d79a0]/50 transition-all shadow-xl"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isThinking}
                  placeholder="Assigner une mission critique…"
                  className="flex-1 bg-transparent border-none text-[15px] text-white placeholder-[#94a3b8] focus:outline-none disabled:opacity-50"
                />
              </form>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isThinking || !input.trim()}
                className="w-12 h-12 rounded-xl bg-[#4d79a0] text-white flex items-center justify-center shadow-2xl hover:bg-[#5a8bb6] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isThinking ? (
                  <RefreshCcw size={22} className="animate-spin" />
                ) : (
                  <Play size={22} fill="currentColor" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Sidebar: RUNTIME LOGS & OBSERVABILITY ── */}
      <div className="hidden xl:flex w-[380px] h-full flex-col bg-[#162029] border-l border-white/5 animate-in slide-in-from-right duration-500">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2c3948] to-[#4d79a0] flex items-center justify-center shadow-2xl">
              <Brain size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white leading-tight">Super-Agent</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34c759] shadow-[0_0_8px_#34c759]" />
                <span className="text-[9px] uppercase tracking-widest text-[#34c759] font-bold">Runtime Active</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-[#94a3b8] uppercase font-bold tracking-widest">Model Engine</span>
              <span className="text-[#83e1ff] font-mono font-bold uppercase">
                {status?.brain?.model || 'llama3.1:8b'}
              </span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#4d79a0] w-[75%] shadow-[0_0_10px_#4d79a0]" />
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
          {/* LIVE EXECUTION OVERVIEW — FIX: now uses activeEvents from SSE stream */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8] flex items-center gap-2">
              <Activity size={14} className="text-[#83e1ff]" /> Runtime Activity Flow
            </h4>
            <div className="space-y-4">
              {activeEvents.length > 0 ? (
                activeEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="relative pl-6 border-l border-white/5 animate-in fade-in slide-in-from-left-2 duration-300"
                  >
                    <div
                      className={`absolute left-[-5px] top-1.5 w-2 h-2 rounded-full ${
                        evt.level === 'error'
                          ? 'bg-[#ffb4ab]'
                          : evt.level === 'tool_call'
                          ? 'bg-[#ffb000]'
                          : evt.level === 'result'
                          ? 'bg-[#34c759]'
                          : 'bg-[#4d79a0]'
                      } shadow-lg`}
                    />
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px]">
                        <span className="text-white/80 font-bold uppercase">{evt.source}</span>
                        <span className="text-[#94a3b8] font-mono" suppressHydrationWarning>
                          {evt.timestamp.slice(11, 19)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94a3b8] leading-relaxed italic">{evt.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center space-y-3 opacity-20 grayscale">
                  <Box size={32} className="mx-auto" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Command Flow</span>
                </div>
              )}
            </div>
          </div>

          {/* RESOURCE TELEMETRY */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">Computer Resources</h4>
            <div className="space-y-4">
              {[
                { label: 'CPU Cluster', value: status?.resources?.cpu ?? 34, icon: Cpu },
                { label: 'GPU Inference', value: 58, icon: Zap },
                { label: 'Bridge Latency', value: 12, icon: Clock },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white/[0.02] p-3 rounded-xl border border-white/5"
                >
                  <stat.icon size={16} className="text-[#4d79a0]" />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bold text-[#94a3b8] uppercase tracking-tighter">
                      <span>{stat.label}</span>
                      <span className="text-white">{stat.value}%</span>
                    </div>
                    <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4d79a0] transition-all duration-1000"
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-[#1c2833]">
          <button
            type="button"
            className="w-full py-4 bg-[#2c3948] rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8] hover:text-white hover:bg-[#3d4d5e] transition-all border border-white/5 flex items-center justify-center gap-2"
          >
            <Keyboard size={16} /> Configurer Mac OS Automation
          </button>
        </div>
      </div>
    </div>
  );
}
