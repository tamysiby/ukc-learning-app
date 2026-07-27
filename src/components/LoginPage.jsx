import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkActiveSessionExists } from '../services/supabaseClient';

export default function LoginPage() {
  const { login, authError, clearError, sessionNotice, clearSessionNotice, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pending active session confirm modal state
  const [pendingLogin, setPendingLogin] = useState(null);

  const attemptLogin = async (loginUsername, loginPassword, isConfirmed = false) => {
    if (!loginUsername || !loginPassword) return;

    // Check if another session is currently active for this user account
    if (!isConfirmed && checkActiveSessionExists(loginUsername)) {
      setPendingLogin({ username: loginUsername, password: loginPassword });
      return;
    }

    setIsSubmitting(true);
    await login(loginUsername, loginPassword);
    setIsSubmitting(false);
    setPendingLogin(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    attemptLogin(username, password);
  };

  const handleQuickDemo = (demoUsername, demoPass) => {
    setUsername(demoUsername);
    setPassword(demoPass);
    attemptLogin(demoUsername, demoPass);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-body">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-headline">
              UKC Learning Portal
            </h1>
          </div>
        </div>

        {/* Card Box */}
        <div className="mt-8 bg-surface-container-lowest py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-outline-variant/80 backdrop-blur-sm space-y-6">
          {/* Session Expiry or Superseded Notice */}
          {sessionNotice && (
            <div className="p-3.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 rounded-2xl border border-amber-500/20 text-xs flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg shrink-0 text-amber-600">info</span>
                <span>{sessionNotice}</span>
              </div>
              <button
                type="button"
                onClick={clearSessionNotice}
                className="text-amber-800 dark:text-amber-300 hover:opacity-80 p-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

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
                className="text-red-700 dark:text-red-300 hover:opacity-80 p-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-username-input" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-label">
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  account_circle
                </span>
                <input
                  id="login-username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    clearError();
                    setUsername(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password-input" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-label">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                  lock
                </span>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    clearError();
                    setPassword(e.target.value);
                  }}
                  className="w-full pl-10 pr-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
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
                onClick={() => handleQuickDemo('admin', 'AdminPass123!')}
                className="px-3 py-2 bg-tertiary/10 hover:bg-tertiary/20 text-tertiary border border-tertiary/20 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                Admin Login
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('minji.kim', 'StudentPass123!')}
                className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">school</span>
                Student Login
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-outline mt-6 font-label">
          © 2026 UKC Learning Portal
        </p>
      </div>

      {/* ACTIVE SESSION DETECTED WARNING CONFIRMATION DIALOG */}
      {pendingLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-on-surface font-headline">Active Session Detected</h3>
                <p className="text-xs text-on-surface-variant font-label">This account is currently logged in on another device or tab.</p>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 leading-relaxed space-y-1.5">
              <p className="font-bold text-amber-800 dark:text-amber-300">⚠️ Continuing will log out the older session</p>
              <p>
                Logging in now will terminate the active session on your other device/tab, and any unsaved progress in ongoing lessons or interactive decks will be reset.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                type="button"
                onClick={() => setPendingLogin(null)}
                className="px-4 py-2.5 border border-outline-variant rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container-low transition-colors min-h-[40px] cursor-pointer"
              >
                Cancel Login
              </button>
              <button
                type="button"
                onClick={() => attemptLogin(pendingLogin.username, pendingLogin.password, true)}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors min-h-[40px] cursor-pointer"
              >
                Log In & Disconnect Older Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
