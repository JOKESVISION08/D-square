import React, { useState } from 'react';
import { LayoutDashboard, Map as MapIcon, Satellite, ShieldAlert } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LiveMap from './components/LiveMap';
import { cn } from './lib/utils';

type Page = 'dashboard' | 'map';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-space-black text-white selection:bg-satellite-blue selection:text-white">
      {/* Sidebar / Navigation */}
      <nav className="w-full lg:w-20 lg:min-h-screen bg-telemetry-bg border-b lg:border-b-0 lg:border-r border-white/10 flex lg:flex-col items-center justify-between lg:justify-start p-4 lg:py-8 gap-8 z-50">
        <div className="flex items-center gap-2 lg:flex-col lg:gap-8">
          <div className="w-10 h-10 bg-satellite-blue rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,112,243,0.5)]">
            <Satellite className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex lg:flex-col gap-4">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className={cn(
                "p-3 rounded-xl transition-all hover:bg-white/5",
                currentPage === 'dashboard' ? "text-satellite-blue bg-white/5" : "text-white/40"
              )}
            >
              <LayoutDashboard className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setCurrentPage('map')}
              className={cn(
                "p-3 rounded-xl transition-all hover:bg-white/5",
                currentPage === 'map' ? "text-satellite-blue bg-white/5" : "text-white/40"
              )}
            >
              <MapIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-4 mt-auto">
          <div className="p-3 text-white/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {currentPage === 'dashboard' ? <Dashboard /> : <LiveMap />}
      </main>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-satellite-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-radar-green/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
