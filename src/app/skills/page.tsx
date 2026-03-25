'use client';
import { 
  Zap, 
  Terminal, 
  Search, 
  Plus, 
  Activity, 
  Settings, 
  MoreHorizontal, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Box, 
  Files, 
  Globe, 
  Layers
} from 'lucide-react';
import React, { useState } from 'react';

const mockSkills = [
  { id: '1', name: 'Web Navigator V3', desc: 'Surgical web research and browsing capabilities with multi-tab support.', version: '3.4.2', icon: Globe, status: 'Enabled', type: 'System' },
  { id: '2', name: 'FileSystem Engineer', desc: 'Advanced file system operations, refactoring, and directory structure management.', version: '2.1.0', icon: Files, status: 'Enabled', type: 'System' },
  { id: '3', name: 'Terminal Commander', desc: 'Secure root-level terminal access with safety guards and pre-command analysis.', version: '1.8.8', icon: Terminal, status: 'Enabled', type: 'System' },
  { id: '4', name: 'Memory Synapse', desc: 'Vector-based memory indexing and historical context retrieval for complex tasks.', version: '2.0.1', icon: Activity, status: 'Enabled', type: 'Core' },
  { id: '5', name: 'UI Architect', desc: 'Generation and refinement of React components and modern web interfaces via Stitch.', version: '1.2.0', icon: Layers, status: 'Enabled', type: 'Creative' },
  { id: '6', name: 'Security Sentience', desc: 'Autonomous threat detection and credential shielding for all external runs.', version: '1.0.5', icon: ShieldCheck, status: 'Enabled', type: 'Core' },
  { id: '7', name: 'Python Analyzer', desc: 'Deep-level Python code parsing and optimization logic.', version: '0.4.5', icon: Box, status: 'Disabled', type: 'Extension' },
];

export default function SkillsStudio() {
  return (
    <div className="p-10 flex flex-col h-full bg-[#131313]">
      <div className="flex justify-between items-end mb-10">
        <div>
           <div className="text-xs font-semibold text-[#c2c1ff] uppercase tracking-widest mb-2">Engaged Capabilities</div>
           <h1 className="text-4xl font-display font-medium text-[#e5e2e1]">Skills Studio</h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative flex items-center group">
             <Search size={14} className="absolute left-3 text-[#8b90a0]" />
             <input 
                type="text" 
                placeholder="Search Skills..." 
                className="bg-[#1c1b1b] border border-[#414755]/15 rounded-sm py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[#c2c1ff]/30 w-[240px] transition-all"
             />
           </div>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-[#c2c1ff] text-[#1c0b9f] rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-[#8382ff] shadow-[0_0_15px_rgba(194,193,255,0.4)] transition-all">
              <Plus size={14} strokeWidth={3} />
              Install New Skill
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {mockSkills.map((skill) => (
            <div key={skill.id} className="bg-[#1c1b1b] border border-[#414755]/15 hover:border-[#c2c1ff]/30 p-6 rounded-sm transition-all group flex flex-col relative overflow-hidden h-[240px]">
               <div className="absolute top-0 right-0 p-3">
                  <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
                     skill.status === 'Enabled' ? 'bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20' : 'bg-[#131414] text-[#8b90a0] border-[#414755]/30'
                  }`}>
                     {skill.status}
                  </span>
               </div>
               
               <div className="mb-6 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-sm bg-[#353534] border border-[#414755]/15 flex items-center justify-center text-[#c2c1ff] group-hover:scale-110 transition-transform shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                     <skill.icon size={22} strokeWidth={1.5} />
                  </div>
                  <button className="text-[#8b90a0] hover:text-[#e5e2e1] transition-all opacity-0 group-hover:opacity-100">
                     <Settings size={14} />
                  </button>
               </div>

               <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                     <h3 className="text-sm font-display font-semibold text-[#e5e2e1]">{skill.name}</h3>
                     <span className="text-[9px] text-[#414755] font-mono">v{skill.version}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#8b90a0] line-clamp-3">{skill.desc}</p>
               </div>

               <div className="mt-4 pt-4 border-t border-[#414755]/10 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#353534]">{skill.type} Integration</span>
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
                     <span className="text-[9px] font-bold uppercase tracking-tighter text-[#8b90a0]">Nominal</span>
                  </div>
               </div>
            </div>
         ))}

         {/* Empty/Add card */}
         <div className="bg-[#131414] border-2 border-dashed border-[#414755]/15 rounded-sm flex flex-col items-center justify-center gap-4 text-[#414755] hover:border-[#c2c1ff]/30 hover:text-[#c2c1ff]/50 transition-all cursor-pointer h-[240px]">
             <div className="p-3 rounded-full bg-[#414755]/5 border border-[#414755]/20">
                <Plus size={24} strokeWidth={1} />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest">Register Adapter</span>
         </div>
      </div>
    </div>
  );
}
