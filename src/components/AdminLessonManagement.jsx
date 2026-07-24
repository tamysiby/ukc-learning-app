import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStoredLessons, saveStoredLessons } from '../services/lessonRegistry';
import UserAvatar from './UserAvatar';

export default function AdminLessonManagement() {
  const { users, updateStudentAssignedLessons } = useAuth();
  const [lessons, setLessons] = useState(getStoredLessons());

  // Modal states
  const [selectedLessonForAssign, setSelectedLessonForAssign] = useState(null);
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);

  const [newLessonData, setNewLessonData] = useState({
    title: '',
    unit: 'Unit 1: Hangul & Korean Basics',
    description: '',
    type: 'vocab',
    status: 'Active'
  });

  const refreshLessons = () => {
    setLessons(getStoredLessons());
  };

  const studentUsers = users.filter(u => u.role === 'Student');

  // Check if a student has a specific lesson assigned
  const isLessonAssignedToStudent = (student, lessonId) => {
    const assigned = student.assignedLessonIds || ['les-hangul-1', 'les-vocab-1'];
    return assigned.includes(lessonId);
  };

  // Toggle student assignment for selected lesson
  const toggleStudentLesson = (student, lessonId) => {
    const currentAssigned = student.assignedLessonIds || ['les-hangul-1', 'les-vocab-1'];
    let updatedAssigned;
    if (currentAssigned.includes(lessonId)) {
      updatedAssigned = currentAssigned.filter(id => id !== lessonId);
    } else {
      updatedAssigned = [...currentAssigned, lessonId];
    }
    updateStudentAssignedLessons(student.id, updatedAssigned);
  };

  // Create new lesson
  const handleCreateLessonSubmit = (e) => {
    e.preventDefault();
    if (!newLessonData.title) return;

    const currentLessons = getStoredLessons();
    const createdLesson = {
      id: `les-custom-${Date.now()}`,
      order: currentLessons.length + 1,
      unit: newLessonData.unit,
      title: newLessonData.title.trim(),
      description: newLessonData.description.trim() || 'Custom practice lesson created by Administrator.',
      type: newLessonData.type,
      status: newLessonData.status
    };

    const updatedList = [...currentLessons, createdLesson];
    saveStoredLessons(updatedList);
    refreshLessons();
    setIsAddLessonModalOpen(false);
    setNewLessonData({ title: '', unit: 'Unit 1: Hangul & Korean Basics', description: '', type: 'vocab', status: 'Active' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-headline">
            Lesson Management
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-label">
            Admin Portal • Manage platform lesson catalog and assign accessible lessons to students.
          </p>
        </div>

        <button
          onClick={() => setIsAddLessonModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-on-primary font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:bg-primary-container transition-colors gap-2 min-h-[44px] cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add_box</span>
          Create New Lesson
        </button>
      </div>

      {/* Lesson Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lessons.map((lesson) => {
          const assignedStudentsCount = studentUsers.filter(s => isLessonAssignedToStudent(s, lesson.id)).length;

          return (
            <div
              key={lesson.id}
              className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl border border-outline-variant shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 bg-primary-fixed/60 text-primary text-[10px] font-bold rounded-full uppercase">
                    {lesson.unit}
                  </span>
                  <span className="text-xs font-mono font-bold text-outline">Order #{lesson.order}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-on-surface font-headline">{lesson.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{lesson.description}</p>
              </div>

              <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-base text-primary">groups</span>
                  <span>Assigned to <strong>{assignedStudentsCount}</strong> / {studentUsers.length} Students</span>
                </div>

                <button
                  onClick={() => setSelectedLessonForAssign(lesson)}
                  className="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-primary font-bold text-xs rounded-xl border border-outline-variant transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">manage_accounts</span>
                  <span>Manage Student Access</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MANAGE STUDENT ACCESS MODAL */}
      {selectedLessonForAssign && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Lesson Access Assignment</span>
                <h2 className="text-lg font-bold text-on-surface font-headline mt-0.5">
                  {selectedLessonForAssign.title}
                </h2>
                <p className="text-xs text-on-surface-variant">Check students below to grant access to this lesson.</p>
              </div>
              <button
                onClick={() => setSelectedLessonForAssign(null)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/60 border border-outline-variant rounded-2xl p-2 bg-surface-container-low/30 space-y-1">
              {studentUsers.length === 0 ? (
                <p className="p-4 text-center text-xs text-outline">No student accounts found.</p>
              ) : (
                studentUsers.map((student) => {
                  const assigned = isLessonAssignedToStudent(student, selectedLessonForAssign.id);

                  return (
                    <label
                      key={student.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <UserAvatar size="sm" />
                        <div>
                          <p className="font-bold text-xs text-on-surface">{student.name}</p>
                          <p className="text-[11px] text-on-surface-variant">{student.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          assigned ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-outline'
                        }`}>
                          {assigned ? 'Assigned' : 'Unassigned'}
                        </span>
                        <input
                          type="checkbox"
                          checked={assigned}
                          onChange={() => toggleStudentLesson(student, selectedLessonForAssign.id)}
                          className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer"
                        />
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLessonForAssign(null)}
                className="px-5 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW LESSON MODAL */}
      {isAddLessonModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-on-surface font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_box</span>
                Create Platform Lesson
              </h2>
              <button onClick={() => setIsAddLessonModalOpen(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateLessonSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1 font-label">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={newLessonData.title}
                  onChange={(e) => setNewLessonData({ ...newLessonData, title: e.target.value })}
                  placeholder="e.g. Lesson 3: Advanced Conversation"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1 font-label">Unit Name</label>
                <input
                  type="text"
                  required
                  value={newLessonData.unit}
                  onChange={(e) => setNewLessonData({ ...newLessonData, unit: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1 font-label">Description</label>
                <textarea
                  rows={3}
                  value={newLessonData.description}
                  onChange={(e) => setNewLessonData({ ...newLessonData, description: e.target.value })}
                  placeholder="Describe the topics covered in this lesson..."
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddLessonModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-low cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container shadow-xs cursor-pointer"
                >
                  Create Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
