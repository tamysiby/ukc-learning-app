import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ForceChangePasswordModal() {
  const { currentUser, changeUserPassword, logout } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (import.meta.env?.DEV) {
      console.log('[DEV ForceChangePasswordModal] User password change status:', {
        userId: currentUser?.id,
        username: currentUser?.username,
        mustChangePassword: currentUser?.mustChangePassword
      });
    }
  }, [currentUser?.id, currentUser?.mustChangePassword]);

  if (!currentUser || !currentUser.mustChangePassword) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (import.meta.env?.DEV) {
      console.log('[DEV ForceChangePasswordModal] Submitting password update for user:', currentUser?.id);
    }

    setIsSubmitting(true);
    const res = await changeUserPassword(newPassword);
    setIsSubmitting(false);

    if (import.meta.env?.DEV) {
      console.log('[DEV ForceChangePasswordModal] Password update result:', res);
    }

    if (!res.success) {
      setError(res.error || 'Failed to update password.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in font-body">
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-xl">lock_reset</span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-on-surface font-headline">Password Update Required</h2>
              <p className="text-xs text-on-surface-variant font-label">Set a new password to continue.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
            title="Logout & Exit"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 text-red-700 dark:text-red-300 rounded-2xl border border-red-500/20 text-xs flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-lg shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-label">
              New Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => {
                  setError('');
                  setNewPassword(e.target.value);
                }}
                placeholder="Enter new password"
                className="w-full pl-10 pr-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-label">
              Confirm Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
                lock_clock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setError('');
                  setConfirmPassword(e.target.value);
                }}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-10 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors min-h-[44px]"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span>Logout</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Save New Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
