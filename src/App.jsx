import React, { useState } from 'react';
import AdminUserManagement from './components/AdminUserManagement';
import AdminUserDetails from './components/AdminUserDetails';
import StudentLessonPathway from './components/StudentLessonPathway';
import StudentVocabLesson from './components/StudentVocabLesson';
import StudentAccount from './components/StudentAccount';

export default function App() {
  const [roleMode, setRoleMode] = useState('student'); // 'student' | 'admin'
  const [currentTab, setCurrentTab] = useState('pathway'); // 'pathway' | 'vocab' | 'account' | 'admin-list' | 'admin-details'
  const [selectedUser, setSelectedUser] = useState(null);

  const handleRoleChange = (mode) => {
    setRoleMode(mode);
    if (mode === 'admin') {
      setCurrentTab('admin-list');
    } else {
      setCurrentTab('pathway');
    }
  };

  const handleSelectAdminUser = (user) => {
    setSelectedUser(user);
    setCurrentTab('admin-details');
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body pb-16 md:pb-0">
      {/* Global Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-black text-lg sm:text-xl shadow-xs font-headline shrink-0">
              U
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-base sm:text-lg text-on-surface tracking-tight font-headline block sm:inline">
                UKC Learning
              </span>
              <span className="hidden sm:inline-block ml-1 text-on-surface font-extrabold">Portal</span>
              <span className="hidden md:inline-block ml-2 px-1.5 py-0.5 bg-surface-container-low text-[9px] font-bold text-outline uppercase tracking-wider rounded">
                Mobile Optimized
              </span>
            </div>
          </div>

          {/* Right Header Navigation & Role Switcher */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation Links */}
            {roleMode === 'student' && (
              <nav className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => setCurrentTab('pathway')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    currentTab === 'pathway' || currentTab === 'vocab'
                      ? 'bg-primary/10 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">map</span>
                  Lesson Pathway
                </button>

                <button
                  onClick={() => setCurrentTab('account')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    currentTab === 'account'
                      ? 'bg-primary/10 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">person</span>
                  My Profile
                </button>
              </nav>
            )}

            {/* Role Switcher Pill */}
            <div className="bg-surface-container-low p-1 rounded-xl border border-outline-variant flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => handleRoleChange('student')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all min-h-[32px] ${
                  roleMode === 'student'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all min-h-[32px] ${
                  roleMode === 'admin'
                    ? 'bg-tertiary text-on-tertiary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1">
        {roleMode === 'student' && (
          <>
            {currentTab === 'pathway' && (
              <StudentLessonPathway onStartLesson={() => setCurrentTab('vocab')} />
            )}
            {currentTab === 'vocab' && (
              <StudentVocabLesson onFinishLesson={() => setCurrentTab('pathway')} />
            )}
            {currentTab === 'account' && (
              <StudentAccount />
            )}
          </>
        )}

        {roleMode === 'admin' && (
          <>
            {currentTab === 'admin-list' && (
              <AdminUserManagement onSelectUser={handleSelectAdminUser} />
            )}
            {currentTab === 'admin-details' && (
              <AdminUserDetails user={selectedUser} onBack={() => setCurrentTab('admin-list')} />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on mobile viewports for Student Mode) */}
      {roleMode === 'student' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant z-40 px-6 py-2 flex justify-around items-center shadow-lg">
          <button
            onClick={() => setCurrentTab('pathway')}
            className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors ${
              currentTab === 'pathway' || currentTab === 'vocab' ? 'text-primary' : 'text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-xl">map</span>
            <span className="text-[10px] font-bold">Pathway</span>
          </button>

          <button
            onClick={() => setCurrentTab('vocab')}
            className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors ${
              currentTab === 'vocab' ? 'text-primary' : 'text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-xl">style</span>
            <span className="text-[10px] font-bold">Flashcards</span>
          </button>

          <button
            onClick={() => setCurrentTab('account')}
            className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors ${
              currentTab === 'account' ? 'text-primary' : 'text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-xl">person</span>
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      )}

      {/* Global Footer */}
      <footer className="hidden md:block bg-surface-container-lowest border-t border-outline-variant py-6 text-center text-xs text-outline font-label">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 UKC Learning Portal • Mobile-Optimized 100% Free-Tier Stack</p>
        </div>
      </footer>
    </div>
  );
}
