import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getStoredLessons } from '../services/lessonRegistry';
import UserAvatar from './UserAvatar';

export default function AdminUserDetails({ user, onBack }) {
  const { updateStudentAssignedLessons } = useAuth();
  if (!user) return null;

  const lessons = getStoredLessons();
  const assigned = user.assignedLessonIds || ['les-hangul-1', 'les-vocab-1'];

  const handleToggleLesson = (lessonId) => {
    let updated;
    if (assigned.includes(lessonId)) {
      updated = assigned.filter(id => id !== lessonId);
    } else {
      updated = [...assigned, lessonId];
    }
    updateStudentAssignedLessons(user.id, updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back navigation */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-container px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to User List
        </button>
      </div>

      {/* User Banner Header */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <UserAvatar size="xl" />
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface font-headline">{user.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                user.role === 'Admin' ? 'bg-tertiary-container/30 text-tertiary' : 'bg-primary-fixed/60 text-primary'
              }`}>
                {user.role}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {user.status}
              </span>
              {user.isOnline && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online Now
                </span>
              )}
            </div>
            <p className="text-sm text-on-surface-variant font-label">{user.username}</p>
            <p className="text-xs text-outline">Joined {user.joinedDate}</p>
          </div>
        </div>

        {/* Quick stat cards & Actions */}
        <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-outline-variant pt-4 md:pt-0 md:pl-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-outline font-semibold">Study Streak</p>
            <p className="text-2xl font-black text-secondary mt-1 font-headline">{user.streak || 0} Days</p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-outline font-semibold">Last Active</p>
            <p className="text-xs font-semibold text-on-surface mt-2">{user.lastActive || 'Never'}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Lesson Assignments & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Lesson Access Management & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Lessons Section */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_stories</span>
                Assigned Lessons & Access Control
              </h2>
              <span className="text-xs text-outline">
                {assigned.length} of {lessons.length} Lessons Assigned
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Check/uncheck lessons below to configure what this student can see on their learning pathway.
            </p>

            <div className="divide-y divide-outline-variant/60 border border-outline-variant rounded-2xl overflow-hidden">
              {lessons.map((lesson) => {
                const isAssigned = assigned.includes(lesson.id);

                return (
                  <label
                    key={lesson.id}
                    className="p-4 flex items-center justify-between bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-primary-fixed/60 text-primary text-[10px] font-bold rounded-md uppercase">
                          {lesson.unit}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-on-surface">{lesson.title}</h4>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-1">{lesson.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAssigned ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-outline'
                      }`}>
                        {isAssigned ? 'Assigned' : 'Hidden'}
                      </span>
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={() => handleToggleLesson(lesson.id)}
                        className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-on-surface font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Recent Activity Log
            </h2>
            <ul className="divide-y divide-outline-variant/60 text-sm text-on-surface">
              <li className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-on-surface">Completed Lesson 1: Introduction to Hangul</p>
                  <p className="text-xs text-outline font-mono">100% Score on Eumjeol Builder Quiz</p>
                </div>
                <span className="text-xs font-medium text-on-surface-variant">Today, 2:15 PM</span>
              </li>
              <li className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-on-surface">Practiced Vocab Flashcards</p>
                  <p className="text-xs text-outline font-mono">5 / 5 Words Mastered</p>
                </div>
                <span className="text-xs font-medium text-on-surface-variant">Yesterday, 4:40 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Col: Admin Controls */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-xs space-y-4">
            <h3 className="text-md font-bold text-on-surface font-headline">Admin Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center justify-between transition-colors cursor-pointer">
                <span>Deactivate Student Account</span>
                <span className="material-symbols-outlined text-base">block</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
