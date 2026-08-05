import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
import { getStudentProgressStats, getStudentActivityLogs } from '../services/studentAdmin';

export default function AdminUserDetails({ user, onBack }) {
  const { lessons, updateStudentAssignedLessons, toggleStudentLessonCompletion, toggleUserStatus } = useAuth();
  const [lessonFilter, setLessonFilter] = useState('all');

  if (!user) return null;

  const assigned = user.assignedLessonIds || [];
  const completedIds = user.completedLessonIds || [];
  const { assignedCount, completedCount, percentage } = getStudentProgressStats(user);
  const activityLogs = getStudentActivityLogs(user, lessons);

  const handleToggleLesson = (lessonId) => {
    let updated;
    if (assigned.includes(lessonId)) {
      updated = assigned.filter(id => id !== lessonId);
    } else {
      updated = [...assigned, lessonId];
    }
    updateStudentAssignedLessons(user.id, updated);
  };

  const handleToggleCompletion = (lessonId) => {
    if (toggleStudentLessonCompletion && user?.id) {
      toggleStudentLessonCompletion(user.id, lessonId);
    }
  };

  const handleToggleStatus = () => {
    if (toggleUserStatus && user?.id) {
      toggleUserStatus(user.id);
    }
  };

  const filteredLessons = lessons.filter((lesson) => {
    const isAssigned = assigned.includes(lesson.id);
    const isCompleted = completedIds.includes(lesson.id);
    if (lessonFilter === 'completed') return isCompleted;
    if (lessonFilter === 'incomplete') return !isCompleted;
    if (lessonFilter === 'assigned') return isAssigned;
    return true;
  });

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

        {/* Quick stat cards */}
        <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-outline-variant pt-4 md:pt-0 md:pl-6 flex-wrap sm:flex-nowrap">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-outline font-semibold">Lessons Completed</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-headline">
              {completedCount} / {assignedCount}
            </p>
            <div className="w-24 bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1.5 mx-auto">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
            </div>
          </div>
          <div className="text-center border-l border-outline-variant pl-4 sm:pl-6">
            <p className="text-xs uppercase tracking-wider text-outline font-semibold">Study Streak</p>
            <p className="text-2xl font-black text-secondary mt-1 font-headline">{user.streak || 0} Days</p>
          </div>
          <div className="text-center border-l border-outline-variant pl-4 sm:pl-6">
            <p className="text-xs uppercase tracking-wider text-outline font-semibold">Last Active</p>
            <p className="text-xs font-semibold text-on-surface mt-2">{user.lastActive || 'Never'}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Lesson Assignments & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Lesson Access & Completion Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lessons & Access Section */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-on-surface font-headline flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">auto_stories</span>
                  Student Lessons & Completion Status
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  View completed lessons, track progress, or assign/unassign pathway content.
                </p>
              </div>
              <span className="text-xs text-outline font-medium shrink-0">
                {completedCount} Completed • {assigned.length} Assigned
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-outline-variant/60">
              {[
                { id: 'all', label: `All (${lessons.length})` },
                { id: 'completed', label: `Completed (${completedCount})` },
                { id: 'incomplete', label: `Incomplete (${lessons.length - completedCount})` },
                { id: 'assigned', label: `Assigned (${assignedCount})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setLessonFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    lessonFilter === tab.id
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="divide-y divide-outline-variant/60 border border-outline-variant rounded-2xl overflow-hidden">
              {filteredLessons.length > 0 ? (
                filteredLessons.map((lesson) => {
                  const isAssigned = assigned.includes(lesson.id);
                  const isCompleted = completedIds.includes(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-primary-fixed/60 text-primary text-[10px] font-bold rounded-md uppercase">
                            {lesson.unit}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-on-surface">{lesson.title}</h4>
                        </div>
                        <p className="text-xs text-on-surface-variant line-clamp-1">{lesson.description}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        {/* Completion Badge & Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleCompletion(lesson.id)}
                          title={isCompleted ? "Click to mark as not completed" : "Click to mark as completed"}
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-surface-container text-outline border-outline-variant/60 hover:bg-surface-container-high'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {isCompleted ? 'check_circle' : 'circle'}
                          </span>
                          {isCompleted ? 'Completed' : 'Mark Completed'}
                        </button>

                        {/* Assignment Badge & Checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAssigned ? 'bg-primary-fixed/60 text-primary' : 'bg-surface-container text-outline'
                          }`}>
                            {isAssigned ? 'Assigned' : 'Hidden'}
                          </span>
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={() => handleToggleLesson(lesson.id)}
                            className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-outline py-8 text-center">
                  No lessons match the selected filter ({lessonFilter}).
                </p>
              )}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                Recent Activity Log
              </h2>
              <span className="text-xs text-outline">
                {activityLogs.length} {activityLogs.length === 1 ? 'Event' : 'Events'}
              </span>
            </div>

            {activityLogs.length > 0 ? (
              <ul className="divide-y divide-outline-variant/60 text-sm text-on-surface">
                {activityLogs.map((log) => (
                  <li key={log.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.badgeClass || 'text-primary bg-primary/10'}`}>
                        <span className="material-symbols-outlined text-base">{log.icon || 'history'}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface text-xs sm:text-sm">{log.title}</p>
                        <p className="text-xs text-outline font-mono">{log.detail}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-on-surface-variant shrink-0">{log.time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-outline py-4 text-center">
                No recent activity recorded for this student.
              </p>
            )}
          </div>
        </div>

        {/* Right Col: Admin Controls */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-xs space-y-4">
            <h3 className="text-md font-bold text-on-surface font-headline">Admin Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleToggleStatus}
                className={`w-full text-left px-4 py-3 border rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  user.status === 'Active'
                    ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800'
                    : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                }`}
              >
                <span>{user.status === 'Active' ? 'Deactivate Student Account' : 'Reactivate Student Account'}</span>
                <span className="material-symbols-outlined text-base">
                  {user.status === 'Active' ? 'block' : 'check_circle'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
