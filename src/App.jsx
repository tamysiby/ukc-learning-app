import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import AdminUserManagement from './components/AdminUserManagement';
import AdminUserDetails from './components/AdminUserDetails';
import AdminLessonManagement from './components/AdminLessonManagement';
import StudentLessonPathway from './components/StudentLessonPathway';
import { BatchimLesson, EyoLesson, VocabLesson, VocabQuizLesson } from './lessons';
import VocabOverview from './components/VocabOverview';
import StudentAccount from './components/StudentAccount';
import ForceChangePasswordModal from './components/ForceChangePasswordModal';
import UserAvatar from './components/UserAvatar';
import { getStoredLessons, DEFAULT_LESSONS } from './services/lessonRegistry';
import { generateRandomVocabQuiz } from './services/quizGenerator';
import { getStoredUsers } from './services/supabaseClient';

const parseHash = (hashStr, userRole) => {
  const cleanHash = (hashStr || '').replace(/^#\/?/, '');
  if (!cleanHash || cleanHash === 'pathway') {
    return { tab: userRole === 'Admin' ? 'admin-list' : 'pathway' };
  }
  if (cleanHash === 'account') {
    return { tab: 'account' };
  }
  if (cleanHash === 'batchim') {
    return { tab: 'batchim', lessonId: 'les-batchim-1' };
  }
  if (cleanHash === 'eyo') {
    return { tab: 'eyo', lessonId: 'les-eyo-1' };
  }
  if (cleanHash.startsWith('lesson/')) {
    const lessonId = cleanHash.replace('lesson/', '');
    if (lessonId === 'les-batchim-1') {
      return { tab: 'batchim', lessonId };
    }
    if (lessonId === 'les-eyo-1') {
      return { tab: 'eyo', lessonId };
    }
    return { tab: 'vocab', lessonId };
  }
  if (cleanHash.startsWith('quiz/')) {
    const lessonId = cleanHash.replace('quiz/', '');
    return { tab: 'vocab-quiz', lessonId };
  }
  if (cleanHash === 'admin-list') {
    return { tab: 'admin-list' };
  }
  if (cleanHash === 'admin-lessons') {
    return { tab: 'admin-lessons' };
  }
  if (cleanHash.startsWith('admin-user/')) {
    const userId = cleanHash.replace('admin-user/', '');
    return { tab: 'admin-details', userId };
  }
  return { tab: userRole === 'Admin' ? 'admin-list' : 'pathway' };
};

const navigateTo = (hash) => {
  const targetHash = hash.startsWith('#') ? hash : `#${hash}`;
  if (window.location.hash !== targetHash) {
    window.location.hash = targetHash;
  }
};

function AppContent() {
  const { currentUser, isAuthenticated, userRole, logout, loading, markLessonCompleted } = useAuth();

  // Tabs: 'pathway' | 'hangul' | 'batchim' | 'vocab' | 'vocab-quiz' | 'account' (for Student) | 'admin-list' | 'admin-details' | 'admin-lessons' (for Admin)
  const [currentTab, setCurrentTab] = useState(userRole === 'Admin' ? 'admin-list' : 'pathway');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeVocabLesson, setActiveVocabLesson] = useState(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState([]);
  const [showFlashcardDeck, setShowFlashcardDeck] = useState(false);

  // Sync state with URL hash navigation and prepare history stack for refreshes
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncRouteFromHash = () => {
      const route = parseHash(window.location.hash, userRole);

      if (route.tab === 'vocab' && route.lessonId) {
        const allLessons = getStoredLessons();
        const target = allLessons.find(l => l.id === route.lessonId) || DEFAULT_LESSONS[0];
        setActiveVocabLesson(target);
        setShowFlashcardDeck(false);
        if (currentUser?.id) {
          markLessonCompleted(currentUser.id, target.id);
        }
        setCurrentTab('vocab');
      } else if (route.tab === 'batchim') {
        if (currentUser?.id) {
          markLessonCompleted(currentUser.id, 'les-batchim-1');
        }
        setCurrentTab('batchim');
      } else if (route.tab === 'eyo') {
        if (currentUser?.id) {
          markLessonCompleted(currentUser.id, 'les-eyo-1');
        }
        setCurrentTab('eyo');
      } else if (route.tab === 'vocab-quiz' && route.lessonId) {
        const allLessons = getStoredLessons();
        const target = allLessons.find(l => l.id === route.lessonId) || DEFAULT_LESSONS[0];
        const pairedVocab = allLessons.find(l => l.id === target.pairedVocabId) || DEFAULT_LESSONS[0];
        const poolWords = pairedVocab.words && pairedVocab.words.length > 0 ? pairedVocab.words : DEFAULT_LESSONS[0].words;

        setActiveVocabLesson(target);
        setActiveQuizQuestions(prev => (prev.length > 0 ? prev : generateRandomVocabQuiz(poolWords)));
        setCurrentTab('vocab-quiz');
      } else if (route.tab === 'hangul') {
        setCurrentTab('hangul');
      } else if (route.tab === 'admin-details' && route.userId) {
        const users = getStoredUsers();
        const user = users.find(u => u.id === route.userId);
        if (user) {
          setSelectedUser(user);
        }
        setCurrentTab('admin-details');
      } else {
        setCurrentTab(route.tab);
      }
    };

    // Prepare history stack when refreshed inside a lesson so browser back button returns to pathway
    const initialHash = window.location.hash;
    const initialRoute = parseHash(initialHash, userRole);
    if (['vocab', 'vocab-quiz', 'batchim', 'eyo'].includes(initialRoute.tab)) {
      const defaultHash = userRole === 'Admin' ? '#admin-list' : '#pathway';
      window.history.replaceState(null, '', defaultHash);
      window.history.pushState(null, '', initialHash);
    }

    syncRouteFromHash();

    window.addEventListener('hashchange', syncRouteFromHash);
    return () => window.removeEventListener('hashchange', syncRouteFromHash);
  }, [isAuthenticated, userRole, currentUser?.id]);

  // Focus Mode when student is active inside a lesson or quiz
  const isLessonActive = userRole === 'Student' && (currentTab === 'vocab' || currentTab === 'vocab-quiz' || currentTab === 'batchim' || currentTab === 'eyo');

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
    navigateTo(`admin-user/${user.id}`);
  };

  const handleFinishHangulLesson = () => {
    markLessonCompleted(currentUser?.id, 'les-custom-1');
    navigateTo('pathway');
  };

  const handleFinishBatchimLesson = () => {
    if (currentUser?.id) {
      markLessonCompleted(currentUser.id, 'les-batchim-1');
    }
    navigateTo('pathway');
  };

  const handleFinishEyoLesson = () => {
    if (currentUser?.id) {
      markLessonCompleted(currentUser.id, 'les-eyo-1');
    }
    navigateTo('pathway');
  };

  const handleStartVocabLesson = (lessonId = 'les-vowels-1') => {
    const allLessons = getStoredLessons();
    const target = allLessons.find(l => l.id === lessonId) || DEFAULT_LESSONS[0];

    if (target.type === 'vocab') {
      navigateTo(`lesson/${lessonId}`);
    } else if (target.type === 'vocab quiz') {
      navigateTo(`quiz/${lessonId}`);
    } else {
      navigateTo(`lesson/${lessonId}`);
    }
  };

  const handleFinishVocabLesson = () => {
    if (activeVocabLesson) {
      markLessonCompleted(currentUser?.id, activeVocabLesson.id);
    }
    navigateTo('pathway');
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '';
  };

  return (
    <div className={`min-h-screen bg-background text-on-background flex flex-col font-body ${isLessonActive ? '' : 'pb-16 md:pb-0'}`}>
      {/* Global Header (Hidden during active lesson Focus Mode) */}
      {!isLessonActive && (
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
              </div>
            </div>

            {/* Header Navigation & User Profile / Logout */}
            <div className="flex items-center gap-3">
              {/* Student Navigation Links */}
              {userRole === 'Student' && (
                <nav className="hidden md:flex items-center gap-1">
                  <button
                    onClick={() => navigateTo('pathway')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${currentTab === 'pathway' || currentTab === 'hangul' || currentTab === 'vocab' || currentTab === 'vocab-quiz'
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">map</span>
                    Lesson Pathway
                  </button>

                  <button
                    onClick={() => navigateTo('account')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${currentTab === 'account'
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">person</span>
                    My Profile
                  </button>
                </nav>
              )}

              {/* Admin Navigation Links */}
              {userRole === 'Admin' && (
                <nav className="hidden md:flex items-center gap-1">
                  <button
                    onClick={() => navigateTo('admin-list')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${currentTab === 'admin-list' || currentTab === 'admin-details'
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">group</span>
                    User Management
                  </button>

                  <button
                    onClick={() => navigateTo('admin-lessons')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${currentTab === 'admin-lessons'
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">auto_stories</span>
                    Lesson Management
                  </button>
                </nav>
              )}

              {/* User Profile Pill & Logout Action */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-outline-variant">
                <UserAvatar name={currentUser?.name} role={currentUser?.role} size="sm" />
                <div className="hidden lg:block leading-tight text-left">
                  <p className="font-bold text-xs text-on-surface">{currentUser?.name}</p>
                  <p className="text-[10px] text-outline">{currentUser?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold text-outline hover:text-rose-600 hover:bg-rose-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Sign out of portal"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Authenticated Views */}
      <main className="flex-1">
        {userRole === 'Student' ? (
          <>
            {(currentTab === 'pathway' || currentTab === 'admin-list' || currentTab === 'admin-details') && (
              <StudentLessonPathway
                onStartVocabLesson={(lessonId) => handleStartVocabLesson(lessonId)}
              />
            )}
            {currentTab === 'batchim' && (
              <BatchimLesson onFinishLesson={handleFinishBatchimLesson} />
            )}
            {currentTab === 'eyo' && (
              <EyoLesson onFinishLesson={handleFinishEyoLesson} />
            )}
            {currentTab === 'vocab' && (
              showFlashcardDeck ? (
                <VocabLesson
                  words={activeVocabLesson?.words || DEFAULT_LESSONS[0].words}
                  title={activeVocabLesson?.title || 'Vocabulary Flashcards'}
                  onFinishLesson={() => setShowFlashcardDeck(false)}
                />
              ) : (
                <VocabOverview
                  title={activeVocabLesson?.title || 'Hangeul Vowels (한글 모음)'}
                  description={activeVocabLesson?.description || 'Learn fundamental Korean vowel characters.'}
                  words={activeVocabLesson?.words || DEFAULT_LESSONS[0].words}
                  onStartFlashcards={() => setShowFlashcardDeck(true)}
                  onBackToPathway={handleFinishVocabLesson}
                />
              )
            )}
            {currentTab === 'vocab-quiz' && (
              <VocabQuizLesson
                title={activeVocabLesson?.title || 'Hangeul Vowels Quiz (한글 모음 Quiz)'}
                quizQuestions={activeQuizQuestions}
                onFinishQuiz={handleFinishVocabLesson}
                onExitQuiz={() => navigateTo('pathway')}
              />
            )}
            {currentTab === 'account' && (
              <StudentAccount />
            )}
          </>
        ) : (
          <>
            {currentTab === 'admin-lessons' ? (
              <AdminLessonManagement />
            ) : currentTab === 'admin-details' && selectedUser ? (
              <AdminUserDetails
                user={selectedUser}
                onBack={() => {
                  setSelectedUser(null);
                  navigateTo('admin-list');
                }}
              />
            ) : (
              <AdminUserManagement onSelectUser={handleSelectAdminUser} />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden during active lesson Focus Mode) */}
      {!isLessonActive && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant z-40 px-6 py-2 flex justify-around items-center shadow-lg">
          {userRole === 'Student' ? (
            <>
              <button
                onClick={() => navigateTo('pathway')}
                className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors cursor-pointer ${currentTab === 'pathway' || currentTab === 'hangul' || currentTab === 'vocab' || currentTab === 'vocab-quiz' ? 'text-primary' : 'text-outline'
                  }`}
              >
                <span className="material-symbols-outlined text-xl">map</span>
                <span className="text-[10px] font-bold">Pathway</span>
              </button>

              <button
                onClick={() => navigateTo('account')}
                className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors cursor-pointer ${currentTab === 'account' ? 'text-primary' : 'text-outline'
                  }`}
              >
                <span className="material-symbols-outlined text-xl">person</span>
                <span className="text-[10px] font-bold">Profile</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateTo('admin-list')}
                className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors cursor-pointer ${currentTab === 'admin-list' || currentTab === 'admin-details' ? 'text-primary' : 'text-outline'
                  }`}
              >
                <span className="material-symbols-outlined text-xl">group</span>
                <span className="text-[10px] font-bold">Users</span>
              </button>

              <button
                onClick={() => navigateTo('admin-lessons')}
                className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors cursor-pointer ${currentTab === 'admin-lessons' ? 'text-primary' : 'text-outline'
                  }`}
              >
                <span className="material-symbols-outlined text-xl">auto_stories</span>
                <span className="text-[10px] font-bold">Lessons</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Global Footer (Hidden during active lesson Focus Mode) */}
      {!isLessonActive && (
        <footer className="hidden md:block bg-surface-container-lowest border-t border-outline-variant py-6 text-center text-xs text-outline font-label">
          <div className="max-w-7xl mx-auto px-4">
            <p>© 2026 UKC Learning Portal • Role-Based Authenticated Session</p>
          </div>
        </footer>
      )}

      {/* Mandatory Force Change Password Modal Overlay */}
      <ForceChangePasswordModal />
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
