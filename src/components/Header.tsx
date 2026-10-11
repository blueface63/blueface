import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Smartphone, Globe, Sparkles, X, CheckCircle2, MessageSquare } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    toggleLanguage,
    currency,
    toggleCurrency,
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    setIsPromptModalOpen,
    openGoogleChat,
    user,
    openAuthModal
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-black text-base tracking-tighter">
            T
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-lg tracking-tight text-neutral-900 leading-none">
                TKASH
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm bg-amber-500 text-white leading-none">
                VIP
              </span>
            </div>
            <span className="text-[9px] font-medium text-neutral-500 block leading-tight">
              Micro Mining & Daily Yields
            </span>
          </div>
        </div>

        {/* Action Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Google Chat Button */}
          <button
            id="google-chat-header-btn"
            onClick={openGoogleChat}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 active:scale-95 transition-all shadow-2xs"
            title="Open Google Chat"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px]">Chat</span>
          </button>

          {/* Prompt Guide Button */}
          <button
            id="prompt-guide-btn"
            onClick={() => setIsPromptModalOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors shadow-2xs"
            title="View Tkash Platform Prompt Spec"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span className="text-[11px] font-bold">Prompt</span>
          </button>

          {/* App download badge */}
          <button
            id="app-download-btn"
            onClick={() => {
              alert('Tkash PWA APK v2.4 ready for installation. Add to your Home Screen for one-tap daily earnings access.');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-linear-to-r from-pink-600 to-rose-600 text-white text-xs font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[11px]">APP</span>
          </button>

          {/* Currency Toggle */}
          <button
            id="currency-toggle-btn"
            onClick={toggleCurrency}
            className="px-2 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold border border-neutral-200 transition-colors"
            title="Toggle KES / USD"
          >
            {currency}
          </button>

          {/* Language Switch */}
          <button
            id="language-switch-btn"
            onClick={toggleLanguage}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 font-semibold text-xs flex items-center gap-0.5"
            title="Switch English / Kiswahili"
          >
            <Globe className="w-4 h-4 text-neutral-600" />
            <span className="text-[10px] font-bold uppercase">{language}</span>
          </button>

          {/* Notification Bell */}
          <button
            id="notifications-btn"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-1.5 rounded-full hover:bg-neutral-100 text-neutral-700"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>

      {/* Notification Drawer Modal */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-neutral-800 text-sm">System Announcements</h3>
              </div>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-200 text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className="p-3.5 rounded-xl border border-amber-100/80 bg-amber-50/40 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-neutral-900">{n.title}</span>
                    <span className="text-[10px] text-neutral-400 font-medium">{n.date}</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{n.message}</p>
                </div>
              ))}

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold">M-Pesa & T-Kash Security Verified</p>
                  <p className="text-emerald-700 text-[11px] mt-0.5">
                    All deposits and payouts are protected by 256-bit automated encryption protocols.
                  </p>
                </div>
              </div>
            </div>

            {!user && (
              <div className="p-4 border-t border-neutral-100 bg-neutral-50">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    openAuthModal('register');
                  }}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                >
                  Register Now & Claim 200 KES Bonus
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
