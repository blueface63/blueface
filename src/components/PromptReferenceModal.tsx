import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Copy, Check, Sparkles, Terminal } from 'lucide-react';

export const PromptReferenceModal: React.FC = () => {
  const { isPromptModalOpen, setIsPromptModalOpen } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isPromptModalOpen) return null;

  const promptText = `Create a mobile-first investment and daily yield platform named "Tkash" (inspired by modern digital asset and cloud mining web platforms like GV Gold).

Key Specifications:
1. Brand & Aesthetic:
   - Name: Tkash (T-Kash VIP)
   - Color Palette: Premium Gold / Amber (#D97706, #F59E0B), Emerald Green for M-Pesa transactions (#059669), and Rose/Crimson accents (#E11D48).
   - High-contrast responsive layout matching modern mobile web investment platforms.

2. User Authentication & Referral Architecture:
   - Secure Registration: Mobile number (+254 / Kenya format), password, confirm password, Graphic CAPTCHA verification, and invitation code support (e.g. ?ref=652511).
   - Sign-in / Log-in with persistence and 200 KES sign-up welcome gift voucher.
   - 3-Tier Referral Team Commission: Tier 1 (10%), Tier 2 (4%), Tier 3 (1%).

3. Investment Packages (90 Days Term with Daily Returns in KES):
   - Tkash Mine No.1: 299 KES -> Daily Income: 15 KES (Total 1,350 KES)
   - Tkash Mine No.2: 499 KES -> Daily Income: 59 KES (Total 5,310 KES)
   - Tkash Mine No.3: 1,000 KES -> Daily Income: 125 KES (Total 11,250 KES)
   - Tkash Mine No.4: 3,500 KES -> Daily Income: 460 KES (Total 41,400 KES)
   - Tkash Mine No.5: 5,000 KES -> Daily Income: 690 KES (Total 62,100 KES)
   - Tkash Mine No.6: 8,500 KES -> Daily Income: 1,220 KES (Total 109,800 KES)
   - Tkash Mine No.7: 12,500 KES -> Daily Income: 1,850 KES (Total 166,500 KES)
   - Tkash Mine No.8: 15,000 KES -> Daily Income: 2,300 KES (Total 207,000 KES)
   - Tkash Mine No.9: 20,000 KES -> Daily Income: 3,200 KES (Total 288,000 KES)

4. Four Core Views (Bottom Navigation):
   - Home Page: Live commodities market ticker (Gold, Silver, Platinum, Crude Oil, Copper), hero banner, featured mines, mission center (Invite 6 members -> +138 KES, Invite 30 -> +933 KES, Invite 200 -> +7,500 KES), daily check-in streak.
   - Project: Active contracts list, one-click "Claim Daily Income" with countdown timer, full catalog of mine tiers, and investment ROI calculator.
   - Team Center: Personal referral link generator (https://tkash.vip/register?ref=652511), one-click copy, QR code, commission tier stats, team member roster.
   - Personal Center: Wallet balance breakdown, instant M-Pesa STK Push recharge, 24/7 express withdrawal with fee estimation, transaction history log, account settings.

5. Interactive Elements:
   - Floating 24/7 Customer Support live chat assistant.
   - Live simulated M-Pesa STK push simulation with PIN dialog.
   - Multi-currency toggle (KES / USD) & Language switch (English / Kiswahili).`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-extrabold text-sm">Tkash Platform Generation Prompt</h3>
              <p className="text-[11px] text-amber-100">Ready-to-use prompt specification</p>
            </div>
          </div>
          <button
            onClick={() => setIsPromptModalOpen(false)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-600" /> Complete System Prompt
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold rounded-lg transition-all shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Prompt
                </>
              )}
            </button>
          </div>

          <pre className="p-3.5 bg-neutral-900 text-neutral-100 text-xs rounded-2xl overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed border border-neutral-800 selection:bg-amber-500 selection:text-black">
            {promptText}
          </pre>
        </div>

        <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            onClick={() => setIsPromptModalOpen(false)}
            className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
