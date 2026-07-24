import React from 'react';
import UserAvatar from './UserAvatar';

export default function AdminUserDetails({ user, onBack }) {
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back navigation */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-container px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-all"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to User List
        </button>
      </div>

      {/* User Banner Header */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <UserAvatar size="xl" />
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface font-headline">{user.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                user.role === 'Admin' ? 'bg-tertiary-container/30 text-tertiary' : 'bg-primary-fixed/60 text-primary'
              }`}>
                {user.role}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {user.status}
              </span>
              {user.isOnline && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online Now
                </span>
              )}
            </div>
            <p className="text-sm text-on-surface-variant font-label">{user.email}</p>
            <p className="text-xs text-outline">Enrolled Level: <span className="font-semibold text-on-surface">{user.level}</span> • Joined {user.joinedDate}</p>
          </div>
        </div>

        {/* Quick stat cards */}
        <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-outline-variant pt-4 md:pt-0 md:pl-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-outline font-semibold">Course Progress</p>
            <p className="text-2xl font-black text-primary mt-1 font-headline">{user.progress}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-outline font-semibold">Study Streak</p>
            <p className="text-2xl font-black text-secondary mt-1 font-headline">{user.streak} Days</p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-outline font-semibold">Last Active</p>
            <p className="text-xs font-semibold text-on-surface mt-2">{user.lastActive}</p>
          </div>
        </div>
      </div>

      {/* Progress Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Unit Progress Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Unit Masteries & Accuracy
            </h2>

            <div className="space-y-4">
              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/60 space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-on-surface">Unit 1: Hangul Vowels & Consonants</span>
                  <span className="text-emerald-700 font-bold">100% Completed</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/60 space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-on-surface">Unit 2: Greetings & Daily Expressions</span>
                  <span className="text-primary font-bold">92% Mastery</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/60 space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-on-surface">Unit 3: Essential Vocabulary Deck</span>
                  <span className="text-secondary font-bold">64% Progress (In Study)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Recent Activity Log
            </h2>
            <ul className="divide-y divide-outline-variant/60 text-sm text-on-surface">
              <li className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-on-surface">Completed Flashcard Deck: Greetings</p>
                  <p className="text-xs text-outline">Score: 18 / 20 Words Mastered</p>
                </div>
                <span className="text-xs font-medium text-on-surface-variant">Today, 2:15 PM</span>
              </li>
              <li className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-on-surface">Passed Quiz: Unit 2 Grammar</p>
                  <p className="text-xs text-outline">Passed with 95% score</p>
                </div>
                <span className="text-xs font-medium text-on-surface-variant">Yesterday, 4:40 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Col: Admin Controls */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-xs space-y-4">
            <h3 className="text-md font-bold text-on-surface font-headline">Admin Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded-xl text-xs font-semibold text-on-surface flex items-center justify-between transition-colors">
                <span>Reset Unit 3 Progress</span>
                <span className="material-symbols-outlined text-base">restart_alt</span>
              </button>
              <button className="w-full text-left px-4 py-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded-xl text-xs font-semibold text-on-surface flex items-center justify-between transition-colors">
                <span>Re-assign Student Level</span>
                <span className="material-symbols-outlined text-base">school</span>
              </button>
              <button className="w-full text-left px-4 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center justify-between transition-colors">
                <span>Deactivate Student Account</span>
                <span className="material-symbols-outlined text-base">block</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
