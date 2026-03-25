'use client';
import { 
  Play, 
  Terminal, 
  Database, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Clock, 
  Activity, 
  Menu,
  MoreVertical,
  Activity as ActivityIcon,
  Cpu,
  ArrowLeft,
  X,
  Zap,
  Loader2,
  Calendar,
  History,
  MessageSquare,
  ListChecks,
  Monitor,
  MousePointer2,
  Eye,
  Settings,
  Brain
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useHermesRuns, useHermesLogs } from '@/lib/hooks/useHermes';

export default function TaskExecution() {
  const { runs, loading } = useHermesRuns();
  const { logs } = useHermesLogs();
  const [filter, setFilter] = useState('All Runs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  // Filtering logic
  const filteredRuns = useMemo(() => {
    return runs.filter(run => {
      const matchesTab = filter === 'All Runs' || run.status.toLowerCase() === filter.toLowerCase();
      const matchesSearch = run.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (run.mission?.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [runs, filter, searchQuery]);

  const selectedRun = useMemo(() => 
    runs.find(r => r.id === selectedRunId), 
  [runs, selectedRunId]);

  return (
    <div className="p-10 flex flex-col h-full bg-[#1c2833] relative overflow-hidden">
      <div className="flex justify-between items-end mb-10">
        <div>
           <div className="text-xs font-semibold text-[#83e1ff] uppercase tracking-[0.2em] mb-2">Agent Runtime Registry</div>
           <h1 className="text-4xl font-display font-medium text-white">Execution Logs & Runs</h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-[#162029] p-3 px-5 rounded-2xl border border-white/5 flex items-center gap-4 shadow-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Uptime Cluster: 4d 12h</span>
           </div>
        </div>
      </div>

      {/* Main Stats Cluster */}
      <div className="grid grid-cols-4 gap-6 mb-10">
         {[
           { label: 'Agentic Missions', value: runs.length.toString(), icon: Monitor, color: '#4d79a0' },
           { label: 'Automation Success', value: '98.4%', icon: Zap, color: '#34c759' },
           { label: 'Execution Latency', value: '840ms', icon: Clock, color: '#ffb000' },
           { label: 'Computer Activity', value: 'Active', icon: Cpu, color: '#ffffff' },
         ].map((stat, i) => (
            <div key={i} className="bg-[#162029] p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-[#4d79a0]/30 transition-all shadow-xl">
               <div>
                  <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-2xl font-display font-bold text-white leading-none">{stat.value}</div>
               </div>
               <stat.icon size={28} className="text-[#1c2833]" color={stat.color} />
            </div>
         ))}
      </div>

      {/* Runs Explorer */}
      <div className="flex-1 bg-[#162029] rounded-2xl border border-white/5 overflow-hidden flex flex-col shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <div className="p-8 border-b border-white/5 flex items-center gap-8 bg-white/[0.02]">
             {['All Runs', 'Executing', 'Completed', 'Failed'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setFilter(tab)}
                  className={`text-[11px] font-bold uppercase tracking-widest pb-3 transition-all border-b-2 ${
                     filter === tab ? 'text-[#83e1ff] border-[#83e1ff]' : 'text-[#94a3b8] border-transparent hover:text-white'
                  }`}
                >
                   {tab}
                </button>
             ))}
             <div className="flex-1" />
             <div className="relative group flex items-center">
               <Search size={16} className="absolute left-4 text-[#94a3b8] group-focus-within:text-[#4d79a0] transition-colors" />
               <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ID / Mission Narrative / Worker..." 
                  className="bg-[#1c2833] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-[12px] focus:outline-none focus:border-[#4d79a0] w-[350px] transition-all text-white placeholder-white/20"
               />
             </div>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar">
             {loading ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 gap-6">
                   <Loader2 size={48} className="animate-spin text-[#4d79a0]" />
                   <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-white">Connecting to Runtime Database...</span>
                </div>
             ) : (
                <table className="w-full text-left border-collapse min-w-[1200px]">
                   <thead>
                      <tr className="bg-[#1c2833] sticky top-0 z-10 text-[#94a3b8] text-[10px] uppercase tracking-[0.3em] border-b border-white/5">
                         <th className="px-10 py-5 font-bold w-32">Status</th>
                         <th className="px-10 py-5 font-bold">Mission Instruction</th>
                         <th className="px-10 py-5 font-bold">Runtime Stack</th>
                         <th className="px-10 py-5 font-bold">Executed At</th>
                         <th className="px-10 py-5 font-bold">Automation Tools</th>
                         <th className="px-10 py-5 font-bold w-12"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/[0.04]">
                      {filteredRuns.map((run) => (
                         <tr 
                           key={run.id} 
                           onClick={() => setSelectedRunId(run.id)}
                           className={`hover:bg-white/[0.02] transition-all group cursor-pointer text-[13px] ${selectedRunId === run.id ? 'bg-[#4d79a0]/5' : ''}`}
                         >
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-3">
                                  {run.status === 'executing' ? <RefreshCcw size={18} className="text-[#83e1ff] animate-spin" /> :
                                   run.status === 'completed' ? <CheckCircle2 size={18} className="text-[#34c759]" /> :
                                   <XCircle size={18} className="text-[#ffb4ab]" />}
                                  <span className={`text-[10px] font-bold uppercase tracking-widest ${run.status === 'completed' ? 'text-[#34c759]' : 'text-[#94a3b8]'}`}>{run.status}</span>
                               </div>
                            </td>
                            <td className="px-10 py-8">
                               <div className="font-bold text-white mb-2 leading-tight group-hover:text-[#4d79a0] transition-all">
                                  {run.mission?.substring(0, 60) || 'Routine Maintenance'}...
                               </div>
                               <div className="text-[9px] font-mono text-[#94a3b8]/50 uppercase tracking-tighter">{run.id}</div>
                            </td>
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-2xl bg-[#1c2833] border border-white/5 flex items-center justify-center text-[#4d79a0] shadow-2xl">
                                     <Brain size={20} />
                                  </div>
                                  <div>
                                     <div className="text-[12px] font-bold text-white uppercase tracking-tight">{run.model}</div>
                                     <div className="text-[9px] text-[#94a3b8] uppercase tracking-widest font-bold">{run.provider} / Runtime v1.2</div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-8 text-white/60 font-mono text-[11px]">{new Date(run.startTime).toLocaleString()}</td>
                            <td className="px-10 py-8">
                               <div className="flex gap-2">
                                  {run.tasks?.slice(0, 3).map((t, idx) => (
                                    <div key={idx} className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[#94a3b8] hover:text-[#4d79a0] transition-colors" title={t.title}>
                                       {t.type === 'browser' ? <Eye size={12}/> : t.type === 'desktop' ? <Monitor size={12}/> : <Terminal size={12}/>}
                                    </div>
                                  ))}
                                  {run.tasks && run.tasks.length > 3 && <div className="text-[9px] font-bold text-[#94a3b8] flex items-center pl-1">+{run.tasks.length - 3}</div>}
                               </div>
                            </td>
                            <td className="px-10 py-8 opacity-0 group-hover:opacity-100 transition-all">
                               <ChevronRight size={22} className="text-[#4d79a0]" />
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             )}
          </div>
      </div>

      {/* AUDIT DRAWER - COMPUTER USE PERSPECTIVE */}
      {selectedRunId && (
        <>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-all" onClick={() => setSelectedRunId(null)} />
          <div className="fixed top-0 right-0 w-[650px] h-full bg-[#162029] border-l border-white/10 z-50 shadow-[-50px_0_150px_rgba(0,0,0,0.9)] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
             
             {/* Drawer Header */}
             <div className="p-10 border-b border-white/5 flex items-center justify-between bg-[#1c2833]">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-2xl bg-[#4d79a0]/10 border border-[#4d79a0]/30 flex items-center justify-center text-[#4d79a0] shadow-2xl">
                      <Monitor size={28} />
                   </div>
                   <div>
                      <h3 className="text-[11px] font-bold text-[#83e1ff] uppercase tracking-[0.3em] mb-2 leading-none">Mission Runtime Audit</h3>
                      <div className="text-2xl font-display font-bold text-white leading-none">{selectedRun?.id}</div>
                   </div>
                </div>
                <button onClick={() => setSelectedRunId(null)} className="w-12 h-12 rounded-2xl bg-white/5 text-[#94a3b8] hover:text-[#ffb4ab] transition-all flex items-center justify-center"><X size={28}/></button>
             </div>

             <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12 bg-[radial-gradient(circle_at_top_right,rgba(77,121,160,0.08),transparent)]">
                
                {/* Mission Summary Bubble */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.3em] flex items-center gap-2">
                       <MessageSquare size={14} className="text-[#4d79a0]" /> Original Mission Directive
                   </h4>
                   <div className="bg-[#4d79a0] p-6 rounded-[28px] rounded-tr-none text-white text-[15px] shadow-2xl leading-relaxed">
                      {selectedRun?.mission}
                   </div>
                </div>

                {/* AGENTIC EXECUTION SEQUENCE */}
                <div className="space-y-6">
                   <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.3em] flex items-center gap-2">
                       <ListChecks size={14} className="text-[#83e1ff]" /> Execution Sequence & Workers
                   </h4>
                   <div className="space-y-4">
                      {selectedRun?.tasks?.map((task) => (
                        <div key={task.id} className="bg-[#1c2833] border border-white/5 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-[#4d79a0]/40">
                           <div className="p-5 flex items-center justify-between bg-white/[0.02]">
                              <div className="flex items-center gap-4">
                                 <div className={`p-2 rounded-xl ${task.status === 'completed' ? 'bg-[#34c759]/10 text-[#34c759]' : 'bg-[#83e1ff]/10 text-[#83e1ff]'} border border-current/20`}>
                                    {task.type === 'browser' ? <Eye size={16}/> : task.type === 'desktop' ? <Monitor size={16}/> : <Terminal size={16}/>}
                                 </div>
                                 <div>
                                    <div className="text-[12px] font-bold text-white uppercase tracking-tight">{task.title}</div>
                                    <div className="text-[9px] text-[#94a3b8] uppercase font-bold tracking-widest">{task.workerName}</div>
                                 </div>
                              </div>
                              <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${task.status === 'completed' ? 'bg-[#34c759]/10 text-[#34c759]' : 'bg-white/5 text-[#94a3b8]'}`}>
                                 {task.status}
                              </div>
                           </div>

                           {/* Tasks Tool Calls */}
                           {task.toolCalls && task.toolCalls.length > 0 && (
                             <div className="p-5 pt-2 space-y-3">
                                {task.toolCalls.map((tc) => (
                                  <div key={tc.id} className={`bg-black/30 p-4 rounded-xl border space-y-4 group ${
                                    tc.status === 'success' ? 'border-[#34c759]/20' : 
                                    tc.status === 'not_implemented' ? 'border-[#ffb000]/30' : 
                                    tc.status === 'error' ? 'border-[#ffb4ab]/30' : 'border-white/5'
                                  }`}>
                                     <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                        <div className="flex items-center gap-3">
                                           <Zap size={14} className={
                                              tc.status === 'success' ? 'text-[#34c759]' : 
                                              tc.status === 'not_implemented' ? 'text-[#ffb000]' : 
                                              tc.status === 'error' ? 'text-[#ffb4ab]' : 'text-[#83e1ff]'
                                           } />
                                           <span className="text-[11px] font-mono font-bold text-white/90">{tc.toolName}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                           tc.executed && tc.status === 'success' ? 'bg-[#34c759]/10 text-[#34c759]' :
                                           tc.status === 'not_implemented' ? 'bg-[#ffb000]/10 text-[#ffb000]' :
                                           tc.status === 'error' ? 'bg-[#ffb4ab]/10 text-[#ffb4ab]' : 'bg-[#83e1ff]/10 text-[#83e1ff]'
                                        }`}>
                                           {tc.executed ? 'REAL EXECUTION' : tc.simulated ? 'SIMULATED / BLOCKED' : tc.status}
                                        </span>
                                     </div>
                                     <div className="bg-[#0b1219] p-3 rounded-lg border border-white/5 font-mono text-[10px] text-[#94a3b8] overflow-x-auto">
                                        <div className="text-[9px] text-[#4d79a0] mb-1">ARGS:</div>
                                        {JSON.stringify(tc.args, null, 2)}
                                     </div>
                                     
                                     {/* EVIDENCE / ARTIFACT PREVIEW */}
                                     {tc.artifactPath && (
                                        <div className="mt-2 rounded-lg border border-[#34c759]/20 overflow-hidden bg-black/40 relative group/img shadow-2xl">
                                           <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[8px] uppercase font-bold text-white z-10">Proof of Action</div>
                                           {tc.artifactPath.match(/\.(png|jpg|jpeg|webp)$/i) ? (
                                              // eslint-disable-next-line @next/next/no-img-element
                                              <img src={tc.artifactPath} alt="Tool Artifact Evidence" className="w-full h-auto object-cover object-top opacity-90 group-hover/img:opacity-100 transition-all cursor-crosshair" />
                                           ) : (
                                              <div className="p-4 text-[#34c759] flex items-center gap-2 font-mono text-[10px]"><Database size={12}/> {tc.artifactPath}</div>
                                           )}
                                        </div>
                                     )}

                                     {tc.error && (
                                        <div className="text-[10px] text-[#ffb4ab] bg-[#ffb4ab]/5 p-3 rounded border border-[#ffb4ab]/20 mt-1 font-mono">
                                           <div className="text-[8px] font-bold uppercase mb-1 opacity-50">Execution Error:</div>
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

                {/* RUNTIME ACTIVITY FLOW (Vertical Log) */}
                <div className="space-y-6">
                   <h4 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.3em] flex items-center gap-2">
                      <ActivityIcon size={14} className="text-[#ffb000]" /> Low-Level Runtime Sequence
                   </h4>
                   <div className="bg-[#0b1219] p-8 rounded-[28px] border border-white/5 space-y-6 shadow-inner max-h-[400px] overflow-y-auto custom-scrollbar">
                      {selectedRun?.events?.map((evt) => (
                        <div key={evt.id} className="flex gap-6 animate-in fade-in slide-in-from-left duration-400">
                           <div className="shrink-0 text-[10px] font-mono text-[#414b5a] pt-1">{evt.timestamp.slice(11, 19)}</div>
                           <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                 <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                    evt.level === 'error' ? 'bg-[#ffb4ab]/10 text-[#ffb4ab]' : 
                                    evt.level === 'tool_call' ? 'bg-[#ffb000]/10 text-[#ffb000]' : 
                                    'bg-[#4d79a0]/10 text-[#4d79a0]'
                                 }`}>
                                    {evt.level}
                                 </span>
                                 <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">{evt.source}</span>
                              </div>
                              <p className="text-[13px] text-[#94a3b8] leading-relaxed border-l-2 border-white/5 pl-4 ml-1">
                                 {evt.message}
                              </p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Footer Actions */}
             <div className="p-10 border-t border-white/5 bg-[#1c2833] flex gap-4">
                <button className="flex-1 py-4 bg-[#2c3948] text-[#94a3b8] rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:text-white transition-all shadow-xl">
                   Download Compliance Audit
                </button>
                <button className="flex-1 py-4 bg-[#4d79a0] text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#5a8bb6] transition-all shadow-2xl">
                   Re-execute Mission Run
                </button>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
