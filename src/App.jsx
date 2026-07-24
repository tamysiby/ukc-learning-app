import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import AdminUserManagement from './components/AdminUserManagement';
import AdminUserDetails from './components/AdminUserDetails';
import StudentLessonPathway from './components/StudentLessonPathway';
import StudentVocabLesson from './components/StudentVocabLesson';
import StudentAccount from './components/StudentAccount';
import UserAvatar from './components/UserAvatar';

function AppContent() {
  const { currentUser, isAuthenticated, userRole, logout, loading } = useAuth();
  
  // Tabs: 'pathway' | 'vocab' | 'account' (for Student) | 'admin-list' | 'admin-details' (for Admin)
  const [currentTab, setCurrentTab] = useState(userRole === 'Admin' ? 'admin-list' : 'pathway');
  const [selectedUser, setSelectedUser] = useState(null);

  // If loading session check
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-primary font-bold text-sm">
          <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
          <span>Loading UKC Learning Portal...</span>
        </div>
      </div>
    );
  }

  // Gated Route: Unauthenticated users MUST log in first
  if (!isAuthenticated) {
    return <LoginPage />;
  }

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
                Authenticated
              </span>
            </div>
          </div>

          {/* Header Navigation & User Profile / Logout */}
          <div className="flex items-center gap-3">
            {/* Student Navigation Links */}
            {userRole === 'Student' && (
              <nav className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => setCurrentTab('pathway')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
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

            {/* User Profile Pill & Logout Action */}
            <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/60">
              <div className="hidden sm:flex items-center gap-2">
                <UserAvatar size="sm" />
                <div className="text-left text-xs leading-tight">
                  <p className="font-bold text-on-surface">{currentUser?.name}</p>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    userRole === 'Admin' ? 'bg-tertiary-container/40 text-tertiary' : 'bg-primary-fixed/60 text-primary'
                  }`}>
                    {userRole}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                title="Sign out of your account"
                className="px-2.5 py-1.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface-variant hover:bg-rose-500/10 hover:text-rose-700 hover:border-rose-300 transition-all flex items-center gap-1 min-h-[36px] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Authenticated Views */}
      <main className="flex-1">
        {userRole === 'Student' ? (
          <>
            {(currentTab === 'pathway' || currentTab === 'admin-list' || currentTab === 'admin-details') && (
              <StudentLessonPathway onStartLesson={() => setCurrentTab('vocab')} />
            )}
            {currentTab === 'vocab' && (
              <StudentVocabLesson onFinishLesson={() => setCurrentTab('pathway')} />
            )}
            {currentTab === 'account' && (
              <StudentAccount />
            )}
          </>
        ) : (
          <>
            {currentTab === 'admin-details' ? (
              <AdminUserDetails user={selectedUser} onBack={() => setCurrentTab('admin-list')} />
            ) : (
              <AdminUserManagement onSelectUser={handleSelectAdminUser} />
            )}
          </>
        )}
      </main>

      {/* Mobile Navigation for Students */}
      {userRole === 'Student' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant z-40 px-6 py-2 flex justify-around items-center shadow-lg">
          <button
            onClick={() => setCurrentTab('pathway')}
            className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors cursor-pointer ${
              currentTab === 'pathway' || currentTab === 'vocab' ? 'text-primary' : 'text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-xl">map</span>
            <span className="text-[10px] font-bold">Pathway</span>
          </button>

          <button
            onClick={() => setCurrentTab('vocab')}
            className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors cursor-pointer ${
              currentTab === 'vocab' ? 'text-primary' : 'text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-xl">style</span>
            <span className="text-[10px] font-bold">Flashcards</span>
          </button>

          <button
            onClick={() => setCurrentTab('account')}
            className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors cursor-pointer ${
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
          <p>© 2026 UKC Learning Portal • Role-Based Authenticated Session</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
