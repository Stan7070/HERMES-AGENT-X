import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export const metadata: Metadata = {
  title: 'Hermes OS - Intelligent Execution System',
  description: 'The ultra-premium, AI-first environment for surgical precision.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="flex h-screen w-screen overflow-hidden bg-[#131313] text-[#e5e2e1]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        <div className="fixed top-0 left-0 w-full h-[2px] z-[9999]">
             <div className="ai-pulse" />
        </div>
      </body>
    </html>
  );
}
