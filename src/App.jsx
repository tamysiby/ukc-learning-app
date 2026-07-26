import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import AdminUserManagement from './components/AdminUserManagement';
import AdminUserDetails from './components/AdminUserDetails';
import AdminLessonManagement from './components/AdminLessonManagement';
import StudentLessonPathway from './components/StudentLessonPathway';
import { HangulLesson, VocabLesson, VocabQuizLesson } from './lessons';
import VocabOverview from './components/VocabOverview';
import StudentAccount from './components/StudentAccount';
import UserAvatar from './components/UserAvatar';
import { getStoredLessons, DEFAULT_LESSONS } from './services/lessonRegistry';
import { generateRandomVocabQuiz } from './services/quizGenerator';

function AppContent() {
  const { currentUser, isAuthenticated, userRole, logout, loading, markLessonCompleted } = useAuth();
  
  // Tabs: 'pathway' | 'hangul' | 'vocab' | 'vocab-quiz' | 'account' (for Student) | 'admin-list' | 'admin-details' | 'admin-lessons' (for Admin)
  const [currentTab, setCurrentTab] = useState(userRole === 'Admin' ? 'admin-list' : 'pathway');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeVocabLesson, setActiveVocabLesson] = useState(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState([]);
  const [showFlashcardDeck, setShowFlashcardDeck] = useState(false);

  // Focus Mode when student is active inside a lesson or quiz
  const isLessonActive = userRole === 'Student' && (currentTab === 'vocab' || currentTab === 'vocab-quiz' || currentTab === 'hangul');

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

  const handleFinishHangulLesson = () => {
    markLessonCompleted(currentUser?.id, 'les-custom-1');
    setCurrentTab('pathway');
  };

  const handleStartVocabLesson = (lessonId = 'les-vowels-1') => {
    const allLessons = getStoredLessons();
    const target = allLessons.find(l => l.id === lessonId) || DEFAULT_LESSONS[0];
    setActiveVocabLesson(target);

    if (target.type === 'vocab') {
      // Vocab lessons are completed immediately upon opening
      markLessonCompleted(currentUser?.id, target.id);
      setShowFlashcardDeck(false);
      setCurrentTab('vocab');
    } else if (target.type === 'vocab quiz') {
      // Find paired vocab lesson to pool vocabulary words from
      const pairedVocab = allLessons.find(l => l.id === target.pairedVocabId) || DEFAULT_LESSONS[0];
      const poolWords = pairedVocab.words && pairedVocab.words.length > 0 ? pairedVocab.words : DEFAULT_LESSONS[0].words;

      // Dynamically generate a 10-question randomized quiz when student starts lesson
      const generatedQuiz = generateRandomVocabQuiz(poolWords);
      setActiveQuizQuestions(generatedQuiz);
      setCurrentTab('vocab-quiz');
    } else {
      setShowFlashcardDeck(false);
      setCurrentTab('vocab');
    }
  };

  const handleFinishVocabLesson = () => {
    if (activeVocabLesson) {
      markLessonCompleted(currentUser?.id, activeVocabLesson.id);
    }
    setCurrentTab('pathway');
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
                    onClick={() => setCurrentTab('pathway')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentTab === 'pathway' || currentTab === 'hangul' || currentTab === 'vocab' || currentTab === 'vocab-quiz'
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

              {/* Admin Navigation Links */}
              {userRole === 'Admin' && (
                <nav className="hidden md:flex items-center gap-1">
                  <button
                    onClick={() => setCurrentTab('admin-list')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentTab === 'admin-list' || currentTab === 'admin-details'
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">group</span>
                    User Management
                  </button>

                  <button
                    onClick={() => setCurrentTab('admin-lessons')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentTab === 'admin-lessons'
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
                  onClick={logout}
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
                onStartHangulLesson={() => setCurrentTab('hangul')}
                onStartVocabLesson={(lessonId) => handleStartVocabLesson(lessonId)}
              />
            )}
            {currentTab === 'hangul' && (
              <HangulLesson onFinishLesson={handleFinishHangulLesson} />
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
                onExitQuiz={() => setCurrentTab('pathway')}
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
                  setCurrentTab('admin-list');
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
                onClick={() => setCurrentTab('pathway')}
                className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors cursor-pointer ${
                  currentTab === 'pathway' || currentTab === 'hangul' || currentTab === 'vocab' || currentTab === 'vocab-quiz' ? 'text-primary' : 'text-outline'
                }`}
              >
                <span className="material-symbols-outlined text-xl">map</span>
                <span className="text-[10px] font-bold">Pathway</span>
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
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentTab('admin-list')}
                className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors cursor-pointer ${
                  currentTab === 'admin-list' || currentTab === 'admin-details' ? 'text-primary' : 'text-outline'
                }`}
              >
                <span className="material-symbols-outlined text-xl">group</span>
                <span className="text-[10px] font-bold">Users</span>
              </button>

              <button
                onClick={() => setCurrentTab('admin-lessons')}
                className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 transition-colors cursor-pointer ${
                  currentTab === 'admin-lessons' ? 'text-primary' : 'text-outline'
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
