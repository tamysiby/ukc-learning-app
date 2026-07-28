import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStoredLessons, saveStoredLessons, fetchLessonsFromSupabase, updateLessonInDb } from '../services/lessonRegistry';
import { toggleStudentLessonAssignment } from '../services/studentAdmin';
import UserAvatar from './UserAvatar';

export default function AdminLessonManagement() {
  const { users, updateStudentAssignedLessons } = useAuth();
  const [lessons, setLessons] = useState(getStoredLessons());

  useEffect(() => {
    fetchLessonsFromSupabase().then(res => {
      if (res.lessons) {
        setLessons(res.lessons);
      }
    });
  }, []);

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Modal states
  const [selectedLessonForAssign, setSelectedLessonForAssign] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  // New word form state inside edit modal
  const [newWordInput, setNewWordInput] = useState({ korean: '', romanization: '', english: '' });
  const [lessonDbError, setLessonDbError] = useState('');

  const studentUsers = users.filter(u => u.role === 'Student');

  const refreshLessons = () => {
    fetchLessonsFromSupabase().then(res => {
      if (res.error) {
        setLessonDbError(res.error);
      } else if (res.lessons) {
        setLessonDbError('');
        setLessons(res.lessons);
      } else {
        setLessons(getStoredLessons());
      }
    });
  };

  // Drag & Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...lessons];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    // Re-assign order based on new position
    const reorderedLessons = updated.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    setLessons(reorderedLessons);
    saveStoredLessons(reorderedLessons);
    setDraggedIndex(null);

    // Persist reordered lessons to Supabase DB
    for (const l of reorderedLessons) {
      await updateLessonInDb(l);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Check if a student has a specific lesson assigned
  const isLessonAssignedToStudent = (student, lessonId) => {
    const assigned = student.assignedLessonIds || ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-consonants-quiz-1'];
    return assigned.includes(lessonId);
  };

  // Toggle student assignment for selected lesson
  const toggleStudentLesson = (student, lessonId) => {
    const updatedAssigned = toggleStudentLessonAssignment(student, lessonId);
    updateStudentAssignedLessons(student.id, updatedAssigned);
  };

  // Open Edit Lesson Configuration Modal
  const handleOpenEditLesson = (lesson) => {
    setEditingLesson({
      ...lesson,
      title: lesson.title || '',
      type: lesson.type || 'vocab',
      words: lesson.words ? [...lesson.words] : []
    });
    setNewWordInput({ korean: '', romanization: '', english: '' });
  };

  // Save Configured Lesson
  const handleSaveLessonConfig = async (e) => {
    e.preventDefault();
    if (!editingLesson) return;

    const targetLesson = {
      ...editingLesson,
      title: editingLesson.title.trim(),
      type: editingLesson.type,
      words: (editingLesson.type === 'vocab' || editingLesson.type === 'vocab quiz') ? editingLesson.words : []
    };

    const currentList = getStoredLessons();
    const updatedList = currentList.map(l => l.id === targetLesson.id ? targetLesson : l);

    saveStoredLessons(updatedList);
    setLessons(updatedList);
    setEditingLesson(null);

    // Persist changes directly to Supabase DB
    await updateLessonInDb(targetLesson);
  };

  // Add word to word list inside edit modal
  const handleAddWordItem = () => {
    if (!newWordInput.korean.trim() || !newWordInput.english.trim()) return;

    const newWord = {
      id: `w-${Date.now()}`,
      korean: newWordInput.korean.trim(),
      romanization: newWordInput.romanization.trim(),
      english: newWordInput.english.trim(),
      category: editingLesson.type === 'vocab' ? 'Vocab' : 'Quiz'
    };

    setEditingLesson({
      ...editingLesson,
      words: [...(editingLesson.words || []), newWord]
    });

    setNewWordInput({ korean: '', romanization: '', english: '' });
  };

  // Remove word item
  const handleRemoveWordItem = (wordId) => {
    setEditingLesson({
      ...editingLesson,
      words: (editingLesson.words || []).filter(w => w.id !== wordId)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Info Card */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-tertiary-container/30 text-tertiary text-xs font-bold rounded-full">
            Admin Management Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-headline mt-2">
            Lesson Management
          </h1>
          <p className="text-xs sm:text-sm text-outline mt-1 font-label">
            Drag and drop rows below to reorder lessons, configure titles, and manage student access.
          </p>
        </div>
      </div>

      {/* Database Error Surface */}
      {lessonDbError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl shrink-0">error</span>
            <div>
              <span className="font-bold">Database Error: </span>
              <span>{lessonDbError}</span>
            </div>
          </div>
          <button
            onClick={refreshLessons}
            className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* MOBILE CARD VIEW */}
      <div className="block md:hidden space-y-3">
        {lessons.map((lesson, index) => {
          const assignedStudentsCount = studentUsers.filter(s => isLessonAssignedToStudent(s, lesson.id)).length;
          const isDragging = draggedIndex === index;

          return (
            <div
              key={lesson.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-surface-container-lowest p-4 rounded-2xl border transition-all space-y-3 ${
                isDragging ? 'opacity-40 border-2 border-dashed border-primary' : 'border-outline-variant shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline cursor-grab active:cursor-grabbing select-none text-lg">
                    drag_indicator
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      lesson.type === 'vocab'
                        ? 'bg-primary-fixed/60 text-primary'
                        : lesson.type === 'vocab quiz'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-tertiary-container/30 text-tertiary'
                    }`}
                  >
                    {lesson.type}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-on-surface">{lesson.title}</h3>
                {(lesson.type === 'vocab' || lesson.type === 'vocab quiz') && (
                  <p className="text-xs text-outline mt-0.5 font-mono">
                    {lesson.words?.length || 0} Words Configured
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-outline-variant/60 flex items-center justify-between gap-2">
                <span className="text-xs text-on-surface font-medium">
                  Assigned: <strong>{assignedStudentsCount}</strong> / {studentUsers.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditLesson(lesson)}
                    className="px-2.5 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setSelectedLessonForAssign(lesson)}
                    className="px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">manage_accounts</span>
                    <span>Access</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE VIEW WITH DRAG & DROP REORDERING */}
      <div className="hidden md:block bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface">
            <thead className="bg-surface-container-low text-xs uppercase tracking-wider text-outline font-semibold border-b border-outline-variant">
              <tr>
                <th className="px-4 py-4 w-12 text-center">Drag</th>
                <th className="px-6 py-4">Lesson Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Student Access</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {lessons.map((lesson, index) => {
                const assignedStudentsCount = studentUsers.filter(s => isLessonAssignedToStudent(s, lesson.id)).length;
                const isDragging = draggedIndex === index;

                return (
                  <tr
                    key={lesson.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`transition-colors ${
                      isDragging
                        ? 'bg-primary/10 opacity-40 border-2 border-dashed border-primary'
                        : 'hover:bg-surface-container-low/40'
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-center cursor-grab active:cursor-grabbing select-none">
                      <span className="material-symbols-outlined text-outline hover:text-primary transition-colors text-xl">
                        drag_indicator
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-on-surface">{lesson.title}</p>
                        {(lesson.type === 'vocab' || lesson.type === 'vocab quiz') && (
                          <p className="text-xs text-outline font-mono mt-0.5">
                            Word List: {lesson.words?.length || 0} words
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                          lesson.type === 'vocab'
                            ? 'bg-primary-fixed/60 text-primary'
                            : lesson.type === 'vocab quiz'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-tertiary-container/30 text-tertiary'
                        }`}
                      >
                        {lesson.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface">{assignedStudentsCount}</span>
                        <span className="text-xs text-outline">/ {studentUsers.length} Students</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditLesson(lesson)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs rounded-xl border border-outline-variant transition-all cursor-pointer"
                        title="Edit lesson name, type and words"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                        <span>Edit Config</span>
                      </button>
                      <button
                        onClick={() => setSelectedLessonForAssign(lesson)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-xl border border-primary/20 transition-all cursor-pointer"
                        title="Manage student access"
                      >
                        <span className="material-symbols-outlined text-base">manage_accounts</span>
                        <span>Student Access</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT LESSON CONFIGURATION MODAL */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between gap-3 border-b border-outline-variant/60 pb-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Configure Lesson</span>
                <h2 className="text-lg font-bold text-on-surface font-headline">{editingLesson.title}</h2>
              </div>
              <button onClick={() => setEditingLesson(null)} className="text-outline hover:text-on-surface cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveLessonConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Lesson Name</label>
                <input
                  type="text"
                  required
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Lesson Type</label>
                <select
                  value={editingLesson.type}
                  onChange={(e) => setEditingLesson({ ...editingLesson, type: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary capitalize font-medium"
                >
                  <option value="vocab">vocab</option>
                  <option value="vocab quiz">vocab quiz</option>
                  <option value="custom">custom</option>
                </select>
              </div>

              {/* WORD LIST SECTION (For vocab & vocab quiz types) */}
              {(editingLesson.type === 'vocab' || editingLesson.type === 'vocab quiz') && (
                <div className="pt-3 border-t border-outline-variant/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface font-headline">
                      Configured List of Words ({editingLesson.words?.length || 0})
                    </h4>
                  </div>

                  {/* Add Word Row Form */}
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/80 space-y-2">
                    <p className="text-[11px] font-bold text-outline uppercase">Add Word to List</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Korean (e.g. 오이)"
                        value={newWordInput.korean}
                        onChange={(e) => setNewWordInput({ ...newWordInput, korean: e.target.value })}
                        className="px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface"
                      />
                      <input
                        type="text"
                        placeholder="Romanization (e.g. O-i)"
                        value={newWordInput.romanization}
                        onChange={(e) => setNewWordInput({ ...newWordInput, romanization: e.target.value })}
                        className="px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface"
                      />
                      <input
                        type="text"
                        placeholder="English (e.g. Cucumber)"
                        value={newWordInput.english}
                        onChange={(e) => setNewWordInput({ ...newWordInput, english: e.target.value })}
                        className="px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddWordItem}
                        className="px-3 py-1 bg-primary text-on-primary font-bold text-xs rounded-lg hover:bg-primary-container cursor-pointer"
                      >
                        Add Word
                      </button>
                    </div>
                  </div>

                  {/* Words List Table */}
                  <div className="max-h-48 overflow-y-auto border border-outline-variant rounded-xl divide-y divide-outline-variant/60">
                    {(!editingLesson.words || editingLesson.words.length === 0) ? (
                      <p className="p-4 text-center text-xs text-outline">No words added yet.</p>
                    ) : (
                      editingLesson.words.map((w) => (
                        <div key={w.id} className="p-2.5 flex items-center justify-between bg-surface-container-lowest hover:bg-surface-container-low text-xs">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-on-surface text-sm">{w.korean}</span>
                            {w.romanization && (
                              <span className="font-mono text-[11px] text-primary bg-primary-fixed/40 px-1.5 py-0.5 rounded">
                                [{w.romanization}]
                              </span>
                            )}
                            <span className="text-on-surface-variant font-medium">{w.english}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveWordItem(w.id)}
                            className="p-1 text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            title="Delete word"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2 border border-outline-variant text-on-surface font-bold text-xs rounded-xl hover:bg-surface-container-low cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container shadow-xs cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE STUDENT ACCESS MODAL */}
      {selectedLessonForAssign && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3 border-b border-outline-variant/60 pb-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Lesson Access Assignment</span>
                <h2 className="text-lg font-bold text-on-surface font-headline mt-0.5">
                  {selectedLessonForAssign.title}
                </h2>
                <p className="text-xs text-outline">Toggle student access below.</p>
              </div>
              <button
                onClick={() => setSelectedLessonForAssign(null)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/60 border border-outline-variant rounded-2xl p-2 bg-surface-container-low/30 space-y-1">
              {studentUsers.map((student) => {
                const assigned = isLessonAssignedToStudent(student, selectedLessonForAssign.id);

                return (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={student.name} size="sm" />
                      <div>
                        <p className="font-bold text-xs text-on-surface">{student.name}</p>
                        <p className="text-[11px] text-outline">{student.username}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleStudentLesson(student, selectedLessonForAssign.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                        assigned
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-surface-container-high text-outline hover:bg-surface-container-highest'
                      }`}
                    >
                      {assigned ? 'Accessible ✓' : 'Hidden'}
                    </button>
                  </div>
                );
              })}
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
    </div>
  );
}
