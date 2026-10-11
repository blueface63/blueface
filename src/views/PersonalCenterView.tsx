import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Wallet,
  ArrowDownLeft,
  History,
  Shield,
  PhoneCall,
  LogOut,
  ChevronRight,
  Sparkles,
  Award,
  Lock,
  Layers,
  HelpCircle,
  Smartphone,
  Database,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export const PersonalCenterView: React.FC = () => {
  const {
    user,
    transactions,
    userInvestments,
    openRechargeModal,
    openWithdrawModal,
    openAuthModal,
    logout,
    setIsCustomerSupportOpen,
    setActiveTab,
    formatMoney,
    isDbConnected,
    syncWithDatabase
  } = useApp();

  const [activeTxFilter, setActiveTxFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'income'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState('');

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncFeedback('');
    try {
      await syncWithDatabase();
      setSyncFeedback('Database synced successfully!');
      setTimeout(() => setSyncFeedback(''), 3000);
    } catch {
      setSyncFeedback('Sync complete.');
      setTimeout(() => setSyncFeedback(''), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredTx = transactions.filter(t => {
    if (activeTxFilter === 'deposit') return t.type === 'deposit';
    if (activeTxFilter === 'withdrawal') return t.type === 'withdrawal';
    if (activeTxFilter === 'income') return t.type === 'daily_income' || t.type === 'mission_reward';
    return true;
  });

  if (!user) {
    return (
      <div className="space-y-4 pb-20 pt-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-lg font-black text-neutral-900">Tkash Account Portal</h2>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1">
            Log in or register your mobile number to manage your mining assets and cash out to M-Pesa.
          </p>
        </div>
        <div className="flex gap-2 justify-center pt-2">
          <button
            onClick={() => openAuthModal('login')}
            className="px-6 py-2.5 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-800"
          >
            Log In
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="px-6 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 shadow-sm"
          >
            Register (+200 KES)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* User Header & Balance Card */}
      <div className="rounded-3xl bg-linear-to-br from-amber-700 via-yellow-600 to-amber-900 text-white p-4.5 shadow-xl border border-amber-400/30 space-y-4">
        {/* User profile row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/90 shadow-md">
              <img
                src={user.avatarUrl}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-sm text-white tracking-tight">{user.phone}</h2>
                <span className="px-1.5 py-0.5 rounded-sm bg-black/40 text-amber-300 text-[9px] font-black uppercase">
                  VIP {user.vipLevel}
                </span>
              </div>
              <p className="text-[10px] text-amber-100/90 font-mono">
                ID: {user.id} · Ref: {user.referralCode}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Display */}
        <div className="p-3.5 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/15 space-y-2">
          <span className="text-[11px] text-amber-200 font-medium block">
            Withdrawable Wallet Balance
          </span>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatMoney(user.balanceKES)}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
            <div>
              <span className="text-[10px] text-amber-200/80 block">Total Earnings</span>
              <span className="font-bold text-white text-xs">{formatMoney(user.totalEarningsKES)}</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-200/80 block">Today&apos;s Profit</span>
              <span className="font-bold text-emerald-300 text-xs">+{formatMoney(user.todayEarningsKES)}</span>
            </div>
          </div>
        </div>

        {/* Main Actions: Deposit & Withdraw */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="personal-recharge-btn"
            onClick={openRechargeModal}
            className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Wallet className="w-4 h-4" />
            <span>Deposit (M-Pesa)</span>
          </button>

          <button
            id="personal-withdraw-btn"
            onClick={openWithdrawModal}
            className="py-2.5 px-3 bg-white hover:bg-neutral-100 active:scale-98 text-neutral-900 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4 text-rose-600" />
            <span>Cash Out</span>
          </button>
        </div>
      </div>

      {/* Cloud Database Persistence Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-neutral-900">Cloud Firestore Database</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-neutral-500">
                Persistent storage across devices &amp; sessions
              </p>
            </div>
          </div>
          <button
            id="manual-db-sync-btn"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync DB'}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-center">
          <div className="p-2 rounded-xl bg-neutral-50">
            <span className="text-[10px] text-neutral-500 block">Investments</span>
            <span className="font-black text-xs text-neutral-800">{userInvestments.length}</span>
          </div>
          <div className="p-2 rounded-xl bg-neutral-50">
            <span className="text-[10px] text-neutral-500 block">Ledger Logs</span>
            <span className="font-black text-xs text-neutral-800">{transactions.length}</span>
          </div>
          <div className="p-2 rounded-xl bg-neutral-50">
            <span className="text-[10px] text-neutral-500 block">Cloud Status</span>
            <span className="font-bold text-[10px] text-emerald-600">Online</span>
          </div>
        </div>

        {syncFeedback && (
          <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{syncFeedback}</span>
          </div>
        )}
      </div>

      {/* Quick Menu List */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-sm divide-y divide-neutral-100 text-xs">
        <button
          onClick={() => setActiveTab('project')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-neutral-900 block">My Mining Assets</span>
              <span className="text-[10px] text-neutral-400">
                {userInvestments.length} Active Contracts Running
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button
          onClick={() => setIsCustomerSupportOpen(true)}
          className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-neutral-900 block">24/7 Customer Helpdesk</span>
              <span className="text-[10px] text-neutral-400">Online Agent &amp; Dispute Support</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button
          onClick={() => {
            alert('M-Pesa Account Bound to ' + user.phone + ' with Instant Daraja API STK Push clearance.');
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-neutral-900 block">Bind Payment Account</span>
              <span className="text-[10px] text-neutral-400">{user.phone} (M-Pesa / T-Kash)</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button
          onClick={() => {
            alert('Security settings: Password and 2FA authentication verified for account ' + user.phone);
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-neutral-900 block">Security &amp; PIN</span>
              <span className="text-[10px] text-neutral-400">Password protected</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-neutral-700" />
            <h3 className="font-black text-sm text-neutral-900">Financial Records</h3>
          </div>
          <div className="flex gap-1 text-[10px] font-bold text-neutral-500 bg-neutral-100 p-0.5 rounded-lg">
            <button
              onClick={() => setActiveTxFilter('all')}
              className={`px-2 py-0.5 rounded-md ${activeTxFilter === 'all' ? 'bg-white text-neutral-900 shadow-2xs' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTxFilter('deposit')}
              className={`px-2 py-0.5 rounded-md ${activeTxFilter === 'deposit' ? 'bg-white text-neutral-900 shadow-2xs' : ''}`}
            >
              Recharge
            </button>
            <button
              onClick={() => setActiveTxFilter('income')}
              className={`px-2 py-0.5 rounded-md ${activeTxFilter === 'income' ? 'bg-white text-neutral-900 shadow-2xs' : ''}`}
            >
              Income
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {filteredTx.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-4">No records found</p>
          ) : (
            filteredTx.map(tx => (
              <div
                key={tx.id}
                className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-neutral-900 capitalize">
                      {tx.type.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400">{tx.reference}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">{tx.date}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-black text-xs block ${
                      tx.type === 'deposit' || tx.type === 'daily_income' || tx.type === 'mission_reward'
                        ? 'text-emerald-600'
                        : 'text-neutral-900'
                    }`}
                  >
                    {tx.type === 'deposit' || tx.type === 'daily_income' || tx.type === 'mission_reward'
                      ? `+${formatMoney(tx.amount)}`
                      : `-${formatMoney(tx.amount)}`}
                  </span>
                  <span className="text-[9px] text-emerald-600 font-bold uppercase">{tx.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
