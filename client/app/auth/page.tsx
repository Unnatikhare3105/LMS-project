//client/app/auth/page.tsx



'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ZodIssue } from 'zod';
import { useAppDispatch } from '@/src/hooks/useAppDispatch';
import { useAppSelector } from '@/src/hooks/useAppSelector';
import { toggleTheme } from '@/src/store/slices/uiSlice';
import { Button, Loader } from '@/src/components/ui';
import { Zap, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/src/components/ui/Badge';
import {
  registerSchema, loginSchema, emailSchema, otpSchema, resetPasswordSchema
} from '@/src/validations/auth.validation';
import { registerUser, loginUser, sendOTPThunk, verifyOTPThunk, forgotPasswordThunk, verifyForgotOTPThunk, resetPasswordThunk } from '@/src/store/thunks/auth.thunk';

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useAppSelector((s: any) => s.ui.theme);
  const { loading } = useAppSelector((s: any) => s.auth);

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', mobile: '', password: '' });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const [authStep, setAuthStep] = useState<
    'login' | 'register' | 'otp-login' | 'forgot' | 'forgot-otp' | 'reset'
  >('login');
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});



  const handleLogin = async () => {
    const result = loginSchema.safeParse({ email: form.email, password: form.password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((e: ZodIssue) => {
        if (e.path[0] !== undefined) {
          fieldErrors[String(e.path[0])] = e.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const res = await dispatch(loginUser({ email: form.email, password: form.password }));
    if (loginUser.fulfilled.match(res)) {
      toast.success('Login successful!');
      router.push('/dashboard');
    } else {
      toast.error(res.payload as string);
    }
  };


  const handleRegister = async () => {
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((e: ZodIssue) => {
        if (e.path[0] !== undefined) {
          fieldErrors[String(e.path[0])] = e.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const res = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(res)) {
      toast.success('Account created! Please verify your email.');
      router.push('/dashboard');
    } else {
      toast.error(res.payload as string);
    }
  };

  const handleSendOTP = async () => {
    const result = emailSchema.safeParse({ email: otpEmail });
    if (!result.success) { toast.error('Enter a valid email.'); return; }
    const res = await dispatch(sendOTPThunk(otpEmail));
    if (sendOTPThunk.fulfilled.match(res)) {
      toast.success('OTP sent to your email!');
      setAuthStep('otp-login');
    } else {
      toast.error(res.payload as string);
    }
  };

  const handleVerifyOTP = async () => {
    const result = otpSchema.safeParse({ email: otpEmail, otp });
    if (!result.success) { toast.error('Enter a valid 6-digit OTP.'); return; }
    const res = await dispatch(verifyOTPThunk({ email: otpEmail, otp }));
    if (verifyOTPThunk.fulfilled.match(res)) {
      toast.success('Login successful!');
      router.push('/dashboard');
    } else {
      toast.error(res.payload as string);
    }
  };

  const handleForgotSendOTP = async () => {
    const result = emailSchema.safeParse({ email: otpEmail });
    if (!result.success) { toast.error('Enter a valid email.'); return; }
    const res = await dispatch(forgotPasswordThunk(otpEmail));
    if (forgotPasswordThunk.fulfilled.match(res)) {
      toast.success('Reset OTP sent!');
      setAuthStep('forgot-otp');
    } else {
      toast.error(res.payload as string);
    }
  };

  const handleVerifyForgotOTP = async () => {
    const result = otpSchema.safeParse({ email: otpEmail, otp });
    if (!result.success) { toast.error('Enter a valid 6-digit OTP.'); return; }
    const res = await dispatch(verifyForgotOTPThunk({ email: otpEmail, otp }));
    if (verifyForgotOTPThunk.fulfilled.match(res)) {
      toast.success('OTP verified! Set your new password.');
      setAuthStep('reset');
    } else {
      toast.error(res.payload as string);
    }
  };

  const handleResetPassword = async () => {
    const result = resetPasswordSchema.safeParse({ email: otpEmail, newPassword });
    if (!result.success) { toast.error('Password must be at least 6 characters.'); return; }
    const res = await dispatch(resetPasswordThunk({ email: otpEmail, newPassword }));
    if (resetPasswordThunk.fulfilled.match(res)) {
      toast.success('Password reset! Please login.');
      setAuthStep('login');
      setOtpEmail(''); setOtp(''); setNewPassword('');
    } else {
      toast.error(res.payload as string);
    }
  };


  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
      {/* Theme toggle */}
      <button
        onClick={() => dispatch(toggleTheme())}
        className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-700 dark:hover:text-white transition-colors"
      >
        {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>

      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-neutral-900 dark:text-white">LearnAI</span>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">

          {/* ── Login / Register tabs ── */}
          {(authStep === 'login' || authStep === 'register') && (
            <>
              <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 mb-6">
                {(['login', 'register'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setErrors({}); }}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${tab === t
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                      }`}
                  >
                    {t === 'login' ? 'Sign in' : 'Register'}
                  </button>
                ))}
              </div>

              {tab === 'login' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Email</label>
                    <Input value={form.email} onChange={(v: any) => set('email', v)} placeholder="you@example.com" type="email" />
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Password</label>
                    <div className="relative">
                      <Input value={form.password} onChange={(v: any) => set('password', v)} placeholder="••••••••" type={showPass ? 'text' : 'password'} />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => { setOtpEmail(form.email); setAuthStep('forgot'); }}
                      className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Button onClick={handleLogin} loading={loading} className="w-full mt-1" size="lg">
                    Sign in
                  </Button>
                  <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
                    or{' '}
                    <button
                      onClick={() => { setOtpEmail(form.email); setAuthStep('otp-login'); }}
                      className="text-violet-600 dark:text-violet-400 hover:underline"
                    >
                      sign in with OTP
                    </button>
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Full name</label>
                    <Input value={form.username} onChange={(v) => set('username', v)} placeholder="Unnati Sharma" />
                    {errors.username && <p className="text-xs text-rose-500 mt-1">{errors.username}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Email</label>
                    <Input value={form.email} onChange={(v) => set('email', v)} placeholder="you@example.com" type="email" />
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Mobile</label>
                    <Input value={form.mobile} onChange={(v) => set('mobile', v)} placeholder="10-digit number" />
                    {errors.mobile && <p className="text-xs text-rose-500 mt-1">{errors.mobile}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Password</label>
                    <Input value={form.password} onChange={(v) => set('password', v)} placeholder="Min 6 characters" type="password" />
                    {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
                  </div>
                  <Button onClick={handleRegister} loading={loading} className="w-full mt-1" size="lg">
                    Create account
                  </Button>
                </div>
              )}
            </>
          )}

          {/* ── OTP Login ── */}
          {authStep === 'otp-login' && (
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">Sign in with OTP</h2>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Email</label>
                <Input value={otpEmail} onChange={setOtpEmail} placeholder="you@example.com" type="email" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">OTP</label>
                <Input value={otp} onChange={setOtp} placeholder="6-digit OTP" />
              </div>
              <Button onClick={handleVerifyOTP} loading={loading} className="w-full" size="lg">Verify OTP</Button>
              <button
                onClick={handleSendOTP}
                className="w-full text-sm text-violet-600 dark:text-violet-400 hover:underline py-1"
              >
                Send / Resend OTP
              </button>
              <button
                onClick={() => { setAuthStep('login'); setOtp(''); setOtpEmail(''); }}
                className="text-xs text-neutral-400 hover:underline w-full text-center"
              >
                ← Back to login
              </button>
            </div>
          )}

          {/* ── Forgot Password: enter email ── */}
          {authStep === 'forgot' && (
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">Forgot password</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Enter your registered email to receive a reset OTP.</p>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Email</label>
                <Input value={otpEmail} onChange={setOtpEmail} placeholder="you@example.com" type="email" />
              </div>
              <Button onClick={handleForgotSendOTP} loading={loading} className="w-full" size="lg">Send Reset OTP</Button>
              <button
                onClick={() => { setAuthStep('login'); setOtpEmail(''); }}
                className="text-xs text-neutral-400 hover:underline w-full text-center"
              >
                ← Back to login
              </button>
            </div>
          )}

          {/* ── Forgot Password: verify OTP ── */}
          {authStep === 'forgot-otp' && (
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">Enter OTP</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">OTP sent to <span className="font-medium text-neutral-700 dark:text-neutral-300">{otpEmail}</span></p>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">OTP</label>
                <Input value={otp} onChange={setOtp} placeholder="6-digit OTP" />
              </div>
              <Button onClick={handleVerifyForgotOTP} loading={loading} className="w-full" size="lg">Verify OTP</Button>
              <button
                onClick={() => { setAuthStep('forgot'); setOtp(''); }}
                className="text-xs text-neutral-400 hover:underline w-full text-center"
              >
                ← Back
              </button>
            </div>
          )}

          {/* ── Reset Password ── */}
          {authStep === 'reset' && (
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">Set new password</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Choose a strong password for your account.</p>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">New Password</label>
                <div className="relative">
                  <Input value={newPassword} onChange={setNewPassword} placeholder="Min 6 characters" type={showPass ? 'text' : 'password'} />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button onClick={handleResetPassword} loading={loading} className="w-full" size="lg">Reset Password</Button>
            </div>
          )}

        </div>

        <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 mt-4">
          By continuing you agree to our Terms of Service
        </p>
      </div>
    </div>
  );

}