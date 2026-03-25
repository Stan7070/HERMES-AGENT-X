'use client';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  User, 
  Activity, 
  Settings, 
  Cpu, 
  ChevronRight
} from 'lucide-react';

export default function Topbar() {
  const pathname = usePathname();
  const title = pathname === '/' ? 'Overview' : 
                pathname.slice(1).replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <header className="h-[72px] flex items-center justify-between px-8 bg-[#131414] border-b border-[#414755]/15 z-40 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-display font-medium text-[#e5e2e1] flex items-center gap-2">
          {title}
        </h2>
        <div className="h-4 w-px bg-[#414755]/30" />
        <div className="flex items-center gap-2 text-[#8b90a0] text-xs uppercase tracking-widest font-medium">
           <Activity size={14} className="text-[#34c759]" />
           <span>Agentic Core Running</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative flex items-center group">
          <Search size={16} className="absolute left-3 text-[#8b90a0] group-focus-within:text-[#c2c1ff] transition-colors" />
          <input 
            type="text" 
            placeholder="Command / Search..." 
            className="bg-[#1c1b1b] border border-[#414755]/15 rounded-sm py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#c2c1ff]/30 w-[220px] transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-sm text-[#8b90a0] hover:text-[#e5e2e1] hover:bg-[#1c1b1b] transition-all relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#c2c1ff] rounded-full border border-[#131313]" />
          </button>
          
          <div className="h-6 w-px bg-[#414755]/30 mx-1" />

          {/* User Profile */}
          <div className="flex items-center gap-3 p-1 pl-2 pr-3 rounded-sm hover:bg-[#1c1b1b] transition-all cursor-pointer group">
             <div className="w-8 h-8 rounded-full bg-[#353534] border border-[#414755]/15 flex items-center justify-center text-[#c2c1ff] overflow-hidden group-hover:border-[#c2c1ff]/50 transition-all">
                <User size={18} />
             </div>
             <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-[#e5e2e1]">Stane Hermes</div>
                <div className="text-[10px] text-[#8b90a0] uppercase tracking-tighter">Root Administrator</div>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
