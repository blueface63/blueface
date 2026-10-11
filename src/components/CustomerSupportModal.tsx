import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Send, X, ShieldCheck, CheckCheck, Users } from 'lucide-react';

interface ChatMsg {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const CustomerSupportModal: React.FC = () => {
  const { isCustomerSupportOpen, setIsCustomerSupportOpen, openGoogleChat, user } = useApp();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Hello ${user ? user.phone : 'Investor'}! Welcome to Tkash Official Support Desk. How can I assist you today?`,
      time: 'Just now'
    }
  ]);

  const quickQuestions = [
    'How do I deposit with M-Pesa / T-Kash?',
    'What is the daily income payout time?',
    'How does the 3-tier team referral bonus work?',
    'Minimum withdrawal rules'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate automated smart response
    setTimeout(() => {
      let reply = 'Thank you for contacting Tkash. An agent is reviewing your account.';
      const lower = query.toLowerCase();

      if (lower.includes('deposit') || lower.includes('m-pesa') || lower.includes('mpesa') || lower.includes('recharge')) {
        reply = 'Deposits in Tkash are automated via M-Pesa STK Push. Go to Personal Center or Home > Recharge, select your amount (e.g. 299 KES, 499 KES), enter your Safaricom phone number, and enter your M-Pesa PIN when prompted on your phone.';
      } else if (lower.includes('daily') || lower.includes('income') || lower.includes('time') || lower.includes('payout')) {
        reply = 'Daily earnings are calculated every 24 hours from the time your mine package was activated. You can click "Claim Daily Yields" on the Project tab to transfer earnings into your withdrawable wallet balance!';
      } else if (lower.includes('referral') || lower.includes('team') || lower.includes('commission') || lower.includes('tier')) {
        reply = 'Tkash offers a 3-tier commission system: Level 1 direct invites earn you 10% of their investment, Level 2 earns 4%, and Level 3 earns 1%. Share your link with code ' + (user?.referralCode || '652511') + ' to start earning passive team commissions!';
      } else if (lower.includes('withdraw')) {
        reply = 'Withdrawals are processed 24/7 directly to your registered M-Pesa or T-Kash phone number. Minimum withdrawal is 100 KES. Funds typically arrive within 1 to 5 minutes.';
      }

      const botMsg: ChatMsg = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Avatar Trigger Button */}
      <button
        id="floating-support-avatar"
        onClick={() => setIsCustomerSupportOpen(true)}
        className="fixed bottom-18 right-4 z-40 p-1 rounded-full bg-linear-to-tr from-rose-600 to-pink-500 shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all group"
        aria-label="Open Customer Support"
      >
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
            alt="Tkash Support Agent"
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
      </button>

      {/* Support Chat Modal */}
      {isCustomerSupportOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl h-[82vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-4 bg-linear-to-r from-rose-600 via-pink-600 to-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/80">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                    alt="Agent Sharon"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm">Sharon - Tkash Support</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <p className="text-[11px] text-rose-100 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Official 24/7 Verified Desk
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setIsCustomerSupportOpen(false);
                    openGoogleChat();
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[10px] font-extrabold flex items-center gap-1 transition-all"
                  title="Switch to Google Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Google Chat</span>
                </button>
                <button
                  onClick={() => setIsCustomerSupportOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto bg-neutral-50 space-y-3">
              <div className="text-center my-2">
                <span className="text-[10px] bg-neutral-200 text-neutral-600 px-2.5 py-1 rounded-full font-medium">
                  End-to-End Encrypted Customer Support
                </span>
              </div>

              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-rose-600 text-white rounded-br-xs'
                        : 'bg-white text-neutral-800 border border-neutral-200/80 shadow-2xs rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1 flex items-center gap-1 justify-end ${
                        msg.sender === 'user' ? 'text-rose-200' : 'text-neutral-400'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {msg.sender === 'user' && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick suggestions */}
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-neutral-500 mb-1.5 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Frequently Asked Questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-left text-[11px] bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-neutral-200 rounded-full px-2.5 py-1 text-neutral-700 transition-colors shadow-2xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input area */}
            <div className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
              <input
                id="support-chat-input"
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your question or query..."
                className="flex-1 px-3.5 py-2.5 bg-neutral-100 rounded-full text-xs text-neutral-900 border border-transparent focus:border-rose-400 focus:bg-white focus:outline-hidden transition-all"
              />
              <button
                id="support-chat-send-btn"
                onClick={() => handleSend()}
                className="p-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-full transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
