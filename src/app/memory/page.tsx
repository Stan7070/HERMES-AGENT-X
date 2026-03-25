'use client';
import { 
  Database, 
  Search, 
  Trash2, 
  Download, 
  Eye, 
  Clock, 
  ChevronRight, 
  Zap, 
  RefreshCcw, 
  Layers, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Archive, 
  Filter, 
  Plus, 
  Save,
  Loader2
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useHermesMemory } from '@/lib/hooks/useHermes';

export default function MemoryVault() {
  const { memory, loading, refetch } = useHermesMemory();
  const [activeTab, setActiveTab] = useState('All Context');
  const [searchQuery, setSearchQuery] = useState('');

  // Real filtering logic
  const filteredMemory = useMemo(() => {
    return memory.filter(item => {
      const matchesTab = activeTab === 'All Context' || (item.type ?? '').toLowerCase() === activeTab.toLowerCase();
      const matchesSearch = item.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (typeof item.value === 'string' && item.value.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [memory, activeTab, searchQuery]);

  return (
    <div className="p-10 flex flex-col h-full bg-[#131313]">
      <div className="flex justify-between items-end mb-10">
        <div>
           <div className="text-xs font-semibold text-[#c2c1ff] uppercase tracking-widest mb-2">Vectorized Long-term Knowledge</div>
           <h1 className="text-4xl font-display font-medium text-[#e5e2e1]">Memory Vault</h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-[#1c1b1b] p-3 rounded-sm border border-[#414755]/15 flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${loading ? 'bg-[#ffb000] animate-pulse' : 'bg-[#34c759]'}`} />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b90a0]">Sync Active</span>
              </div>
              <div className="h-4 w-px bg-[#414755]/30" />
              <button 
                onClick={() => refetch()}
                disabled={loading}
                className="text-[10px] font-bold uppercase tracking-widest text-[#c2c1ff] flex items-center gap-2 hover:text-[#8382ff] disabled:opacity-50"
              >
                 <RefreshCcw size={12} className={loading ? 'animate-spin' : ''} />
                 Purge Dead Fragments
              </button>
           </div>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-[#c2c1ff] text-[#1c0b9f] rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-[#8382ff] shadow-[0_0_15px_rgba(194,193,255,0.4)] transition-all">
              <Plus size={14} strokeWidth={3} />
              Inject Memory Block
           </button>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Tokens Stored', value: (memory.length * 240).toLocaleString() + ' KiB', icon: Database, color: '#c2c1ff' },
            { label: 'Long-term Clusters', value: memory.length.toString(), icon: Layers, color: '#34c759' },
            { label: 'Search Latency', value: '12ms', icon: Zap, color: '#ffb000' },
          ].map((stat, i) => (
             <div key={i} className="bg-[#1c1b1b] p-6 rounded-sm border border-[#414755]/15 relative overflow-hidden group">
                <stat.icon className="absolute top-[-10px] right-[-10px] scale-150 p-2 opacity-5" size={100} color={stat.color} />
                <div className="text-[10px] font-bold text-[#8b90a0] uppercase tracking-widest mb-2">{stat.label}</div>
                <div className="text-3xl font-display font-bold text-[#e5e2e1] group-hover:text-[#c2c1ff] transition-all">{stat.value}</div>
             </div>
          ))}
       </div>

       <div className="bg-[#1c1b1b] rounded-sm border border-[#414755]/15 overflow-hidden flex-1 flex flex-col glass shadow-2xl">
          <div className="p-6 border-b border-[#414755]/15 flex items-center justify-between bg-[#131414]/30">
             <div className="flex items-center gap-6">
                {['All Context', 'System', 'User', 'History', 'Knowledge'].map((tab) => (
                   <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab)}
                     className={`text-[10px] font-bold uppercase tracking-widest pb-1 transition-all ${
                        activeTab === tab ? 'text-[#c2c1ff] border-b-2 border-[#c2c1ff]' : 'text-[#8b90a0] hover:text-[#c1c6d7]'
                     }`}
                   >
                      {tab}
                   </button>
                ))}
             </div>
             <div className="relative flex items-center group">
               <Search size={14} className="absolute left-3 text-[#8b90a0] group-focus-within:text-[#c2c1ff] transition-all" />
               <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query memory keys..." 
                  className="bg-[#131414] border border-[#414755]/30 rounded-sm py-1.5 pl-10 pr-4 text-[11px] focus:outline-none focus:border-[#c2c1ff]/30 w-[240px] transition-all"
               />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
             {loading ? (
               <div className="h-full flex flex-col items-center justify-center gap-4 opacity-30">
                  <Loader2 size={40} className="animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Accessing Vector Vault...</span>
               </div>
             ) : (
               <div className="grid grid-cols-1 divide-y divide-[#414755]/15">
                  {filteredMemory.length > 0 ? filteredMemory.map((item) => (
                     <div key={item.id} className="p-6 flex items-center justify-between hover:bg-[#131414]/50 group transition-all cursor-pointer">
                        <div className="flex items-center gap-6">
                           <div className="w-10 h-10 rounded-sm bg-[#131414] border border-[#414755]/30 flex items-center justify-center text-[#c2c1ff] group-hover:border-[#c2c1ff]/50 transition-all">
                              <Archive size={18} />
                           </div>
                           <div>
                              <div className="text-[12px] font-bold text-[#e5e2e1] mb-1 group-hover:text-[#c2c1ff] transition-all">{item.key}</div>
                              <div className="text-[11px] text-[#8b90a0] max-w-[500px] truncate">{JSON.stringify(item.value).replace(/"/g, '')}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-10">
                           <div className="text-right">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-[#c2c1ff]">{item.type}</div>
                              <div className="text-[10px] text-[#8b90a0] flex items-center gap-1 justify-end font-mono">
                                 <Clock size={10} />
                                 {item.lastUpdated ? new Date(item.lastUpdated).toLocaleTimeString() : '—'}
                              </div>
                           </div>
                           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button className="p-2 text-[#8b90a0] hover:text-[#e5e2e1] hover:bg-[#353534] rounded-sm transition-all"><Eye size={14}/></button>
                              <button className="p-2 text-[#8b90a0] hover:text-[#ffb4ab] hover:bg-[#411b1b]/30 rounded-sm transition-all"><Trash2 size={14}/></button>
                           </div>
                        </div>
                     </div>
                  )) : (
                    <div className="h-full flex flex-col items-center justify-center p-20 opacity-20 text-center gap-4">
                       <Filter size={40} strokeWidth={1} />
                       <p className="text-[10px] font-bold uppercase tracking-widest">No Fragments Matching Criteria</p>
                    </div>
                  )}
               </div>
             )}
          </div>
       </div>
    </div>
  );
}
