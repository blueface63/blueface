import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Shield, ArrowRight, Zap, Smartphone, Loader2, CheckCircle2, ShieldCheck, CreditCard, AlertCircle, Radio } from 'lucide-react';
import { MPESA_TILL_NUMBER, MPESA_TILL_NAME, validateKenyanPhone } from '../utils/kenyaPhone';

export const InvestModal: React.FC = () => {
  const {
    selectedPlanForInvest,
    closeInvestModal,
    user,
    openAuthModal,
    investInPlan,
    investViaMpesaSTK,
    openRechargeModal,
    formatMoney
  } = useApp();

  const [amount, setAmount] = useState<number>(0);
  const [phone, setPhone] = useState<string>('');
  const [agreed, setAgreed] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'mpesa_stk' | 'wallet_balance'>('mpesa_stk');
  
  // STK Push Prompt State
  const [isStkPromptOpen, setIsStkPromptOpen] = useState<boolean>(false);
  const [stkStatus, setStkStatus] = useState<'prompt' | 'authorizing' | 'success'>('prompt');
  const [successReceipt, setSuccessReceipt] = useState<{ txRef: string; date: string; phone: string; networkName: string } | null>(null);

  useEffect(() => {
    if (selectedPlanForInvest) {
      setAmount(selectedPlanForInvest.minInvestment);
      setError('');
      setIsStkPromptOpen(false);
      setStkStatus('prompt');
      setSuccessReceipt(null);
    }
  }, [selectedPlanForInvest]);

  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone);
    } else {
      setPhone('0712345678');
    }
  }, [user, selectedPlanForInvest]);

  if (!selectedPlanForInvest) return null;

  const plan = selectedPlanForInvest;
  const userBalance = user?.balanceKES || 0;
  const hasEnoughBalance = userBalance >= amount;

  // Calculate proportional daily & total yields
  const dailyRate = plan.dailyIncome / plan.minInvestment;
  const calculatedDaily = Math.round(amount * dailyRate);
  const calculatedTotal = calculatedDaily * plan.cycleDays;

  const phoneValidation = validateKenyanPhone(phone);

  const handleStartInvest = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!agreed) {
      setError('You must agree to the Terms of Service to proceed.');
      return;
    }

    if (amount < plan.minInvestment) {
      setError(`Minimum investment is ${plan.minInvestment} KES.`);
      return;
    }

    if (paymentMode === 'mpesa_stk') {
      if (!phoneValidation.isValid) {
        setError(phoneValidation.error || 'Please enter a valid Safaricom M-PESA or Airtel Money Kenyan mobile number (e.g. 07XXXXXXXX or 01XXXXXXXX).');
        return;
      }
    }

    setError('');

    if (paymentMode === 'wallet_balance') {
      if (!hasEnoughBalance) {
        setError(`Insufficient wallet balance (${formatMoney(userBalance)}). Please use Direct M-PESA / Airtel Money STK Push or recharge.`);
        return;
      }
      const res = investInPlan(plan.id, amount);
      if (!res.success) {
        setError(res.message);
      }
      return;
    }

    // Default & User-Requested flow: Send STK push directly to client's phone handset
    setIsStkPromptOpen(true);
    setStkStatus('authorizing');

    const targetPhone = phoneValidation.isValid ? phoneValidation.normalized : (user.phone || phone);

    try {
      const res = await investViaMpesaSTK(plan.id, amount, targetPhone);
      if (res.success) {
        setSuccessReceipt({
          txRef: res.txRef || `QK${Math.floor(100000 + Math.random() * 900000)}KL`,
          date: new Date().toLocaleString('en-KE', { dateStyle: 'short', timeStyle: 'short' }),
          phone: phoneValidation.isValid ? phoneValidation.display : targetPhone,
          networkName: phoneValidation.networkName
        });
        setStkStatus('success');
      } else {
        setError(res.message);
        setIsStkPromptOpen(false);
      }
    } catch {
      setError('Payment dispatch failed. Please check network connection and retry.');
      setIsStkPromptOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 max-h-[92vh] flex flex-col relative">
        
        {/* ================= Real Handset STK Push Dispatch Overlay ================= */}
        {isStkPromptOpen && (
          <div className="absolute inset-0 z-50 bg-neutral-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-neutral-900 border border-emerald-500/50 rounded-3xl p-5 shadow-2xl text-white animate-in zoom-in-95 duration-200">
              
              {/* STK Push: Live Dispatch to client phone */}
              {stkStatus === 'authorizing' && (
                <div className="py-5 text-center space-y-3">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
                      <Smartphone className="w-8 h-8 text-emerald-400 animate-bounce" />
                    </div>
                    <div className="absolute -inset-1 border-2 border-emerald-400 border-t-transparent rounded-2xl animate-spin"></div>
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold mb-1">
                      <Radio className="w-3 h-3 animate-pulse" />
                      <span>STK Push Sent to Mobile Handset</span>
                    </div>
                    <h4 className="font-black text-sm text-white mt-1">
                      Check your phone: {phoneValidation.isValid ? phoneValidation.display : phone}
                    </h4>
                    <p className="text-[11px] text-neutral-300 mt-1 max-w-xs mx-auto leading-relaxed">
                      A popup prompt from <strong>{phoneValidation.networkName}</strong> has been sent to your SIM. Enter your PIN on your phone to complete payment of <strong className="text-emerald-400">{formatMoney(amount)}</strong> to Till <strong className="text-amber-300 font-mono">{MPESA_TILL_NUMBER}</strong> ({MPESA_TILL_NAME}).
                    </p>
                  </div>

                  {/* Device guidance box */}
                  <div className="p-3 bg-neutral-950/90 rounded-xl border border-neutral-800 text-left space-y-1.5 text-[11px]">
                    <div className="text-neutral-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Handset Instructions:</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-neutral-300 text-[10px]">
                      <li>Unlock your phone screen now</li>
                      <li>Review Till Number <strong className="text-amber-300 font-mono">{MPESA_TILL_NUMBER}</strong> &amp; Amount <strong className="text-emerald-400">KES {amount}</strong></li>
                      <li>Enter your secret 4-digit PIN on your phone handset</li>
                      <li>Press OK to authorize</li>
                    </ol>
                  </div>

                  <div className="text-[10px] text-emerald-400/80 font-mono animate-pulse flex items-center justify-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Listening for carrier network confirmation...</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsStkPromptOpen(false)}
                    className="mt-2 text-[11px] text-neutral-400 hover:text-white underline"
                  >
                    Dismiss &amp; return to mine details
                  </button>
                </div>
              )}

              {/* STK Push: Success confirmation state */}
              {stkStatus === 'success' && (
                <div className="py-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-white">
                      {successReceipt?.networkName || 'M-PESA'} Payment Confirmed!
                    </h4>
                    <p className="text-xs text-neutral-300 mt-0.5">
                      Your subscription to <strong>{plan.name}</strong> is active.
                    </p>
                  </div>

                  {/* SMS style receipt */}
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-left font-mono text-[10px] text-neutral-300 space-y-1">
                    <div className="text-emerald-400 font-bold flex items-center justify-between">
                      <span>{successReceipt?.networkName || 'Safaricom M-PESA'} SMS Receipt</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-sm">CONFIRMED</span>
                    </div>
                    <div>
                      {successReceipt?.txRef} Confirmed. Ksh{amount}.00 sent to {MPESA_TILL_NAME} (Till {MPESA_TILL_NUMBER}) on {successReceipt?.date} from {successReceipt?.phone}. Mining yield active.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsStkPromptOpen(false);
                      closeInvestModal();
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-colors"
                  >
                    View Active Mine
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Header with Image */}
        <div className="relative h-36 bg-neutral-900 overflow-hidden shrink-0">
          <img
            src={plan.imageUrl}
            alt={plan.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            id="close-invest-modal-btn"
            onClick={closeInvestModal}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                {plan.tag || `Mine No.${plan.mineNumber}`}
              </span>
              <span className="text-[11px] text-amber-200 font-medium">
                {plan.cycleDays} Days Cycle
              </span>
            </div>
            <h2 className="text-white font-black text-lg tracking-tight mt-0.5">
              {plan.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Amount range */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span className="font-semibold">Minimum Investment</span>
              <span className="text-amber-700 font-bold">{plan.minInvestment} KES</span>
            </div>
            <div className="text-2xl font-black text-neutral-900 tracking-tight">
              {formatMoney(plan.minInvestment)}
            </div>

            {/* Input field */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Investment Amount (KES)
              </label>
              <div className="relative">
                <input
                  id="invest-amount-input"
                  type="number"
                  value={amount || ''}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setAmount(val);
                    setError('');
                  }}
                  min={plan.minInvestment}
                  placeholder={`Min ${plan.minInvestment}`}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-300 text-sm font-bold text-neutral-900 focus:border-amber-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setAmount(plan.minInvestment)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md hover:bg-amber-200 transition-colors"
                >
                  MIN
                </button>
              </div>
            </div>

            {/* Safaricom / Airtel Mobile Number Input Section */}
            {paymentMode === 'mpesa_stk' && (
              <div className="pt-2 border-t border-amber-200/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-neutral-800 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recipient Mobile (M-PESA / Airtel Money)</span>
                  </label>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-sm">
                    {phoneValidation.isValid ? phoneValidation.networkName : 'SIM STK Push'}
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="invest-mpesa-phone-input"
                    type="tel"
                    value={phone}
                    onChange={e => {
                      setPhone(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. 07XXXXXXXX or 01XXXXXXXX"
                    className={`w-full px-3.5 py-2.5 bg-white rounded-xl border text-xs font-bold text-neutral-900 focus:outline-hidden ${
                      phone && !phoneValidation.isValid
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-neutral-300 focus:border-emerald-500'
                    }`}
                  />
                  {phoneValidation.isValid && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 flex items-center gap-1 text-[11px] font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{phoneValidation.network === 'airtel' ? 'Airtel' : 'Safaricom'}</span>
                    </span>
                  )}
                </div>

                {phone && !phoneValidation.isValid ? (
                  <p className="text-[10px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{phoneValidation.error || 'Enter a valid Kenyan number (07XX / 01XX)'}</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-neutral-500 leading-tight">
                    An STK PIN prompt from <strong>{phoneValidation.networkName}</strong> will be sent directly to your phone handset for Till <strong>{MPESA_TILL_NUMBER}</strong> ({MPESA_TILL_NAME}).
                  </p>
                )}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="pt-2 border-t border-amber-200/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-neutral-700">Payment Option</span>
                <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100/80 px-1.5 py-0.5 rounded-sm">
                  Till: {MPESA_TILL_NUMBER}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('mpesa_stk')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMode === 'mpesa_stk'
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-black text-emerald-700">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile STK Push</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5 truncate">
                    M-PESA &amp; Airtel Money
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('wallet_balance')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMode === 'wallet_balance'
                      ? 'border-amber-500 bg-amber-50/80 text-amber-900 ring-2 ring-amber-500/20'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-black text-amber-700">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Wallet Balance</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    {formatMoney(userBalance)}
                  </div>
                </button>
              </div>
            </div>

            {/* Till Destination Info Banner */}
            <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-800 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  All payments kept in Till: <strong className="font-mono">{MPESA_TILL_NUMBER}</strong> ({MPESA_TILL_NAME})
                </span>
              </div>
            </div>

            {paymentMode === 'wallet_balance' && !hasEnoughBalance && (
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-rose-700 font-medium">
                  Need {formatMoney(amount - userBalance)} more
                </span>
                <button
                  type="button"
                  onClick={openRechargeModal}
                  className="text-[11px] font-bold text-rose-700 hover:underline flex items-center gap-0.5"
                >
                  Recharge <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              id="terms-checkbox"
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-sm text-emerald-600 border-neutral-300 focus:ring-emerald-500"
            />
            <label htmlFor="terms-checkbox" className="text-xs text-neutral-600 leading-tight select-none">
              By clicking &quot;Invest&quot; you agree to send payment to Till <strong>{MPESA_TILL_NUMBER}</strong> ({MPESA_TILL_NAME}) and accept automated daily profit distribution.
            </label>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Invest Button */}
          <button
            id="confirm-invest-btn"
            onClick={handleStartInvest}
            className="w-full py-3.5 rounded-2xl bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-extrabold text-sm shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            {paymentMode === 'mpesa_stk' ? (
              <span>Send STK Push to Phone ({formatMoney(amount || plan.minInvestment)})</span>
            ) : (
              <span>Invest {formatMoney(amount || plan.minInvestment)} via Balance</span>
            )}
          </button>

          {/* "To be activated" section matching screenshot 2 */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-extrabold text-neutral-800 uppercase tracking-wide">
                To be activated
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-neutral-200/60 shadow-2xs">
                <span className="text-[11px] text-neutral-500 block">Daily Profit</span>
                <span className="font-extrabold text-neutral-900 text-sm text-emerald-600">
                  +{formatMoney(calculatedDaily)}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-neutral-200/60 shadow-2xs">
                <span className="text-[11px] text-neutral-500 block">Total Revenue</span>
                <span className="font-extrabold text-neutral-900 text-sm text-amber-600">
                  {formatMoney(calculatedTotal)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-neutral-600 border-t border-neutral-200/60">
              <div>
                <span className="text-neutral-400 block text-[10px]">Payment Receiver</span>
                <span className="font-bold text-neutral-800">Till {MPESA_TILL_NUMBER}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">Project type</span>
                <span className="font-bold text-neutral-800">Daily rebate &amp; principal release</span>
              </div>
            </div>
          </div>

          {/* Revenue Calculation Breakdown matching screenshot 2 */}
          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2 text-xs">
            <h4 className="font-bold text-neutral-800 flex items-center justify-between text-xs pb-1 border-b border-neutral-100">
              <span>Revenue Calculation</span>
              <span className="text-[10px] text-amber-600 font-semibold">{plan.cycleDays} Days Term</span>
            </h4>

            <div className="flex justify-between text-neutral-600">
              <span>Project Price:</span>
              <span className="font-bold text-neutral-900">{formatMoney(amount || plan.minInvestment)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Investment Cycle:</span>
              <span className="font-bold text-neutral-900">{plan.cycleDays} days</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Single Day Income:</span>
              <span className="font-bold text-emerald-600">+{formatMoney(calculatedDaily)}</span>
            </div>
            <div className="flex justify-between text-neutral-600 pt-1.5 border-t border-neutral-100">
              <span className="font-bold text-neutral-900">Total Net Revenue:</span>
              <span className="font-black text-amber-600 text-sm">{formatMoney(calculatedTotal)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pb-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guaranteed Mining Dividends · Secure Payouts to Till {MPESA_TILL_NUMBER}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

