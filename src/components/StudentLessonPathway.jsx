import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentPathwayNodes } from '../services/lessonRegistry';

export default function StudentLessonPathway({ onStartVocabLesson }) {
  const { currentUser } = useAuth();
  const nodeRefs = useRef({});

  const assignedLessonIds = currentUser?.assignedLessonIds || ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-batchim-1'];
  const completedLessonIds = currentUser?.completedLessonIds || [];

  const pathwayNodes = getStudentPathwayNodes(assignedLessonIds, completedLessonIds);

  const totalLessons = pathwayNodes.length;
  const completedCount = pathwayNodes.filter(n => completedLessonIds.includes(n.id)).length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Topmost incomplete lesson
  const topmostIncompleteLesson = pathwayNodes.find(n => !completedLessonIds.includes(n.id));

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
    onStartVocabLesson(lesson.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6 font-body">
      {/* Top Sticky Header Card with Visual Progress Bar */}
      <div className="sticky top-2 sm:top-4 z-40 bg-surface-container-lowest/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-outline-variant/80 shadow-md space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">insights</span>
            <span className="text-xs sm:text-sm font-extrabold text-on-surface font-headline uppercase tracking-wider">
              Course Progress
            </span>
          </div>
          <span className="text-xs font-bold text-outline font-label">
            {progressPercentage}%
          </span>
        </div>

        {/* Visual Progress Bar (Clickable to scroll to topmost incomplete lesson) */}
        <div
          onClick={handleProgressBarClick}
          className={`w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden border border-outline-variant/40 transition-all ${
            progressPercentage < 100 ? 'cursor-pointer hover:ring-2 hover:ring-primary/40' : ''
          }`}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          title={progressPercentage < 100 ? "Click to scroll to topmost unfinished lesson" : "100% Completed!"}
        >
          <div
            className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Dynamic Visual Roadmap Pathway */}
      <div className="relative flex flex-col items-center space-y-12">
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
                className={`relative z-10 flex flex-col items-center space-y-3 group ${
                  isTopLesson ? 'pb-6' : 'py-6'
                } transition-all duration-300`}
              >
                {/* Node Icon */}
                {isCompleted ? (
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-4 ring-emerald-100 transition-transform group-hover:scale-105">
                    <span className="material-symbols-outlined text-3xl font-bold">check</span>
                  </div>
                ) : (
                  <div
                    className={`rounded-full flex items-center justify-center transition-all group-hover:scale-105 ${
                      isCurrentTopIncomplete
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
                  className={`text-center bg-surface-container-lowest px-6 py-4 rounded-2xl border shadow-md space-y-3 min-w-[260px] max-w-sm transition-all duration-300 ${
                    isHighlighted
                      ? 'border-2 border-amber-500 ring-4 ring-amber-500/20 scale-105'
                      : isCurrentTopIncomplete
                      ? 'border-2 border-primary shadow-lg'
                      : 'border-outline-variant'
                  }`}
                >
                  <div>
                    {isCompleted && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md uppercase">
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
                    className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      isCompleted
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
