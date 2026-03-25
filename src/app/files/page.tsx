'use client';
import { 
  Folder, 
  FileText, 
  Search, 
  ChevronRight, 
  MoreVertical, 
  Plus, 
  Download, 
  Trash2, 
  Share2, 
  Clock, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  Zap,
  Box
} from 'lucide-react';
import React, { useState } from 'react';

const mockFiles = [
  { id: '1', name: 'nexus_automation.py', size: '24.5 KB', type: 'Python Source', modified: '2m ago', status: 'Healthy', icon: FileText, color: '#c2c1ff' },
  { id: '2', name: 'core_engine/', size: '1.2 MB', type: 'Directory', modified: '15m ago', status: 'Healthy', icon: Folder, color: '#8382ff' },
  { id: '3', name: 'package.json', size: '1.4 KB', type: 'Configuration', modified: '1.2h ago', status: 'Healthy', icon: FileText, color: '#ffb000' },
  { id: '4', name: 'src/', size: '420.5 KB', type: 'Directory', modified: '4h ago', status: 'Healthy', icon: Folder, color: '#34c759' },
  { id: '5', name: 'README.md', size: '12.1 KB', type: 'Markdown', modified: '1d ago', status: 'Healthy', icon: FileText, color: '#c2c1ff' },
  { id: '6', name: 'logs/', size: '5.2 MB', type: 'Directory', modified: '10m ago', status: 'Healthy', icon: Folder, color: '#ffb4ab' },
  { id: '7', name: 'styles.css', size: '8.4 KB', type: 'Stylesheet', modified: '22m ago', status: 'Healthy', icon: FileText, color: '#c2c1ff' },
];

export default function FilesWorkspace() {
  const [activeTab, setActiveTab] = useState('Workspace');

  return (
    <div className="p-10 flex flex-col h-full bg-[#131313]">
      <div className="flex justify-between items-end mb-10">
        <div>
           <div className="text-xs font-semibold text-[#c2c1ff] uppercase tracking-widest mb-2">Project Asset Management</div>
           <h1 className="text-4xl font-display font-medium text-[#e5e2e1]">Files Workspace</h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative flex items-center group">
             <Search size={14} className="absolute left-3 text-[#8b90a0]" />
             <input 
                type="text" 
                placeholder="Find in Workspace..." 
                className="bg-[#1c1b1b] border border-[#414755]/15 rounded-sm py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[#c2c1ff]/30 w-[240px] transition-all"
             />
           </div>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-[#c2c1ff] text-[#1c0b9f] rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-[#8382ff] shadow-[0_0_15px_rgba(194,193,255,0.4)] transition-all">
              <Plus size={14} strokeWidth={3} />
              Ingest External Directory
           </button>
        </div>
      </div>

      <div className="flex-1 bg-[#1c1b1b] rounded-sm border border-[#414755]/15 overflow-hidden flex flex-col">
         <div className="p-6 border-b border-[#414755]/15 flex items-center justify-between">
            <div className="flex items-center gap-6">
               {['Workspace', 'Artifacts', 'Templates', 'External Sources'].map((tab) => (
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
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#8b90a0]">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={12} className="text-[#34c759]" />
                  <span>Write-Access Confirmed</span>
               </div>
               <div className="flex items-center gap-2">
                  <Clock size={12} />
                  <span>Last Sync: Just now</span>
               </div>
            </div>
         </div>

         {/* File List Header */}
         <div className="bg-[#131414] text-[#8b90a0] text-[10px] uppercase tracking-[0.2em] font-semibold border-b border-[#414755]/15">
            <div className="flex p-4 px-8">
               <div className="flex-[2]">Resource Name</div>
               <div className="flex-[1]">Size</div>
               <div className="flex-[1]">Type</div>
               <div className="flex-[1]">Last Modified</div>
               <div className="flex-[0.5] text-right">Integrity</div>
               <div className="w-10"></div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-[#414755]/15">
               {mockFiles.map((file) => (
                  <div key={file.id} className="p-4 px-8 flex items-center hover:bg-[#131414]/50 group transition-all cursor-pointer">
                     <div className="flex-[2] flex items-center gap-4">
                        <div className="w-8 h-8 rounded-sm bg-[#131414] border border-[#414755]/15 flex items-center justify-center text-[#c2c1ff] group-hover:bg-[#1c1b1b] transition-all" style={{ color: file.color }}>
                           <file.icon size={16} />
                        </div>
                        <div>
                           <div className="text-[12px] font-bold text-[#e5e2e1] mb-0.5">{file.name}</div>
                           <div className="text-[9px] uppercase tracking-tighter text-[#414755] group-hover:text-[#c2c1ff] transition-all">/hermes/workspace/{file.name}</div>
                        </div>
                     </div>
                     <div className="flex-[1] text-[11px] text-[#8b90a0] font-mono">{file.size}</div>
                     <div className="flex-[1] text-[10px] font-bold uppercase tracking-widest text-[#353534]">{file.type}</div>
                     <div className="flex-[1] text-[11px] text-[#8b90a0]">{file.modified}</div>
                     <div className="flex-[0.5] text-right flex items-center justify-end gap-2">
                        <span className="text-[9px] font-bold text-[#34c759] uppercase">{file.status}</span>
                        <div className="w-1 h-1 rounded-full bg-[#34c759]" />
                     </div>
                     <div className="w-10 flex justify-end opacity-0 group-hover:opacity-100 transition-all">
                        <MoreVertical size={16} className="text-[#8b90a0]" />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Selection Footer */}
         <div className="p-4 px-8 border-t border-[#414755]/15 bg-[#131414] flex items-center justify-between text-[10px] text-[#8b90a0] uppercase tracking-widest font-bold">
            <div className="flex items-center gap-10">
               <span>7 Items Total</span>
               <span>1.2 MB Active Workspace</span>
            </div>
            <div className="flex items-center gap-4">
               <button className="flex items-center gap-2 py-1.5 px-3 bg-[#1c1b1b] border border-[#414755]/15 rounded-sm hover:text-[#c2c1ff] transition-all"><Box size={12}/> Deploy Branch</button>
               <button className="flex items-center gap-2 py-1.5 px-3 bg-[#1c1b1b] border border-[#414755]/15 rounded-sm hover:text-[#8382ff] transition-all"><Layers size={12}/> Inspect Diff</button>
            </div>
         </div>
      </div>
    </div>
  );
}
