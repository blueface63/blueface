import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Copy,
  Check,
  Share2,
  Gift,
  Award,
  ChevronRight,
  Sparkles,
  QrCode,
  ShieldCheck,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export const TeamCenterView: React.FC = () => {
  const { user, formatMoney, openGoogleChat } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const refCode = user?.referralCode || '652511';
  const referralLink = `https://tkash.vip/register?ref=${refCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(refCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const mockTeamMembers = [
    { id: '1', phone: '0722***491', date: '2026-08-25', tier: 'Level 1 (10%)', invested: 1000, commission: 100 },
    { id: '2', phone: '0714***883', date: '2026-08-26', tier: 'Level 1 (10%)', invested: 499, commission: 49.9 },
    { id: '3', phone: '0799***120', date: '2026-08-27', tier: 'Level 2 (4%)', invested: 299, commission: 11.96 }
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Team Header Card */}
      <div className="rounded-3xl bg-linear-to-br from-purple-900 via-indigo-950 to-neutral-950 text-white p-4.5 shadow-xl border border-purple-500/20 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-sm text-white">Team Commission Center</h2>
              <span className="text-[10px] text-purple-300 font-semibold">3-Tier Multi-Level Earning</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-black border border-purple-400/30">
            VIP REWARD
          </span>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 block">Total Team</span>
            <span className="font-black text-sm text-white mt-0.5 block">
              {(user?.teamSize || 0) + 3} Members
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 block">Team Volume</span>
            <span className="font-black text-xs text-emerald-400 mt-0.5 block">
              {formatMoney(1798)}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 block">Commission</span>
            <span className="font-black text-xs text-amber-400 mt-0.5 block">
              {formatMoney((user?.teamCommissionKES || 0) + 161.86)}
            </span>
          </div>
        </div>
      </div>

      {/* Google Chat Community & Investor Rooms */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-950 to-neutral-950 text-white rounded-3xl p-4 shadow-md border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-sm text-white">Google Chat Spaces</h3>
              <span className="text-[9px] bg-emerald-500 text-neutral-950 font-black px-1.5 py-0.5 rounded-sm">LIVE</span>
            </div>
            <p className="text-[11px] text-emerald-200/80">Connect with team members &amp; investor VIP groups</p>
          </div>
        </div>

        <button
          id="team-google-chat-btn"
          onClick={openGoogleChat}
          className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-neutral-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1 shrink-0"
        >
          <span>Open Chat</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Share Link & Code Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-4 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
          <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-sm text-neutral-900">Your Invitation Code &amp; Link</h3>
            <p className="text-[10px] text-neutral-500">Share with friends to get instant commission rebates</p>
          </div>
        </div>

        {/* Referral Code Box */}
        <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-500 block uppercase">Referral Code</span>
            <span className="font-mono font-black text-lg text-amber-700 tracking-wider">
              {refCode}
            </span>
          </div>
          <button
            id="copy-ref-code-btn"
            onClick={copyCode}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Referral Link Box */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-neutral-700">
            Exclusive Invitation Link
          </label>
          <div className="flex gap-2">
            <input
              id="ref-link-input"
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono font-bold text-neutral-800 select-all"
            />
            <button
              id="copy-ref-link-btn"
              onClick={copyLink}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Tier Commission Structure */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-4 shadow-sm space-y-3">
        <h3 className="font-black text-sm text-neutral-900 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-purple-600" />
          <span>3-Level Reward System</span>
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200">
            <span className="text-[10px] font-extrabold text-amber-800 block">Level 1 (Direct)</span>
            <span className="font-black text-base text-amber-600 mt-0.5 block">10%</span>
            <span className="text-[9px] text-neutral-500 block mt-1">E.g. 1,000 → +100 KES</span>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200">
            <span className="text-[10px] font-extrabold text-purple-800 block">Level 2 (Indirect)</span>
            <span className="font-black text-base text-purple-600 mt-0.5 block">4%</span>
            <span className="text-[9px] text-neutral-500 block mt-1">E.g. 1,000 → +40 KES</span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200">
            <span className="text-[10px] font-extrabold text-rose-800 block">Level 3 (Sub)</span>
            <span className="font-black text-base text-rose-600 mt-0.5 block">1%</span>
            <span className="text-[9px] text-neutral-500 block mt-1">E.g. 1,000 → +10 KES</span>
          </div>
        </div>
      </div>

      {/* Team Member Roster */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <h3 className="font-black text-sm text-neutral-900">Invited Team Roster</h3>
          <span className="text-[10px] text-neutral-500 font-semibold">Active Contributors</span>
        </div>

        <div className="space-y-2">
          {mockTeamMembers.map(m => (
            <div
              key={m.id}
              className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between text-xs"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-neutral-900">{m.phone}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-purple-100 text-purple-700">
                    {m.tier}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">Joined on {m.date}</span>
              </div>
              <div className="text-right">
                <span className="font-black text-emerald-600 block">+{formatMoney(m.commission)}</span>
                <span className="text-[10px] text-neutral-500">Invested {m.invested} KES</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
