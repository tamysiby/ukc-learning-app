import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';

export default function StudentAccount() {
  const { currentUser, changeUserPassword, updateStudentUser } = useAuth();

  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    username: currentUser?.username || '',
    audioAutoPlay: true,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passStatus, setPassStatus] = useState({ error: '', success: '', loading: false });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setIsSaved(false);

    if (!currentUser) return;

    const res = await updateStudentUser(currentUser.id, {
      name: profile.name,
      username: profile.username,
    });

    if (!res.success) {
      setProfileError(res.error || 'Failed to update profile details.');
    } else {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassStatus({ error: '', success: '', loading: false });

    if (!newPassword || newPassword.length < 6) {
      setPassStatus({ error: 'Password must be at least 6 characters.', success: '', loading: false });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassStatus({ error: 'Passwords do not match.', success: '', loading: false });
      return;
    }

    setPassStatus({ error: '', success: '', loading: true });
    const res = await changeUserPassword(newPassword);

    if (!res.success) {
      setPassStatus({ error: res.error || 'Failed to update password.', success: '', loading: false });
    } else {
      setNewPassword('');
      setConfirmPassword('');
      setPassStatus({ error: '', success: 'Password updated successfully!', loading: false });
      setTimeout(() => setPassStatus({ error: '', success: '', loading: false }), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-headline">Account Settings</h1>
      </div>

      {currentUser?.mustChangePassword && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs font-semibold rounded-2xl flex items-center gap-3 animate-in fade-in">
          <span className="material-symbols-outlined text-lg text-amber-600 shrink-0">warning</span>
          <span>Temporary admin password active. Please set a new password below to secure your account.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs space-y-6">
            <div className="flex items-center gap-4">
              <UserAvatar name={currentUser?.name} role={currentUser?.role} size="xl" />
              <div>
                <h2 className="text-base font-bold text-on-surface">{currentUser?.name}</h2>
                <p className="text-xs text-outline">{currentUser?.role} • {currentUser?.level || 'Beginner'}</p>
              </div>
            </div>

            {isSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                Profile changes saved successfully!
              </div>
            )}

            {profileError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {profileError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant space-y-4">
              <h3 className="text-sm font-bold text-on-surface font-headline">Preferences</h3>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-on-surface">Auto-play Pronunciation Audio</p>
                  <p className="text-xs text-on-surface-variant">Automatically speak Korean vocabulary when turning a flashcard.</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.audioAutoPlay}
                  onChange={(e) => setProfile({ ...profile, audioAutoPlay: e.target.checked })}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>

          {/* Password Change Card */}
          <form onSubmit={handleChangePasswordSubmit} className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-xl">lock_reset</span>
              <h3 className="text-base font-bold text-on-surface font-headline">Change Password</h3>
            </div>

            {passStatus.success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                {passStatus.success}
              </div>
            )}

            {passStatus.error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {passStatus.error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={passStatus.loading}
                className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {passStatus.loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
