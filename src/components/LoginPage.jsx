import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, authError, clearError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
  };

  const handleQuickDemo = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsSubmitting(true);
    await login(demoEmail, demoPass);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-body">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary text-on-primary flex items-center justify-center font-black text-2xl shadow-lg font-headline">
            U
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-headline">
              UKC Learning Portal
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 font-label">
              Sign in to your learning dashboard or administrative portal.
            </p>
          </div>
        </div>

        {/* Card Box */}
        <div className="mt-8 bg-surface-container-lowest py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-outline-variant/80 backdrop-blur-sm space-y-6">
          {/* Admin Managed Account Notice */}
          <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">verified_user</span>
            <div className="text-xs text-on-surface-variant space-y-0.5">
              <p className="font-bold text-on-surface">Restricted Access</p>
              <p>Public sign-up is disabled. Student accounts are added and managed exclusively by Administrators.</p>
            </div>
          </div>

          {/* Error Message Alert */}
          {authError && (
            <div className="p-3.5 bg-red-500/10 text-red-700 dark:text-red-300 rounded-2xl border border-red-500/20 text-xs flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg shrink-0">error</span>
                <span>{authError}</span>
              </div>
              <button
                type="button"
                onClick={clearError}
                className="text-red-700 dark:text-red-300 hover:opacity-80 p-0.5"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-label">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    clearError();
                    setEmail(e.target.value);
                  }}
                  placeholder="name@ukc.edu"
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-label">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    clearError();
                    setPassword(e.target.value);
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting || loading ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">login</span>
                  <span>Sign In to Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Shortcut Section */}
          <div className="pt-4 border-t border-outline-variant/60 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-outline text-center">
              Quick Testing Shortcuts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@ukc.edu', 'AdminPass123!')}
                className="px-3 py-2 bg-tertiary/10 hover:bg-tertiary/20 text-tertiary border border-tertiary/20 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                Admin Login
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('minji.kim@ukc.edu', 'StudentPass123!')}
                className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">school</span>
                Student Login
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-outline mt-6 font-label">
          © 2026 UKC Learning Portal • Role-Based Security Enabled
        </p>
      </div>
    </div>
  );
}
