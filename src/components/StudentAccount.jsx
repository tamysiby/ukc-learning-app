import React, { useState } from 'react';
import UserAvatar from './UserAvatar';

export default function StudentAccount() {
  const [profile, setProfile] = useState({
    name: 'Min-ji Kim',
    email: 'minji.kim@ukc.edu',
    notifications: true,
    audioAutoPlay: true,
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-headline">Account Settings</h1>
        <p className="text-sm text-on-surface-variant mt-1 font-label">Manage your profile, email preferences, audio settings, and learning statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Profile & Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs space-y-6">
            <div className="flex items-center gap-6">
              <UserAvatar size="xl" />
              <div>
                <span className="inline-block px-3 py-1 bg-surface-container-low border border-outline-variant text-xs font-semibold text-on-surface-variant rounded-lg">
                  User Avatar Placeholder Active
                </span>
                <p className="text-[11px] text-outline mt-1 font-label">Standardized user icon enabled across portal.</p>
              </div>
            </div>

            {isSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                Profile changes saved successfully!
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant space-y-4">
              <h3 className="text-sm font-bold text-on-surface font-headline">Preferences</h3>
              
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-on-surface">Daily Study Reminders</p>
                  <p className="text-xs text-on-surface-variant">Receive email reminders to keep your 14-day study streak active.</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.notifications}
                  onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </label>

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
                className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Stats */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-xs space-y-4">
            <h3 className="text-md font-bold text-on-surface font-headline">Learning Overview</h3>
            <div className="space-y-3">
              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant">Total Words Learned</span>
                <span className="text-lg font-black text-primary">142</span>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant">Study Streak</span>
                <span className="text-lg font-black text-secondary">14 Days</span>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant">Accuracy Score</span>
                <span className="text-lg font-black text-emerald-700">91%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
