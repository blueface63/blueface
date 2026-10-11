import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Gift,
  Zap,
  Users,
  Wallet,
  ArrowDownLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  CalendarCheck
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    plans,
    marketData,
    missions,
    claimMissionReward,
    dailyCheckIn,
    openInvestModal,
    openRechargeModal,
    openWithdrawModal,
    setActiveTab,
    currency,
    toggleCurrency,
    formatMoney,
    user
  } = useApp();

  return (
    <div className="space-y-4 pb-20">
      {/* Hero Banner with Gold Mining Graphic */}
      <div className="relative rounded-3xl overflow-hidden bg-neutral-900 shadow-lg border border-amber-900/30">
        <div className="relative h-44 sm:h-48 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1000&q=80"
            alt="Tkash Gold Assets"
            className="w-full h-full object-cover opacity-75 scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-amber-950/60 to-transparent" />

          {/* Banner text & badge */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-linear-to-r from-amber-500 to-yellow-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                TKASH GOLD MINING
              </span>
              <span className="text-[11px] text-amber-200 font-medium">90 Days Yield Cycle</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white drop-shadow-md">
              Automated Daily Income Platform
            </h1>
            <p className="text-xs text-amber-100/90 line-clamp-1 mt-0.5">
              Start from 299 KES · Earn up to 3,200 KES daily · 24/7 M-Pesa Disbursal
            </p>
          </div>
        </div>

        {/* Quick Quick Actions Bar under banner */}
        <div className="grid grid-cols-4 p-2.5 bg-neutral-950/95 border-t border-neutral-800 text-white text-center">
          <button
            id="home-recharge-btn"
            onClick={openRechargeModal}
            className="flex flex-col items-center gap-1 py-1 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-neutral-300">Recharge</span>
          </button>

          <button
            id="home-withdraw-btn"
            onClick={openWithdrawModal}
            className="flex flex-col items-center gap-1 py-1 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-neutral-300">Withdraw</span>
          </button>

          <button
            id="home-checkin-btn"
            onClick={() => dailyCheckIn()}
            className="flex flex-col items-center gap-1 py-1 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-neutral-300">Daily +25</span>
          </button>

          <button
            id="home-team-shortcut-btn"
            onClick={() => setActiveTab('team')}
            className="flex flex-col items-center gap-1 py-1 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-neutral-300">Team Link</span>
          </button>
        </div>
      </div>

      {/* Market conditions matching screenshot 4 */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-3.5 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-extrabold text-xs text-neutral-900 uppercase tracking-wide">
              Market conditions
            </h2>
          </div>
          <button
            onClick={toggleCurrency}
            className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            {currency} <span className="text-neutral-400">/ USD</span>
          </button>
        </div>

        {/* Commodity table */}
        <div className="space-y-2">
          <div className="grid grid-cols-12 text-[10px] font-bold text-neutral-400 px-1 uppercase tracking-wider">
            <span className="col-span-1">#</span>
            <span className="col-span-5">Variety</span>
            <span className="col-span-3 text-right">Current Price</span>
            <span className="col-span-3 text-right">24H</span>
          </div>

          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {marketData.slice(0, 6).map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center text-xs py-1.5 px-2 rounded-xl bg-neutral-50 hover:bg-amber-50/60 transition-colors"
              >
                <span className="col-span-1 text-[11px] font-bold text-neutral-400">
                  {index + 1}
                </span>
                <div className="col-span-5 flex items-center gap-1.5">
                  <span className="font-extrabold text-neutral-900 text-xs capitalize truncate">
                    {item.name.split(' ')[0]}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span className="text-[10px] text-neutral-400 truncate">{item.unit}</span>
                </div>
                <div className="col-span-3 text-right font-bold text-neutral-900 text-xs">
                  {currency === 'USD' ? `$${item.priceUSD.toFixed(2)}` : `${item.priceKES.toLocaleString()} K`}
                </div>
                <div
                  className={`col-span-3 text-right font-bold text-xs flex items-center justify-end gap-0.5 ${
                    item.change24h >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {item.change24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{item.change24h >= 0 ? `+${item.change24h}%` : `${item.change24h}%`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects Section matching screenshot 1 and 3 */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-black text-base text-neutral-900 tracking-tight">Project</h2>
            <p className="text-[11px] text-neutral-500">Choose your mining tier &amp; start earning daily</p>
          </div>
          <button
            id="view-all-projects-btn"
            onClick={() => setActiveTab('project')}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5"
          >
            View All ({plans.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Project cards carousel/list */}
        <div className="space-y-3.5">
          {plans.slice(0, 4).map(plan => (
            <div
              key={plan.id}
              className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              {/* Card top banner */}
              <div className="relative h-32 bg-neutral-900 overflow-hidden">
                <img
                  src={plan.imageUrl}
                  alt={plan.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold shadow-sm">
                    {plan.tag || `Mine No.${plan.mineNumber}`}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 text-amber-200 text-[10px] font-bold backdrop-blur-xs">
                    ROI {plan.roiPercentage}%
                  </span>
                </div>

                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <h3 className="font-black text-base text-white drop-shadow-sm leading-tight">
                    Mine No.{plan.mineNumber}
                  </h3>
                </div>
              </div>

              {/* Card stats */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Minimum investment</span>
                    <span className="font-black text-neutral-900 text-sm">
                      {formatMoney(plan.minInvestment)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-500 block text-[11px]">daily income</span>
                    <span className="font-black text-emerald-600 text-sm">
                      +{formatMoney(plan.dailyIncome)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-100 text-neutral-600">
                  <span>project cycle</span>
                  <span className="font-extrabold text-neutral-900">{plan.cycleDays} days</span>
                </div>

                {/* Invest button matching screenshot magenta/pink button */}
                <button
                  id={`invest-btn-mine-${plan.mineNumber}`}
                  onClick={() => openInvestModal(plan)}
                  className="w-full py-2.5 rounded-xl bg-linear-to-r from-pink-600 via-rose-600 to-pink-600 text-white font-extrabold text-xs shadow-xs hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Invest</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Center Section matching screenshot 1 and 3 */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-rose-50 text-rose-600">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-sm text-neutral-900">mission center</h2>
              <p className="text-[10px] text-neutral-500">Complete tasks to unlock instant KES rewards</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('team')}
            className="text-[11px] font-bold text-amber-600 hover:underline"
          >
            Invite Friends
          </button>
        </div>

        <div className="space-y-3">
          {missions.map(mission => {
            const isFinished = mission.isCompleted || (user?.teamSize || 0) >= mission.targetCount;
            return (
              <div
                key={mission.id}
                className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-xs text-neutral-900">
                    {mission.title}
                  </h3>
                  <span className="text-[11px] font-black text-neutral-400 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                    {user?.teamSize || 0}/{mission.targetCount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-800 font-bold text-xs flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-amber-600" />
                    +{formatMoney(mission.rewardKES)}
                  </span>
                  <span className="text-[10px] text-neutral-500">A valid user is required</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-linear-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((user?.teamSize || 0) / mission.targetCount) * 100)}%`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-neutral-500 font-medium">
                    {user?.teamSize || 0} / {mission.targetCount} people have been invited
                  </span>
                  {mission.isClaimed ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Claimed
                    </span>
                  ) : isFinished ? (
                    <button
                      onClick={() => claimMissionReward(mission.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg shadow-xs transition-all"
                    >
                      Claim +{mission.rewardKES} KES
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('team')}
                      className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-600 font-bold text-[10px] rounded-lg transition-colors"
                    >
                      Not completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-3.5 rounded-2xl bg-neutral-900 text-white text-xs flex items-center gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <p className="font-bold text-neutral-200 text-xs">Tkash High Yield Guarantee</p>
          <p className="text-[11px] text-neutral-400 leading-tight">
            Daily mining dividends credited automatically every 24h directly to your wallet.
          </p>
        </div>
      </div>
    </div>
  );
};
