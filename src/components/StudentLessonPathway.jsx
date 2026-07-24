import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentPathwayNodes } from '../services/lessonRegistry';

export default function StudentLessonPathway({ onStartHangulLesson, onStartVocabLesson }) {
  const { currentUser } = useAuth();

  const assignedLessonIds = currentUser?.assignedLessonIds || ['les-hangul-1', 'les-vocab-1'];
  const completedLessonIds = currentUser?.completedLessonIds || [];

  const pathwayNodes = getStudentPathwayNodes(assignedLessonIds, completedLessonIds);

  const handleLaunchLesson = (lesson) => {
    if (lesson.type === 'hangul') {
      onStartHangulLesson();
    } else {
      onStartVocabLesson();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Info Card */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed/60 text-primary rounded-full text-xs font-bold tracking-wide">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            KOREAN FOUNDATIONS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-headline">Unit 1: Hangul & Korean Basics</h1>
          <p className="text-sm text-on-surface-variant max-w-lg font-label">
            Master the Korean alphabet (한글), consonants, vowels, and how to form syllable blocks (음절).
          </p>
        </div>

        {/* Streak Counter Widget */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-100/60 p-4 rounded-2xl border border-amber-200/80 text-center min-w-36 space-y-1 shadow-xs">
          <div className="flex items-center justify-center gap-1 text-amber-600 font-bold">
            <span className="material-symbols-outlined fill-1 text-2xl">local_fire_department</span>
            <span className="text-2xl font-black font-headline">{currentUser?.streak || 14}</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Day Streak!</p>
        </div>
      </div>

      {/* Dynamic Visual Roadmap Pathway */}
      <div className="relative py-6 flex flex-col items-center space-y-12">
        {/* Curving Pathway Background Line */}
        <div className="absolute top-10 bottom-10 w-1 bg-surface-container-high rounded-full z-0"></div>

        {pathwayNodes.length === 0 ? (
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant text-center space-y-2 z-10">
            <span className="material-symbols-outlined text-4xl text-outline">auto_stories</span>
            <h3 className="text-lg font-bold text-on-surface font-headline">No Assigned Lessons Available</h3>
            <p className="text-xs text-on-surface-variant">Your administrator has not assigned any lessons to your account yet.</p>
          </div>
        ) : (
          pathwayNodes.map((lesson) => {
            const isCompleted = lesson.nodeStatus === 'completed';
            const isActive = lesson.nodeStatus === 'active';
            const isLocked = lesson.nodeStatus === 'locked';

            return (
              <div key={lesson.id} className={`relative z-10 flex flex-col items-center space-y-3 group ${isLocked ? 'opacity-70' : ''}`}>
                {/* Node Icon */}
                {isCompleted && (
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-4 ring-emerald-100 transition-transform group-hover:scale-105">
                    <span className="material-symbols-outlined text-3xl font-bold">check</span>
                  </div>
                )}

                {isActive && (
                  <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg ring-8 ring-primary/20 transition-transform group-hover:scale-105 animate-pulse">
                    <span className="material-symbols-outlined text-4xl">
                      {lesson.type === 'hangul' ? 'menu_book' : 'style'}
                    </span>
                  </div>
                )}

                {isLocked && (
                  <div className="w-14 h-14 rounded-full bg-surface-container-high text-outline flex items-center justify-center border border-outline-variant">
                    <span className="material-symbols-outlined text-2xl">lock</span>
                  </div>
                )}

                {/* Node Card Box */}
                <div className={`text-center bg-surface-container-lowest px-6 py-4 rounded-2xl border shadow-md space-y-3 max-w-sm ${
                  isActive ? 'border-2 border-primary shadow-lg' : 'border-outline-variant'
                }`}>
                  <div>
                    {isCompleted && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md uppercase">
                        Completed • 100% ✓
                      </span>
                    )}
                    {isActive && (
                      <span className="px-2 py-0.5 bg-primary-fixed/60 text-primary text-[10px] font-bold rounded-md uppercase">
                        Current Lesson ▶️
                      </span>
                    )}
                    {isLocked && (
                      <span className="px-2 py-0.5 bg-surface-container text-outline text-[10px] font-bold rounded-md uppercase">
                        Locked 🔒
                      </span>
                    )}

                    <h3 className="text-base font-bold text-on-surface font-headline mt-1">{lesson.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">{lesson.description}</p>
                  </div>

                  {!isLocked && (
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
