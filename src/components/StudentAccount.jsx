import React, { useState } from 'react';
import UserAvatar from './UserAvatar';

export default function StudentAccount() {
  const [profile, setProfile] = useState({
    name: 'Min-ji Kim',
    username: 'minji.kim',
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Profile & Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs space-y-6">
            <div className="flex items-center gap-6">
              <UserAvatar size="xl" />
              <div>
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
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Username</label>
                <input
                  type="text"
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
                className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
