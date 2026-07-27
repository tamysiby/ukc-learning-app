import React, { useRef, useState, useEffect } from 'react';
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

  // Track progress increase animation on completion
  const prevCompletedCountRef = useRef(completedCount);
  const [isAnimatingProgress, setIsAnimatingProgress] = useState(false);

  useEffect(() => {
    if (completedCount > prevCompletedCountRef.current) {
      setIsAnimatingProgress(true);
      const timer = setTimeout(() => setIsAnimatingProgress(false), 3000);
      prevCompletedCountRef.current = completedCount;
      return () => clearTimeout(timer);
    }
    prevCompletedCountRef.current = completedCount;
  }, [completedCount]);

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

  // SVG Ring dimensions for 100px (r=32, viewBox 0 0 80 80)
  const strokeDasharray = 201.06;
  const strokeDashoffset = strokeDasharray - (progressPercentage / 100) * strokeDasharray;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 font-body relative">
      {/* Large Floating Green Circular Progress Bar Widget (Fixed at bottom-right) */}
      <div
        onClick={handleProgressBarClick}
        className={`fixed bottom-6 right-6 z-50 bg-surface-container-lowest text-on-surface border-2 border-emerald-500/70 rounded-full p-3 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-500 ${
          isAnimatingProgress
            ? 'scale-125 ring-8 ring-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.6)] animate-bounce'
            : progressPercentage < 100
            ? 'cursor-pointer hover:scale-110 hover:border-emerald-500 hover:ring-4 hover:ring-emerald-500/30'
            : 'cursor-default border-emerald-500'
        }`}
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        title={progressPercentage < 100 ? "Click to scroll to topmost unfinished lesson" : "100% Course Completed!"}
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            {/* Background Track Circle */}
            <circle
              cx="40"
              cy="40"
              r="32"
              className="text-surface-container-high stroke-current"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Vibrant Green Progress Ring */}
            <circle
              cx="40"
              cy="40"
              r="32"
              className="text-emerald-500 stroke-current transition-all duration-1200 ease-out"
              strokeWidth="6"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* Center Content with Large Font */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {progressPercentage >= 100 ? (
              <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-3xl font-extrabold">workspace_premium</span>
            ) : (
              <span className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-headline leading-none">
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
                      ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/20 scale-105'
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
