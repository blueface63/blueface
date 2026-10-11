import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CustomerSupportModal } from './components/CustomerSupportModal';
import { GoogleChatModal } from './components/GoogleChatModal';
import { InvestModal } from './components/InvestModal';
import { RechargeModal } from './components/RechargeModal';
import { WithdrawModal } from './components/WithdrawModal';
import { AuthModal } from './components/AuthModal';
import { PromptReferenceModal } from './components/PromptReferenceModal';
import { HomeView } from './views/HomeView';
import { ProjectView } from './views/ProjectView';
import { TeamCenterView } from './views/TeamCenterView';
import { PersonalCenterView } from './views/PersonalCenterView';

const MainContent: React.FC = () => {
  const { activeTab, isGoogleChatOpen, closeGoogleChat } = useApp();

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-between font-sans text-neutral-900 selection:bg-amber-500 selection:text-white">
      {/* Mobile container centered on desktop screens */}
      <div className="w-full max-w-md mx-auto bg-neutral-50 min-h-screen flex flex-col shadow-2xl relative">
        <Header />

        <main className="flex-1 p-3.5 sm:p-4 overflow-y-auto">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'project' && <ProjectView />}
          {activeTab === 'team' && <TeamCenterView />}
          {activeTab === 'personal' && <PersonalCenterView />}
        </main>

        <BottomNav />

        {/* Global Action Modals */}
        <CustomerSupportModal />
        <GoogleChatModal isOpen={isGoogleChatOpen} onClose={closeGoogleChat} />
        <InvestModal />
        <RechargeModal />
        <WithdrawModal />
        <AuthModal />
        <PromptReferenceModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
