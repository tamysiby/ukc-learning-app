import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentPathway } from '../services/lessonRegistry';

export default function StudentLessonPathway({ onStartVocabLesson }) {
  const { currentUser } = useAuth();
  const nodeRefs = useRef({});

  const assignedLessonIds = currentUser?.assignedLessonIds || ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-batchim-1'];
  const completedLessonIds = currentUser?.completedLessonIds || [];

  const {
    nodes: pathwayNodes,
    progressPercentage,
    topmostIncompleteLesson
  } = getStudentPathway(assignedLessonIds, completedLessonIds);

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

  useEffect(() => {
    const saved = sessionStorage.getItem('ukc_pathway_prev_percentage');
    const startPct = saved !== null ? Number(saved) : progressPercentage;

    if (startPct < progressPercentage) {
      setIsAnimatingProgress(true);

      // Smooth transition for visual bar fill
      const barTimer = setTimeout(() => {
        setDisplayedBarPercentage(progressPercentage);
      }, 100);

      // Smooth count-up for percentage text badge
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
        clearTimeout(barTimer);
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


  const [highlightedId, setHighlightedId] = useState(null);

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

            return (
              <div
                key={lesson.id}
                ref={(el) => (nodeRefs.current[lesson.id] = el)}
                className={`relative z-10 flex flex-col items-center space-y-3 group ${isTopLesson ? 'pb-6' : 'py-6'
                  } transition-all duration-300`}
              >
                {/* Node Icon */}
                {isCompleted ? (
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-4 ring-emerald-100 dark:ring-emerald-900/40 transition-transform group-hover:scale-105">
                    <span className="material-symbols-outlined text-3xl font-bold">check</span>
                  </div>
                ) : (
                  <div
                    className={`rounded-full flex items-center justify-center transition-all group-hover:scale-105 ${isCurrentTopIncomplete
                      ? 'w-20 h-20 bg-primary text-on-primary shadow-lg ring-8 ring-primary/20 animate-pulse'
                      : 'w-16 h-16 bg-surface-container-highest text-on-surface border border-outline-variant'
                      }`}
                  >
                    <span className="material-symbols-outlined text-3xl">
                      {lesson.type === 'custom' ? 'menu_book' : lesson.type === 'vocab quiz' ? 'quiz' : 'style'}
                    </span>
                  </div>
                )}

                {/* Node Card Box */}
                <div
                  className={`text-center bg-surface-container-lowest px-6 py-4 rounded-2xl border shadow-md space-y-3 min-w-[260px] max-w-sm transition-all duration-300 ${isHighlighted
                    ? isCompleted
                      ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/20 scale-105 shadow-xl'
                      : 'border-2 border-primary ring-4 ring-primary/20 scale-105 shadow-xl'
                    : isCurrentTopIncomplete
                      ? 'border-2 border-primary shadow-lg'
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
                      <span className="px-2 py-0.5 bg-primary-fixed/60 text-primary text-[10px] font-bold rounded-md uppercase">
                        Current Lesson ▶
                      </span>
                    )}

                    <h3 className="text-base font-bold text-on-surface font-headline mt-1">{lesson.title}</h3>
                  </div>

                  <button
                    onClick={() => handleLaunchLesson(lesson)}
                    className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${isCompleted
                      ? 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant'
                      : 'bg-primary hover:bg-primary-container text-on-primary'
                      }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isCompleted ? 'replay' : 'play_circle'}
                    </span>
                    <span>{isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
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

