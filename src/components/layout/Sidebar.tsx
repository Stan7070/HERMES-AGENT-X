'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Terminal, 
  Play, 
  Settings, 
  Database, 
  Files, 
  ShieldCheck,
  Zap,
  Cpu
} from 'lucide-react';
import { useHermesStatus } from '@/lib/hooks/useHermes';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/command-center', label: 'Command Center', icon: Terminal },
  { href: '/task-execution', label: 'Runs', icon: Play },
  { href: '/skills', label: 'Skills', icon: Zap },
  { href: '/memory', label: 'Memory', icon: Database },
  { href: '/files', label: 'Files', icon: Files },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { status } = useHermesStatus();

  return (
    <aside className="w-[280px] h-full flex flex-col bg-[#131313] border-r border-[#414755]/15 z-50 glass">
      {/* Brand */}
      <div className="p-10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#c2c1ff] to-[#8382ff] flex items-center justify-center shadow-[0_0_20px_rgba(194,193,255,0.2)]">
           <ShieldCheck size={24} className="text-[#1c0b9f]" />
        </div>
        <div className="flex flex-col">
           <span className="font-display font-bold text-xl tracking-tight text-[#e5e2e1]">HERMES</span>
           <span className="text-[10px] font-bold uppercase tracking-widest text-[#c2c1ff]">Agentic OS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-3 rounded-sm transition-all duration-300 group ${
                isActive 
                  ? "bg-[#1c1b1b] border-l-2 border-[#c2c1ff] text-[#e5e2e1]" 
                  : "text-[#8b90a0] hover:text-[#e5e2e1] hover:bg-[#1c1b1b]/50"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-[#c2c1ff]" : "text-[#414755] group-hover:text-[#c1c6d7]"} />
              <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Real Live Performance Indicator */}
      <div className="p-6 mt-auto">
        <div className="bg-[#1c1b1b] p-5 rounded-sm border border-[#414755]/15 space-y-4 shadow-xl">
           <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold text-[#414755]">
              <span className="flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-[#34c759]" />
                 System Health
              </span>
              <span className="text-[#34c759]">Nominal</span>
           </div>
           
           <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold text-[#8b90a0] uppercase tracking-tighter">
                 <span>Compute</span>
                 <span>{status?.resources?.cpu || 0}%</span>
              </div>
              <div className="h-1 w-full bg-[#131313] rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-[#c2c1ff] transition-all duration-500 shadow-[0_0_8px_rgba(194,193,255,0.6)]" 
                    style={{ width: `${status?.resources?.cpu || 0}%` }} 
                 />
              </div>
           </div>

           <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold text-[#8b90a0] uppercase tracking-tighter">
                 <span>Memory</span>
                 <span>{status?.resources?.memory || 0}%</span>
              </div>
              <div className="h-1 w-full bg-[#131313] rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-[#34c759] transition-all duration-500 shadow-[0_0_8px_rgba(52,199,89,0.4)]" 
                    style={{ width: `${status?.resources?.memory || 0}%` }} 
                 />
              </div>
           </div>
           
           <div className="pt-2 border-t border-[#414755]/10 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-[#414755]">
              <div className="flex items-center gap-1.5">
                 <Cpu size={10} />
                 <span>Worker-1</span>
              </div>
              <span>{status?.uptime || 'Offline'}</span>
           </div>
        </div>
      </div>
    </aside>
  );
}
