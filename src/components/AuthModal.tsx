import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (account: UserAccount) => void;
  defaultEmail?: string;
  initialMode?: 'signup' | 'signin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultEmail = '',
  initialMode = 'signup'
}) => {
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);
  const [email, setEmail] = useState<string>(defaultEmail);
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [country, setCountry] = useState<string>('Bangladesh');

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    const isBD = country === 'Bangladesh';
    const account: UserAccount = {
      uid: 'user-' + Date.now(),
      email: email.trim(),
      displayName: fullName.trim(),
      photoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(fullName.trim() || 'User'),
      isLoggedIn: true,
      country: isBD ? 'Bangladesh' : country,
      isBangladeshTalentPass: isBD,
      freeDownloadsCount: 0,
      isPaidConsultationClient: false,
      savedResumes: []
    };
    onLoginSuccess(account);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || !fullName.trim()) return;
    handleGoogleSignIn();
  };

  const isBD = country === 'Bangladesh';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-paper rounded-2xl shadow-2xl border border-line w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-line flex items-center justify-between bg-soft/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-success bg-success-soft px-2 py-0.5 rounded">
                ATS Resume Maker
              </span>
              {isBD && (
                <span className="text-xs font-semibold text-accent flex items-center gap-1">
                  🇧🇩 Free Forever Active
                </span>
              )}
            </div>
            <h3 className="font-heading text-lg font-bold text-ink mt-1">
              {mode === 'signup' ? 'Create Your Career Account' : 'Welcome Back'}
            </h3>
            <p className="text-xs text-muted/80 mt-0.5">
              Save your master CV, tailor unlimited versions, and export without watermarks.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted/60 hover:text-muted rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 pt-4 flex border-b border-line">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-colors ${
              mode === 'signup'
                ? 'border-emerald-600 text-success'
                : 'border-transparent text-muted/80 hover:text-ink'
            }`}
          >
            Sign Up (1 Free Resume)
          </button>
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-colors ${
              mode === 'signin'
                ? 'border-emerald-600 text-success'
                : 'border-transparent text-muted/80 hover:text-ink'
            }`}
          >
            Sign In to Existing Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick 1-Click Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 bg-paper hover:bg-soft text-ink/90 text-xs font-semibold rounded-xl border border-line shadow-2xs transition-colors flex items-center justify-center gap-2.5"
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
            Continue with Google (1-Click)
          </button>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] text-muted/60 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-ink/90 block">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-muted/60 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-ink/90 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted/60 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full text-xs pl-9 pr-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-ink/90 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted/60 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-ink/90 flex items-center justify-between">
              <span>Your Country of Residence</span>
              {isBD && (
                <span className="text-[10px] text-accent font-bold">100% Free Forever Pass Active</span>
              )}
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-line rounded-lg bg-paper"
            >
              <option value="Bangladesh">🇧🇩 Bangladesh (100% Free Forever)</option>
              <option value="United States">🇺🇸 United States</option>
              <option value="United Kingdom">🇬🇧 United Kingdom</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="Germany">🇩🇪 Germany / Europe</option>
              <option value="India">🇮🇳 India</option>
              <option value="UAE">🇦🇪 United Arab Emirates</option>
              <option value="Singapore">🇸🇬 Singapore</option>
              <option value="Other">🌐 Other International</option>
            </select>
          </div>

          {/* Social Impact Pledge */}
          {isBD ? (
            <div className="p-3 bg-soft border border-line rounded-xl text-xs text-success space-y-1">
              <span className="font-bold flex items-center gap-1 text-success">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Bangladesh Talent Pledge
              </span>
              <p className="text-[11px] text-success leading-snug">
                As part of our commitment to Bangladeshi graduates and youth facing the job crisis, your account is granted <strong>unlimited free resume creations, cloud saves, and vector PDF exports forever</strong>.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-soft border border-line rounded-xl text-xs text-muted space-y-1">
              <span className="font-bold text-ink flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                Transparent Freemium Guarantee
              </span>
              <p className="text-[11px] leading-snug">
                Includes 1 full master resume with live ATS checking and high-resolution vector PDF export. No hidden automatic credit card charges.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-ink hover:bg-ink text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            {mode === 'signup' ? 'Complete Sign-Up & Save Resume' : 'Sign In to Your Workspace'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
