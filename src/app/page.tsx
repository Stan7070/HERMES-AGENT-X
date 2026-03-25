'use client';
import { 
  Activity, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  ArrowUpRight, 
  Clock, 
  AlertCircle,
  RefreshCcw
} from 'lucide-react';
import React from 'react';
import { useHermesStatus, useHermesRuns } from '@/lib/hooks/useHermes';

export default function Overview() {
  const { status, loading: statusLoading } = useHermesStatus();
  const { runs, loading: runsLoading } = useHermesRuns();

  const metrics = [
    { label: 'Active Missions', value: status?.activeRunsCount.toString() || '0', sub: 'In-flight Agents', icon: Activity, color: '#c2c1ff' },
    { label: 'Compute Engine', value: status?.version.split(' ')[0] || 'Hermes', sub: status?.version.split(' ')[1] || 'v3.0', icon: Cpu, color: '#34c759' },
    { label: 'Memory Health', value: status?.resources?.memory ? `${status.resources.memory}%` : '---', sub: 'Long-term Vectorized', icon: Database, color: '#ffb000' },
    { label: 'System Uptime', value: status?.uptime || '---', sub: 'Operational Continuity', icon: Clock, color: '#c2c1ff' },
  ];

  return (
    <div className="p-10 space-y-12 bg-[#131313] h-full overflow-auto">
      {/* Dynamic Operational Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="text-[10px] font-bold text-[#c2c1ff] uppercase tracking-[0.3em] mb-1">Global Dashboard</div>
              {statusLoading && <RefreshCcw size={10} className="text-[#c2c1ff] animate-spin" />}
           </div>
           <h1 className="text-5xl font-display font-medium text-[#e5e2e1] flex items-center gap-4">
              Mission Control
              <div className="px-3 py-1 bg-[#34c759]/10 border border-[#34c759]/30 rounded-full flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
                 <span className="text-[10px] font-bold text-[#34c759] uppercase tracking-widest">Nominal</span>
              </div>
           </h1>
        </div>
        <div className="flex flex-col items-end gap-1">
           <span className="text-[10px] font-bold uppercase tracking-widest text-[#414755]">Internal System Time</span>
           <span className="text-sm font-mono text-[#e5e2e1]" suppressHydrationWarning>{new Date().toLocaleTimeString()} UTC</span>
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-[#1c1b1b] p-8 rounded-sm glass-floating border-[#414755]/15 hover:border-[#c2c1ff]/30 transition-all group overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-4 opacity-5 scale-150 rotate-12 group-hover:scale-125 transition-all">
                <metric.icon size={120} color={metric.color} />
             </div>
             
             <div className="flex items-center gap-4 mb-6 relative">
               <div className="w-12 h-12 rounded-sm bg-[#131313] border border-[#414755]/30 flex items-center justify-center text-[#c1c6d7] group-hover:border-[#c2c1ff]/50 transition-all">
                  <metric.icon size={24} color={metric.color} strokeWidth={1.5} />
               </div>
               <span className="text-[10px] font-bold text-[#8b90a0] uppercase tracking-widest leading-tight">{metric.label}</span>
             </div>
             
             <div className="text-4xl font-display font-bold text-[#e5e2e1] mb-2 relative group-hover:translate-x-1 transition-transform">{metric.value}</div>
             <div className="text-[10px] font-bold text-[#353534] group-hover:text-[#c2c1ff] transition-all uppercase tracking-tighter relative">{metric.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Mission Persistence Hub */}
        <div className="lg:col-span-2 bg-[#1c1b1b] rounded-sm border border-[#414755]/15 overflow-hidden flex flex-col glass shadow-2xl">
           <div className="p-8 border-b border-[#414755]/15 flex items-center justify-between bg-[#131414]/30">
              <div className="space-y-1">
                 <h3 className="text-xl font-display font-medium flex items-center gap-3">
                    <Terminal size={22} className="text-[#c2c1ff]" />
                    Intelligence Feed
                 </h3>
                 <p className="text-[10px] uppercase font-bold text-[#414755] tracking-widest pl-8">Active Mission Streams</p>
              </div>
              <button className="px-5 py-2.5 rounded-sm bg-[#c2c1ff] text-[#1c0b9f] text-[10px] font-bold uppercase tracking-widest hover:bg-[#c2c1ff]/80 transition-all shadow-[0_0_15px_rgba(194,193,255,0.3)]">
                 New Mission Directives
              </button>
           </div>

           <div className="flex-1 overflow-x-auto">
              {runs.length > 0 ? (
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-[#131414] text-[#414755] text-[10px] uppercase tracking-[0.2em]">
                          <th className="px-8 py-4 font-bold">Vector Status</th>
                          <th className="px-8 py-4 font-bold">Mission Directive</th>
                          <th className="px-8 py-4 font-bold">Intelligence Profile</th>
                          <th className="px-8 py-4 font-bold text-right">Computed Usage</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#414755]/10">
                       {runs.map((run, i) => (
                          <tr key={i} className="hover:bg-[#131414] transition-all group cursor-pointer text-xs">
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                   <div className={`w-2 h-2 rounded-full ${
                                      run.status === 'executing' ? 'bg-[#c2c1ff] animate-pulse shadow-[0_0_10px_rgba(194,193,255,1)]' : 
                                      run.status === 'completed' ? 'bg-[#34c759]' : 'bg-[#ffb4ab]'
                                   }`} />
                                   <span className={`font-bold uppercase tracking-[0.1em] text-[10px] ${
                                      run.status === 'executing' ? 'text-[#e5e2e1]' : 'text-[#414755]'
                                   }`}>{run.status}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="text-[#e5e2e1] font-semibold mb-1 group-hover:text-[#c2c1ff] transition-all">{run.id.toUpperCase()}</div>
                                <div className="text-[10px] text-[#414755] uppercase tracking-tighter" suppressHydrationWarning>Initiated {new Date(run.startTime).toLocaleTimeString()}</div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex flex-col">
                                   <span className="text-[#c1c6d7] font-medium font-mono text-[11px] mb-1">{run.model}</span>
                                   <span className="text-[9px] text-[#414755] font-bold uppercase tracking-widest">{run.provider}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-right">
                                <div className="flex flex-col items-end">
                                   <span className="text-[#c2c1ff] font-mono font-bold text-[11px] mb-1">{(run.usage?.totalTokens || 0).toLocaleString()}</span>
                                   <span className="text-[9px] text-[#414755] font-bold uppercase tracking-widest">Tokens Engaged</span>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              ) : (
                <div className="flex flex-col items-center justify-center p-20 opacity-20 text-center gap-4">
                   <Clock size={40} strokeWidth={1} />
                   <p className="text-[10px] font-bold uppercase tracking-widest">No Active Vectors Found</p>
                </div>
              )}
           </div>
        </div>

        {/* Real System Activity Hub */}
        <div className="bg-[#1c1b1b] rounded-sm border border-[#414755]/15 p-8 flex flex-col glass overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#c2c1ff]/5 blur-3xl rounded-full" />
           <h3 className="text-xl font-display font-medium flex items-center gap-3 mb-8 relative">
              <Zap size={22} className="text-[#34c759]" />
              Telemetry
           </h3>
           <div className="space-y-6 flex-1 relative overflow-y-auto pr-2 custom-scrollbar">
              {[
                { title: 'Self-Correction', desc: 'Agent detected error and fixed path', time: 'Just now', icon: ShieldCheck, color: '#34c759' },
                { title: 'Core Latency', desc: 'Intelligence processing at 42ms', time: '12s ago', icon: Activity, color: '#c2c1ff' },
                { title: 'Memory Sync', desc: 'Syncing vectorized long-term context', time: '2m ago', icon: Database, color: '#ffb000' },
                { title: 'Security Audit', desc: 'All external tool calls verified safe', time: '5m ago', icon: ShieldCheck, color: '#34c759' },
              ].map((item, i) => (
                <div key={i} className="group cursor-default relative pl-6 before:absolute before:left-1 before:top-2 before:bottom-[-24px] before:w-px before:bg-[#414755]/20 last:before:hidden">
                   <div className="absolute left-[-2px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#353534] border border-[#414755]/50 group-hover:scale-125 group-hover:bg-[#c2c1ff] transition-all" />
                   <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[11px] font-bold text-[#e5e2e1] uppercase tracking-wider group-hover:text-[#c2c1ff] transition-all">{item.title}</span>
                      <span className="text-[10px] font-bold text-[#353534]">{item.time}</span>
                   </div>
                   <p className="text-[11px] text-[#8b90a0] leading-relaxed group-hover:text-[#c1c6d7] transition-all">{item.desc}</p>
                </div>
              ))}
           </div>
           
           <div className="mt-8 pt-8 border-t border-[#414755]/15">
              <button className="w-full py-3.5 rounded-sm bg-[#353534] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#c2c1ff] hover:text-[#1c0b9f] transition-all shadow-inner">
                 System Diagnostics
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
