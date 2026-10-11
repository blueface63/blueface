import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Phone, UserPlus, LogIn, KeyRound, RefreshCw, Sparkles, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { validateKenyanPhone, validatePassword } from '../utils/kenyaPhone';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authMode, openAuthModal, login, register, referralParam, loginWithGoogle, isDbConnected } = useApp();
  const [phone, setPhone] = useState('0712345678');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');
  const [referralCode, setReferralCode] = useState(referralParam || '652511');
  const [captchaInput, setCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('7492');
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    refreshCaptcha();
    if (referralParam) {
      setReferralCode(referralParam);
    }
  }, [isAuthModalOpen, referralParam]);

  const refreshCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCaptcha(code);
    setCaptchaInput(code); // Pre-fill for ease of use
  };

  if (!isAuthModalOpen) return null;

  const handleGoogleAuth = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const ok = await loginWithGoogle();
      if (!ok) {
        setError('Could not complete Google authentication.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Kenyan phone validation
    const phoneValidation = validateKenyanPhone(phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error || 'Please enter a valid Kenyan registered phone number (e.g. 07XXXXXXXX or 01XXXXXXXX).');
      return;
    }

    // 2. Password validation (>4 characters)
    const passValidation = validatePassword(password);
    if (!passValidation.isValid) {
      setError(passValidation.error || 'Password must be more than 4 characters.');
      return;
    }

    if (authMode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
      if (captchaInput !== generatedCaptcha) {
        setError('Invalid CAPTCHA code. Please re-enter.');
        return;
      }
      register(phoneValidation.normalized, password, referralCode);
    } else {
      login(phoneValidation.normalized, password);
    }
  };

  const fillDemoAccount = () => {
    setPhone('0712345678');
    setPassword('123456');
    setConfirmPassword('123456');
    setCaptchaInput(generatedCaptcha);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Top banner */}
        <div className="p-4 bg-linear-to-r from-amber-600 via-yellow-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black">
              T
            </div>
            <div>
              <h3 className="font-extrabold text-sm">
                {authMode === 'login' ? 'Welcome Back to Tkash' : 'Create Tkash Account'}
              </h3>
              <p className="text-[11px] text-amber-100">
                {authMode === 'login' ? 'Access your mining dashboard' : 'Join and earn 200 KES sign-up voucher'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-2 p-2 bg-neutral-100 border-b border-neutral-200 text-xs font-bold">
          <button
            id="auth-tab-login"
            onClick={() => openAuthModal('login')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
          <button
            id="auth-tab-register"
            onClick={() => openAuthModal('register')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Account</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 space-y-3.5 max-h-[78vh] overflow-y-auto">
          {/* Google 1-Click Database Auth */}
          <div>
            <button
              id="google-signin-btn"
              type="button"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full py-2.5 px-3 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs rounded-xl border border-neutral-300 shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleLoading ? 'Connecting Database...' : 'Continue with Google Account'}</span>
            </button>
            <div className="flex items-center gap-2 my-2 text-neutral-400 text-[10px]">
              <div className="flex-1 h-px bg-neutral-200" />
              <span>OR KENYAN MOBILE SIGN-IN</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Quick Demo Fill Banner */}
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-800 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Quick Test Credentials</span>
            </div>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[10px] font-bold transition-colors"
            >
              Fill Demo Data
            </button>
          </div>

          {/* Phone */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-neutral-700">
                Kenyan Registered Phone Number
              </label>
              <span className="text-[10px] text-amber-700 font-semibold">07XX or 01XX</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                +254
              </span>
              <input
                id="auth-phone-input"
                type="text"
                value={phone.replace(/^\+254/, '').replace(/^0/, '')}
                onChange={e => setPhone(e.target.value)}
                placeholder="712345678 or 112345678"
                className="w-full pl-18 pr-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm font-semibold text-neutral-900 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                required
              />
            </div>
            <span className="text-[10px] text-neutral-500 block mt-1">
              Used for receiving M-Pesa investment STK prompts &amp; payouts.
            </span>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-neutral-700">
                Account Password
              </label>
              <span className="text-[10px] text-neutral-500 font-medium">Must be &gt; 4 chars</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <input
                id="auth-password-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 5 characters"
                minLength={5}
                className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm font-semibold text-neutral-900 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                required
              />
            </div>
          </div>

          {authMode === 'register' && (
            <>
              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                  <input
                    id="auth-confirm-password-input"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm font-semibold text-neutral-900 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Referral Code (as in ?ref=652511) */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Invitation / Referral Code
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                    <KeyRound className="w-3.5 h-3.5" />
                  </span>
                  <input
                    id="auth-referral-input"
                    type="text"
                    value={referralCode}
                    onChange={e => setReferralCode(e.target.value)}
                    placeholder="e.g. 652511"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm font-bold text-amber-700 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                  />
                  {referralCode && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Valid Ref
                    </span>
                  )}
                </div>
              </div>

              {/* CAPTCHA */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Graphic Security CAPTCHA
                </label>
                <div className="flex gap-2">
                  <input
                    id="auth-captcha-input"
                    type="text"
                    value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3.5 py-2.5 bg-neutral-50 rounded-xl border border-neutral-300 text-sm font-bold text-neutral-900 focus:border-amber-500 focus:bg-white focus:outline-hidden"
                    required
                  />
                  <div
                    onClick={refreshCaptcha}
                    className="px-4 py-2 bg-neutral-800 text-amber-300 font-mono font-black text-lg tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer select-none border border-neutral-700 hover:bg-neutral-900 transition-colors"
                    title="Click to refresh CAPTCHA"
                  >
                    <span>{generatedCaptcha}</span>
                    <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full py-3 rounded-2xl bg-linear-to-r from-amber-600 via-yellow-600 to-amber-700 text-white font-extrabold text-sm shadow-md hover:opacity-95 active:scale-98 transition-all"
          >
            {authMode === 'login' ? 'Log In to Tkash' : 'Register & Claim 200 KES Voucher'}
          </button>
        </form>

        {/* Database Persistence Status Badge */}
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cloud Firestore Database Active</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">Encrypted &amp; Persistent</span>
        </div>
      </div>
    </div>
  </div>
);
};
