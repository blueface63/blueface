import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowDownRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const WithdrawModal: React.FC = () => {
  const { isWithdrawModalOpen, closeWithdrawModal, withdrawWallet, user, formatMoney } = useApp();
  const [amount, setAmount] = useState<number>(500);
  const [phone, setPhone] = useState<string>(user?.phone || '0712345678');
  const [method, setMethod] = useState<'mpesa' | 'tkash' | 'bank'>('mpesa');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [step, setStep] = useState<'input' | 'done'>('input');
  const [error, setError] = useState<string>('');

  if (!isWithdrawModalOpen) return null;

  const balance = user?.balanceKES || 0;
  const fee = Math.round(amount * 0.02); // 2% fee
  const netPayout = Math.max(0, amount - fee);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 100) {
      setError('Minimum withdrawal is 100 KES.');
      return;
    }
    if (amount > balance) {
      setError(`Insufficient balance. You have ${balance} KES.`);
      return;
    }
    if (!phone || phone.length < 9) {
      setError('Please enter a valid phone number for payout.');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const res = await withdrawWallet(amount, phone, method);
      if (res.success) {
        setStep('done');
      } else {
        setError(res.message);
      }
    } catch {
      setError('Withdrawal failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-amber-600 via-rose-600 to-pink-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/15">
              <ArrowDownRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">Withdraw Earnings</h3>
              <p className="text-[11px] text-amber-100">24/7 Direct Disbursal to M-Pesa &amp; T-Kash</p>
            </div>
          </div>
          <button
            onClick={closeWithdrawModal}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'input' ? (
          <form onSubmit={handleWithdraw} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Balance info card */}
            <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-neutral-500 block">Available Withdrawable Balance</span>
                <span className="text-xl font-black text-neutral-900">{formatMoney(balance)}</span>
              </div>
              <button
                type="button"
                onClick={() => setAmount(balance)}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors"
              >
                ALL
              </button>
            </div>

            {/* Payout Channel */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Payout Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('mpesa')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                    method === 'mpesa'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  M-PESA
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('tkash')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                    method === 'tkash'
                      ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  T-Kash
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                    method === 'bank'
                      ? 'border-pink-500 bg-pink-50 text-pink-800 ring-2 ring-pink-500/20'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  Bank / Airtel
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Withdrawal Amount (KES)
              </label>
              <input
                id="withdraw-amount-input"
                type="number"
                value={amount || ''}
                onChange={e => setAmount(Number(e.target.value))}
                min={100}
                max={balance}
                placeholder="Min 100 KES"
                className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm font-bold text-neutral-900 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Receiving Mobile / Account Number
              </label>
              <input
                id="withdraw-phone-input"
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 0712345678"
                className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm font-semibold text-neutral-900 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                required
              />
            </div>

            {/* Fee breakdown */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5">
              <div className="flex justify-between text-neutral-600">
                <span>Withdrawal Amount:</span>
                <span className="font-bold text-neutral-900">{formatMoney(amount)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Network Processing Fee (2%):</span>
                <span className="font-bold text-rose-600">-{formatMoney(fee)}</span>
              </div>
              <div className="flex justify-between text-neutral-800 pt-1.5 border-t border-neutral-200">
                <span className="font-bold">Actual Credited:</span>
                <span className="font-black text-emerald-600 text-sm">{formatMoney(netPayout)}</span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <button
              id="confirm-withdraw-btn"
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl bg-linear-to-r from-amber-600 via-rose-600 to-pink-600 text-white font-extrabold text-sm shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing Disbursal...' : `Confirm Cash Out (${formatMoney(netPayout)})`}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Express queue: Automated transfer within 1 - 5 minutes</span>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="font-extrabold text-neutral-900 text-base">
                Withdrawal Dispatched!
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                <strong>{formatMoney(netPayout)}</strong> is being transferred to <strong>{phone}</strong> via {method.toUpperCase()} payout queue.
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Reference code generated in Transaction History.</span>
            </div>

            <button
              onClick={() => {
                setStep('input');
                closeWithdrawModal();
              }}
              className="w-full py-2.5 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
