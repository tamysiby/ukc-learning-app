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

  const strokeDasharray = 138.23;
  const strokeDashoffset = strokeDasharray - (progressPercentage / 100) * strokeDasharray;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 font-body relative">
      {/* Floating Circular Progress Bar Widget (Fixed at bottom-right) */}
      <div
        onClick={handleProgressBarClick}
        className={`fixed bottom-6 right-6 z-50 bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/80 rounded-full p-2 shadow-2xl flex items-center justify-center transition-all duration-300 ${progressPercentage < 100
            ? 'cursor-pointer hover:scale-110 hover:shadow-primary/20 hover:border-primary/50'
            : 'cursor-default'
          }`}
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        title={progressPercentage < 100 ? "Click to scroll to topmost unfinished lesson" : "100% Completed!"}
      >
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 52 52">
            {/* Background Track Circle */}
            <circle
              cx="26"
              cy="26"
              r="22"
              className="text-surface-container-high stroke-current"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="26"
              cy="26"
              r="22"
              className="text-primary stroke-current transition-all duration-700 ease-out"
              strokeWidth="4"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {progressPercentage >= 100 ? (
              <span className="material-symbols-outlined text-emerald-600 text-xl font-bold">check_circle</span>
            ) : (
              <span className="text-[11px] font-extrabold text-on-surface font-headline leading-none">
                {progressPercentage}%
              </span>
            )}
          </div>
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
                className={`relative z-10 flex flex-col items-center space-y-3 group ${isTopLesson ? 'pb-6' : 'py-6'
                  } transition-all duration-300`}
              >
                {/* Node Icon */}
                {isCompleted ? (
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-4 ring-emerald-100 transition-transform group-hover:scale-105">
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
