import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Sparkles,
  Calculator,
  ShieldAlert,
  Layers,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const ProjectView: React.FC = () => {
  const {
    plans,
    userInvestments,
    claimDailyEarnings,
    openInvestModal,
    formatMoney
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'starter' | 'vip'>('all');
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [claimStatus, setClaimStatus] = useState<string>('');

  const runningInvestments = userInvestments.filter(i => i.status === 'running');
  const totalInvested = userInvestments.reduce((acc, i) => acc + i.investedAmount, 0);
  const totalEarned = userInvestments.reduce((acc, i) => acc + i.totalEarned, 0);
  const totalDailyPacing = runningInvestments.reduce((acc, i) => acc + i.dailyIncome, 0);

  const filteredPlans = plans.filter(p => {
    if (activeFilter === 'starter') return p.minInvestment <= 1000;
    if (activeFilter === 'vip') return p.minInvestment > 1000;
    return true;
  });

  const handleClaim = () => {
    const res = claimDailyEarnings();
    setClaimStatus(res.message);
    setTimeout(() => setClaimStatus(''), 4000);
  };

  // Calculator estimations
  const selectedCalcPlan =
    plans.slice().reverse().find(p => calcAmount >= p.minInvestment) || plans[0];
  const rate = selectedCalcPlan.dailyIncome / selectedCalcPlan.minInvestment;
  const estDaily = Math.round(calcAmount * rate);
  const estTotal = estDaily * 90;

  return (
    <div className="space-y-4 pb-20">
      {/* Portfolio / Active Investment Control Center */}
      <div className="rounded-3xl bg-linear-to-br from-neutral-900 via-neutral-950 to-amber-950 text-white p-4.5 shadow-xl border border-amber-500/20 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-sm text-white">Active Mining Rigs</h2>
              <span className="text-[10px] text-amber-300 font-semibold">
                {runningInvestments.length} Running Yield Contracts
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 animate-pulse">
            LIVE 24/7
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 block">Total Invested</span>
            <span className="font-black text-xs text-white mt-0.5 block">
              {formatMoney(totalInvested)}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 block">Daily Pacing</span>
            <span className="font-black text-xs text-emerald-400 mt-0.5 block">
              +{formatMoney(totalDailyPacing || 15)}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-neutral-400 block">Total Paid Out</span>
            <span className="font-black text-xs text-amber-400 mt-0.5 block">
              {formatMoney(totalEarned)}
            </span>
          </div>
        </div>

        {claimStatus && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold text-center animate-in fade-in">
            {claimStatus}
          </div>
        )}

        {/* Claim Daily Revenue Button */}
        <button
          id="claim-daily-yield-btn"
          onClick={handleClaim}
          className="w-full py-3 rounded-2xl bg-linear-to-r from-amber-500 via-yellow-500 to-amber-600 text-neutral-950 font-black text-xs shadow-lg hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 fill-neutral-950" />
          <span>Claim Daily Mining Yields (+{formatMoney(totalDailyPacing || 15)})</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-extrabold text-sm text-neutral-900">All Mining Plans</h3>
        <div className="flex bg-neutral-100 p-1 rounded-xl text-[11px] font-bold text-neutral-600">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeFilter === 'all' ? 'bg-white text-neutral-900 shadow-2xs' : 'hover:text-neutral-900'
            }`}
          >
            All (9)
          </button>
          <button
            onClick={() => setActiveFilter('starter')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeFilter === 'starter' ? 'bg-white text-neutral-900 shadow-2xs' : 'hover:text-neutral-900'
            }`}
          >
            Starter
          </button>
          <button
            onClick={() => setActiveFilter('vip')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeFilter === 'vip' ? 'bg-white text-neutral-900 shadow-2xs' : 'hover:text-neutral-900'
            }`}
          >
            VIP
          </button>
        </div>
      </div>

      {/* Plans List with the exact 9 investment packages */}
      <div className="space-y-3.5">
        {filteredPlans.map(plan => (
          <div
            key={plan.id}
            className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all"
          >
            <div className="relative h-28 bg-neutral-900 overflow-hidden">
              <img
                src={plan.imageUrl}
                alt={plan.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold shadow-sm">
                  Mine No.{plan.mineNumber}
                </span>
                {plan.tag && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold shadow-sm">
                    {plan.tag}
                  </span>
                )}
              </div>

              <div className="absolute bottom-2 left-3 right-3 text-white flex items-end justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-white drop-shadow-xs">{plan.name}</h4>
                  <span className="text-[10px] text-amber-200">{plan.cycleDays} Days Cycle</span>
                </div>
                <span className="text-xs font-black text-amber-400">
                  ROI +{plan.roiPercentage}%
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200/60 text-center">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Min Invest</span>
                  <span className="font-black text-neutral-900 text-xs">
                    {formatMoney(plan.minInvestment)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">Daily Income</span>
                  <span className="font-black text-emerald-600 text-xs">
                    +{formatMoney(plan.dailyIncome)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">Total Return</span>
                  <span className="font-black text-amber-600 text-xs">
                    {formatMoney(plan.totalIncome)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-1">
                {plan.description}
              </p>

              <button
                id={`project-invest-btn-${plan.mineNumber}`}
                onClick={() => openInvestModal(plan)}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 active:scale-98 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Invest {formatMoney(plan.minInvestment)}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ROI & Dividend Calculator */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
          <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-sm text-neutral-900">Revenue Estimator</h3>
            <p className="text-[10px] text-neutral-500">Calculate your 90-day estimated profit return</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-neutral-700 mb-1.5">
            <span>Investment Amount</span>
            <span className="text-amber-600 font-extrabold">{formatMoney(calcAmount)}</span>
          </div>
          <input
            type="range"
            min={299}
            max={20000}
            step={100}
            value={calcAmount}
            onChange={e => setCalcAmount(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] font-semibold text-neutral-400 mt-1">
            <span>299 KES</span>
            <span>5,000 KES</span>
            <span>12,500 KES</span>
            <span>20,000 KES</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
            <span className="text-[10px] text-emerald-700 font-semibold block">Est. Daily Income</span>
            <span className="font-black text-emerald-900 text-sm">+{formatMoney(estDaily)}</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
            <span className="text-[10px] text-amber-700 font-semibold block">90-Day Total Yield</span>
            <span className="font-black text-amber-900 text-sm">{formatMoney(estTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
