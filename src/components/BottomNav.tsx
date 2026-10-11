import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Layers, Users, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, userInvestments } = useApp();

  const activeCount = userInvestments.filter(i => i.status === 'running').length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 h-15">
        {/* Home */}
        <button
          id="nav-home-tab"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            activeTab === 'home' ? 'text-amber-600 font-bold' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <div className={`p-1 rounded-lg transition-transform ${activeTab === 'home' ? 'scale-110' : ''}`}>
            <Home className="w-5 h-5" strokeWidth={activeTab === 'home' ? 2.4 : 1.8} />
          </div>
          <span className="text-[10px] tracking-tight">Home page</span>
        </button>

        {/* Project */}
        <button
          id="nav-project-tab"
          onClick={() => setActiveTab('project')}
          className={`flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
            activeTab === 'project' ? 'text-amber-600 font-bold' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <div className={`p-1 rounded-lg transition-transform ${activeTab === 'project' ? 'scale-110' : ''}`}>
            <Layers className="w-5 h-5" strokeWidth={activeTab === 'project' ? 2.4 : 1.8} />
          </div>
          <span className="text-[10px] tracking-tight">Project</span>
          {activeCount > 0 && (
            <span className="absolute top-1.5 right-6 w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* Team Center */}
        <button
          id="nav-team-tab"
          onClick={() => setActiveTab('team')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            activeTab === 'team' ? 'text-amber-600 font-bold' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <div className={`p-1 rounded-lg transition-transform ${activeTab === 'team' ? 'scale-110' : ''}`}>
            <Users className="w-5 h-5" strokeWidth={activeTab === 'team' ? 2.4 : 1.8} />
          </div>
          <span className="text-[10px] tracking-tight">Team Center</span>
        </button>

        {/* Personal Center */}
        <button
          id="nav-personal-tab"
          onClick={() => setActiveTab('personal')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            activeTab === 'personal' ? 'text-amber-600 font-bold' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <div className={`p-1 rounded-lg transition-transform ${activeTab === 'personal' ? 'scale-110' : ''}`}>
            <User className="w-5 h-5" strokeWidth={activeTab === 'personal' ? 2.4 : 1.8} />
          </div>
          <span className="text-[10px] tracking-tight">Personal Center</span>
        </button>
      </div>
    </nav>
  );
};
