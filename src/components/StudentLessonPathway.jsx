import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentPathwayNodes } from '../services/lessonRegistry';

export default function StudentLessonPathway({ onStartHangulLesson, onStartVocabLesson }) {
  const { currentUser } = useAuth();

  const assignedLessonIds = currentUser?.assignedLessonIds || ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-custom-1'];
  const completedLessonIds = currentUser?.completedLessonIds || [];

  const pathwayNodes = getStudentPathwayNodes(assignedLessonIds, completedLessonIds);

  const handleLaunchLesson = (lesson) => {
    if (lesson.type === 'custom') {
      onStartHangulLesson();
    } else {
      onStartVocabLesson(lesson.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
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
            const isCompleted = lesson.nodeStatus === 'completed';
            const isActive = lesson.nodeStatus === 'active';
            const isLocked = lesson.nodeStatus === 'locked';
            const isTopLesson = index === 0;

            return (
              <div
                key={lesson.id}
                className={`relative z-10 flex flex-col items-center space-y-3 group ${isTopLesson ? 'pb-6' : 'py-6'
                  } ${isLocked ? 'opacity-70' : ''}`}
              >
                {/* Node Icon */}
                {isCompleted && (
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-4 ring-emerald-100 transition-transform group-hover:scale-105">
                    <span className="material-symbols-outlined text-3xl font-bold">check</span>
                  </div>
                )}

                {isActive && (
                  <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg ring-8 ring-primary/20 transition-transform group-hover:scale-105 animate-pulse">
                    <span className="material-symbols-outlined text-4xl">
                      {lesson.type === 'custom' ? 'menu_book' : lesson.type === 'vocab quiz' ? 'quiz' : 'style'}
                    </span>
                  </div>
                )}

                {isLocked && (
                  <div className="w-14 h-14 rounded-full bg-surface-container-high text-outline flex items-center justify-center border border-outline-variant">
                    <span className="material-symbols-outlined text-2xl">lock</span>
                  </div>
                )}

                {/* Node Card Box */}
                <div
                  className={`text-center bg-surface-container-lowest px-6 py-4 rounded-2xl border shadow-md space-y-3 min-w-[260px] max-w-sm ${isActive ? 'border-2 border-primary shadow-lg' : 'border-outline-variant'
                    }`}
                >
                  <div>
                    {isCompleted && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md uppercase">
                        Completed
                      </span>
                    )}
                    {isActive && (
                      <span className="px-2 py-0.5 bg-primary-fixed/60 text-primary text-[10px] font-bold rounded-md uppercase">
                        Current Lesson ▶
                      </span>
                    )}
                    {isLocked && (
                      <span className="px-2 py-0.5 bg-surface-container text-outline text-[10px] font-bold rounded-md uppercase">
                        Locked 🔒
                      </span>
                    )}

                    <h3 className="text-base font-bold text-on-surface font-headline mt-1">{lesson.title}</h3>
                  </div>

                  {!isLocked && (
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
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
