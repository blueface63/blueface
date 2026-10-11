import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Smartphone, ArrowRight, ShieldCheck, Loader2, CheckCircle2, Copy, Check } from 'lucide-react';
import { MPESA_TILL_NUMBER, MPESA_TILL_NAME, validateKenyanPhone } from '../utils/kenyaPhone';

export const RechargeModal: React.FC = () => {
  const { isRechargeModalOpen, closeRechargeModal, rechargeWallet, user, formatMoney } = useApp();
  const [amount, setAmount] = useState<number>(299);
  const [phone, setPhone] = useState<string>(user?.phone || '0712345678');
  const [method, setMethod] = useState<'mpesa' | 'tkash' | 'airtel'>('mpesa');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [step, setStep] = useState<'input' | 'prompt' | 'done'>('input');
  const [error, setError] = useState<string>('');
  const [copiedTill, setCopiedTill] = useState<boolean>(false);

  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone);
    }
  }, [user, isRechargeModalOpen]);

  const quickAmounts = [299, 499, 1000, 3500, 5000, 8500, 12500, 15000, 20000];

  if (!isRechargeModalOpen) return null;

  const copyTill = () => {
    navigator.clipboard?.writeText(MPESA_TILL_NUMBER);
    setCopiedTill(true);
    setTimeout(() => setCopiedTill(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 50) {
      setError('Minimum deposit is 50 KES.');
      return;
    }

    const phoneValidation = validateKenyanPhone(phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error || 'Please enter a valid Kenyan registered phone number (e.g. 07XXXXXXXX or 01XXXXXXXX).');
      return;
    }

    setError('');
    setIsProcessing(true);
    setStep('prompt');

    try {
      const res = await rechargeWallet(amount, phoneValidation.normalized, method);
      if (res.success) {
        setStep('done');
      } else {
        setError(res.message);
        setStep('input');
      }
    } catch {
      setError('Payment simulation error. Please try again.');
      setStep('input');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/15">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">Deposit / Recharge Wallet</h3>
              <p className="text-[11px] text-emerald-100">
                Official Buy Goods Till: <span className="font-bold underline">{MPESA_TILL_NUMBER}</span>
              </p>
            </div>
          </div>
          <button
            onClick={closeRechargeModal}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {step === 'input' && (
          <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Till Banner Highlight */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-emerald-700 tracking-wider block">
                  LIPA NA M-PESA BUY GOODS TILL
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-lg font-black text-neutral-900 tracking-wider">
                    {MPESA_TILL_NUMBER}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium">({MPESA_TILL_NAME})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={copyTill}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
              >
                {copiedTill ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Till
                  </>
                )}
              </button>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Select Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('mpesa')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                    method === 'mpesa'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  M-PESA Express
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('tkash')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                    method === 'tkash'
                      ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  T-Kash Direct
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('airtel')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                    method === 'airtel'
                      ? 'border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Airtel Money
                </button>
              </div>
            </div>

            {/* Quick amount selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wide">
                  Quick Amount Presets (KES)
                </label>
                <span className="text-[10px] text-neutral-500">Matches Mine Packages</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 rounded-xl text-xs font-black transition-all ${
                      amount === val
                        ? 'bg-emerald-600 text-white shadow-sm scale-102'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/60'
                    }`}
                  >
                    {val.toLocaleString()} KES
                  </button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Custom Recharge Amount (KES)
              </label>
              <div className="relative">
                <input
                  id="recharge-amount-input"
                  type="number"
                  value={amount || ''}
                  onChange={e => setAmount(Number(e.target.value))}
                  min={50}
                  placeholder="Enter amount (min 50)"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm font-bold text-neutral-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                  KES
                </span>
              </div>
            </div>

            {/* Phone number */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-neutral-700">
                  Mobile Number for STK Push
                </label>
                <span className="text-[10px] text-emerald-700 font-semibold">User Login Mobile</span>
              </div>
              <input
                id="recharge-phone-input"
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 0712345678"
                className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm font-semibold text-neutral-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden font-mono"
                required
              />
              <span className="text-[10px] text-neutral-500 block mt-1">
                STK prompt will trigger on this number requesting payment to Till <strong>{MPESA_TILL_NUMBER}</strong>.
              </span>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <button
              id="submit-recharge-btn"
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Send STK Push to Till {MPESA_TILL_NUMBER} ({formatMoney(amount)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Manual M-Pesa Instructions Box */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] space-y-1.5">
              <span className="font-bold text-neutral-800 block">Manual Payment Instructions (Buy Goods):</span>
              <ol className="list-decimal list-inside space-y-0.5 text-neutral-600 text-[10px]">
                <li>Open M-PESA menu &gt; <strong>Lipa na M-PESA</strong></li>
                <li>Select <strong>Buy Goods and Services</strong></li>
                <li>Enter Till Number: <strong className="text-emerald-700 font-mono font-bold">{MPESA_TILL_NUMBER}</strong></li>
                <li>Enter Amount: <strong className="text-neutral-900">{formatMoney(amount)}</strong></li>
                <li>Enter your M-PESA PIN and press Send</li>
              </ol>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Daraja 2.0 API &amp; Till {MPESA_TILL_NUMBER} Gateway</span>
            </div>
          </form>
        )}

        {/* Processing STK Push Screen */}
        {step === 'prompt' && (
          <div className="p-8 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center animate-pulse">
                <Smartphone className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div>
              <h4 className="font-extrabold text-neutral-900 text-base">
                STK Push Sent to {phone}!
              </h4>
              <p className="text-xs text-neutral-600 mt-1 max-w-xs mx-auto">
                Please check your phone and enter your PIN to authorize payment of <strong>{formatMoney(amount)}</strong> to Till <strong>{MPESA_TILL_NUMBER}</strong> ({MPESA_TILL_NAME}).
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Waiting for automated callback verification...</span>
            </div>
          </div>
        )}

        {/* Done Screen */}
        {step === 'done' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="font-extrabold text-neutral-900 text-base">
                Deposit to Till {MPESA_TILL_NUMBER} Successful!
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                Your wallet has been credited with <strong>{formatMoney(amount)}</strong>. You can now subscribe to TKESHTRADE PARTNERS projects.
              </p>
            </div>

            <button
              onClick={closeRechargeModal}
              className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition-colors"
            >
              Return to Platform
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
