import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentPathway } from '../services/lessonRegistry';

export default function StudentLessonPathway({ onStartVocabLesson }) {
  const { currentUser, authError, lessons, lessonsError, loadingLessons, refreshUsersList, refreshLessonsList } = useAuth();
  const nodeRefs = useRef({});

  const assignedLessonIds = currentUser?.assignedLessonIds || [];
  const completedLessonIds = currentUser?.completedLessonIds || [];

  const {
    nodes: pathwayNodes,
    progressPercentage,
    topmostIncompleteLesson
  } = getStudentPathway(assignedLessonIds, completedLessonIds, lessons);

  // Track previous progress from sessionStorage to animate progress bar & number count-up on return
  const [displayedBarPercentage, setDisplayedBarPercentage] = useState(() => {
    const saved = sessionStorage.getItem('ukc_pathway_prev_percentage');
    const numSaved = saved !== null ? Number(saved) : progressPercentage;
    return numSaved < progressPercentage ? numSaved : progressPercentage;
  });

  const [displayedTextPercentage, setDisplayedTextPercentage] = useState(() => {
    const saved = sessionStorage.getItem('ukc_pathway_prev_percentage');
    const numSaved = saved !== null ? Number(saved) : progressPercentage;
    return numSaved < progressPercentage ? numSaved : progressPercentage;
  });

  const [isAnimatingProgress, setIsAnimatingProgress] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('ukc_pathway_prev_percentage');
    const startPct = saved !== null ? Number(saved) : progressPercentage;

    if (startPct < progressPercentage) {
      setIsAnimatingProgress(true);

      const timer = setTimeout(() => {
        setDisplayedBarPercentage(progressPercentage);
      }, 100);

      const duration = 1200;
      const steps = Math.max(1, progressPercentage - startPct);
      const stepTime = Math.max(20, Math.floor(duration / steps));
      let current = startPct;

      const countInterval = setInterval(() => {
        current += 1;
        if (current >= progressPercentage) {
          setDisplayedTextPercentage(progressPercentage);
          clearInterval(countInterval);
        } else {
          setDisplayedTextPercentage(current);
        }
      }, stepTime);

      const endTimer = setTimeout(() => {
        setIsAnimatingProgress(false);
        sessionStorage.setItem('ukc_pathway_prev_percentage', String(progressPercentage));
      }, duration + 500);

      return () => {
        clearTimeout(timer);
        clearInterval(countInterval);
        clearTimeout(endTimer);
      };
    } else {
      sessionStorage.setItem('ukc_pathway_prev_percentage', String(progressPercentage));
      setDisplayedBarPercentage(progressPercentage);
      setDisplayedTextPercentage(progressPercentage);
    }
  }, [progressPercentage]);

  // Auto scroll to the last exited/started lesson when returning to pathway
  useEffect(() => {
    const lastActiveId = sessionStorage.getItem('ukc_last_active_lesson_id');
    if (lastActiveId) {
      const timer = setTimeout(() => {
        const el = nodeRefs.current[lastActiveId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedId(lastActiveId);
          setTimeout(() => setHighlightedId(null), 2000);
        }
        sessionStorage.removeItem('ukc_last_active_lesson_id');
      }, 200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (loadingLessons || (!lessonsError && (!lessons || lessons.length === 0))) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs sm:text-sm font-bold text-outline font-label tracking-wide">Loading pathway lessons...</p>
      </div>
    );
  }

  if (lessonsError || (authError && lessons.length === 0)) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-4 shadow-sm animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-2xl">cloud_off</span>
        </div>
        <h3 className="text-lg font-bold text-rose-900 font-headline">Database Connection Error</h3>
        <p className="text-sm text-rose-700 font-medium font-body">
          {lessonsError || authError || 'Database Connection Error: Database is offline or non-configured.'}
        </p>
        <button
          onClick={() => {
            refreshLessonsList();
            refreshUsersList();
          }}
          className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const handleProgressBarClick = () => {
    if (progressPercentage >= 100 || !topmostIncompleteLesson) return;

    const el = nodeRefs.current[topmostIncompleteLesson.id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedId(topmostIncompleteLesson.id);
      setTimeout(() => setHighlightedId(null), 2000);
    }
  };

  const handleLaunchLesson = (lesson) => {
    sessionStorage.setItem('ukc_last_active_lesson_id', lesson.id);
    onStartVocabLesson(lesson.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8 font-body relative">
      {/* Database Error Surface */}
      {authError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl shrink-0">error</span>
            <div>
              <span className="font-bold">Database Connection Error: </span>
              <span>{authError}</span>
            </div>
          </div>
          <button
            onClick={refreshUsersList}
            className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Sleek Non-Overlapping Sticky Progress Header */}
      <div
        onClick={handleProgressBarClick}
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        title={progressPercentage < 100 ? "Click to jump to current lesson" : "100% Course Completed!"}
        className={`sticky top-20 z-30 bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant rounded-3xl p-4 sm:p-5 shadow-md transition-all duration-300 ${
          progressPercentage < 100 ? 'cursor-pointer hover:shadow-lg hover:border-emerald-500/50' : ''
        } ${isAnimatingProgress ? 'ring-4 ring-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : ''}`}
      >
        <div className="flex flex-row items-center justify-between gap-3">
          {/* Visual Progress Bar */}
          <div className="flex-1 min-w-0">
            <div className="h-4 w-full bg-surface-container-high rounded-full overflow-hidden p-0.5 border border-outline-variant/30 shadow-inner relative group">
              <div
                className={`h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)] ${
                  isAnimatingProgress ? 'animate-pulse' : ''
                }`}
                style={{ width: `${displayedBarPercentage}%` }}
              />
            </div>
          </div>

          {/* Progress Percentage Badge (Always on Right Side of Progress Bar) */}
          <div className="shrink-0 flex items-center">
            <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {displayedTextPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Visual Roadmap Pathway */}
      <div className="relative flex flex-col items-center space-y-12 pt-2">
        {/* Curving Pathway Background Line */}
        <div className="absolute top-10 bottom-10 w-1 bg-surface-container-high rounded-full z-0"></div>

        {pathwayNodes.length === 0 ? (
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant text-center space-y-2 z-10">
            <span className="material-symbols-outlined text-4xl text-outline">auto_stories</span>
            <h3 className="text-lg font-bold text-on-surface font-headline">No Assigned Lessons Available</h3>
            <p className="text-xs text-on-surface-variant">Your administrator has not assigned any lessons to your account yet.</p>
          </div>
        ) : (
          pathwayNodes.map((lesson, index) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const isCurrentTopIncomplete = topmostIncompleteLesson?.id === lesson.id;
            const isTopLesson = index === 0;
            const isHighlighted = highlightedId === lesson.id;
            const isQuiz = lesson.type === 'vocab quiz';

            return (
              <div
                key={lesson.id}
                ref={(el) => (nodeRefs.current[lesson.id] = el)}
                className={`relative z-10 flex flex-col items-center space-y-3 group ${isTopLesson ? 'pb-6' : 'py-6'
                  } transition-all duration-300`}
              >
                {/* Node Icon Container: Diamond/Square shape for Quizzes, Round Circles for Study Lessons */}
                {isCompleted ? (
                  <div
                    className={`w-16 h-16 bg-emerald-600 text-white flex items-center justify-center shadow-md ring-4 ring-emerald-100 dark:ring-emerald-900/40 transition-transform group-hover:scale-105 ${
                      isQuiz ? 'rounded-2xl rotate-45' : 'rounded-full'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-3xl font-bold ${isQuiz ? '-rotate-45' : ''}`}>
                      check
                    </span>
                  </div>
                ) : (
                  <div
                    className={`flex items-center justify-center transition-all group-hover:scale-105 ${
                      isQuiz ? 'rounded-2xl rotate-45' : 'rounded-full'
                    } ${
                      isCurrentTopIncomplete
                        ? isQuiz
                          ? 'w-20 h-20 bg-amber-500 text-white shadow-lg ring-8 ring-amber-500/25 animate-pulse'
                          : 'w-20 h-20 bg-primary text-on-primary shadow-lg ring-8 ring-primary/20 animate-pulse'
                        : isQuiz
                          ? 'w-16 h-16 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-2 border-amber-500/40'
                          : 'w-16 h-16 bg-surface-container-highest text-on-surface border border-outline-variant'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-3xl ${isQuiz ? '-rotate-45 font-bold' : ''}`}>
                      {isQuiz ? 'quiz' : lesson.type === 'custom' ? 'menu_book' : 'style'}
                    </span>
                  </div>
                )}

                {/* Node Card Box */}
                <div
                  className={`text-center bg-surface-container-lowest px-6 py-4 rounded-2xl border shadow-md space-y-3 min-w-[260px] max-w-sm transition-all duration-300 ${isHighlighted
                    ? isCompleted
                      ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/20 scale-105 shadow-xl'
                      : isQuiz
                        ? 'border-2 border-amber-500 ring-4 ring-amber-500/20 scale-105 shadow-xl'
                        : 'border-2 border-primary ring-4 ring-primary/20 scale-105 shadow-xl'
                    : isCurrentTopIncomplete
                      ? isQuiz
                        ? 'border-2 border-amber-500 shadow-lg'
                        : 'border-2 border-primary shadow-lg'
                      : 'border-outline-variant'
                    }`}
                >
                  <div>
                    {isCompleted && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold rounded-md uppercase">
                        Completed
                      </span>
                    )}
                    {!isCompleted && isCurrentTopIncomplete && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase ${
                          isQuiz
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-primary-fixed/60 text-primary'
                        }`}
                      >
                        {isQuiz ? 'Current Quiz Challenge ▶' : 'Current Lesson ▶'}
                      </span>
                    )}

                    <h3 className="text-base font-bold text-on-surface font-headline mt-1">{lesson.title}</h3>
                  </div>

                  <button
                    onClick={() => handleLaunchLesson(lesson)}
                    className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      isCompleted
                        ? 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant'
                        : isQuiz
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-primary hover:bg-primary-container text-on-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isCompleted ? 'replay' : isQuiz ? 'quiz' : 'play_circle'}
                    </span>
                    <span>
                      {isCompleted
                        ? isQuiz ? 'Review Quiz' : 'Review Lesson'
                        : isQuiz ? 'Take Quiz' : 'Study Lesson'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

