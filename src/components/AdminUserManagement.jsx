import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  filterUsers,
  getStudentProgressStats,
  toggleAllStudentLessons,
  toggleStudentLessonAssignment
} from '../services/studentAdmin';
import UserAvatar from './UserAvatar';

export default function AdminUserManagement({ onSelectUser }) {
  const { users, lessons, createStudentUser, updateStudentUser, deleteStudentUser, adminResetPassword, toggleUserStatus, updateStudentAssignedLessons, toggleStudentLessonCompletion, currentUser, authError, refreshUsersList } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [resetPasswordInput, setResetPasswordInput] = useState('StudentPass123!');
  const [userForLessonsModal, setUserForLessonsModal] = useState(null);

  const availableLessons = lessons || [];

  const handleToggleSelectAllLessons = () => {
    if (!userForLessonsModal) return;
    const updatedAssignedIds = toggleAllStudentLessons(userForLessonsModal, availableLessons);

    updateStudentAssignedLessons(userForLessonsModal.id, updatedAssignedIds);

    setUserForLessonsModal({
      ...userForLessonsModal,
      assignedLessonIds: updatedAssignedIds
    });
  };

  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    password: 'StudentPass123!',
    role: 'Student',
    assignedLessonIds: ['les-vowels-1', 'les-vowels-quiz-1']
  });

  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [crudError, setCrudError] = useState('');

  // Filtering users
  const filteredUsers = filterUsers(users, { searchQuery, roleFilter, statusFilter });

  // Calculate student lesson progress stats
  const getUserProgressStats = (user) => getStudentProgressStats(user);

  // Toggle student lesson assignment
  const handleToggleStudentLesson = (user, lessonId) => {
    const updatedAssigned = toggleStudentLessonAssignment(user, lessonId);
    updateStudentAssignedLessons(user.id, updatedAssigned);
    setUserForLessonsModal({
      ...user,
      assignedLessonIds: updatedAssigned
    });
  };

  // Handle Add Student Submit
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setCrudError('');
    if (!newUser.name || !newUser.username) return;

    const res = await createStudentUser(newUser);
    if (!res.success) {
      setCrudError(res.error);
      return;
    }

    setNewUser({ name: '', username: '', password: 'StudentPass123!', role: 'Student' });
    setIsAddModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (user, e) => {
    e.stopPropagation();
    setEditingUser({ ...user });
    setCrudError('');
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const res = await updateStudentUser(editingUser.id, {
      name: editingUser.name,
      username: editingUser.username,
      role: editingUser.role,
      status: editingUser.status
    });

    if (!res.success) {
      setCrudError(res.error);
      return;
    }

    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  // Open Delete Modal
  const handleOpenDelete = (user, e) => {
    e.stopPropagation();
    setDeletingUser(user);
    setCrudError('');
    setIsDeleteModalOpen(true);
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    const res = await deleteStudentUser(deletingUser.id);
    if (!res.success) {
      setCrudError(res.error);
      return;
    }
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  // Open Reset Password Modal
  const handleOpenResetPassword = (user, e) => {
    e.stopPropagation();
    setResetPasswordUser(user);
    setResetPasswordInput('StudentPass123!');
    setCrudError('');
  };

  // Handle Reset Password Submit
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetPasswordUser || !resetPasswordInput) return;
    const res = await adminResetPassword(resetPasswordUser.id, resetPasswordInput);
    if (!res.success) {
      setCrudError(res.error);
      return;
    }
    setResetPasswordUser(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-headline">User Management</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-label">
            Admin Portal • Manage student accounts, available lessons, and learning progress.
          </p>
        </div>
        <button
          onClick={() => {
            setCrudError('');
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-on-primary font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:bg-primary-container transition-colors gap-2 min-h-[44px] cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>Register Student</span>
        </button>
      </div>

      {/* Database Error Surface */}
      {authError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl shrink-0">error</span>
            <div>
              <span className="font-bold">Database Error: </span>
              <span>{authError}</span>
            </div>
          </div>
          <button
            onClick={refreshUsersList}
            className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-3.5 sm:p-6 rounded-2xl border border-outline-variant shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name, username..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary min-h-[44px]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-outline">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs font-medium text-on-surface focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-outline">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs font-medium text-on-surface focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Online">🟢 Online Now</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="block md:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-surface-container-lowest p-6 text-center text-xs text-on-surface-variant rounded-2xl border border-outline-variant">
            No users found matching search filters.
          </div>
        ) : (
          filteredUsers.map((user) => {
            const stats = getUserProgressStats(user);

            return (
              <div key={user.id} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar size="md" />
                    <div>
                      <h3 className="font-bold text-sm text-on-surface">{user.name}</h3>
                      <p className="text-xs text-on-surface-variant">{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {user.isOnline && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Online
                      </span>
                    )}
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                    >
                      {user.status}
                    </button>
                  </div>
                </div>

                {user.role === 'Student' && (
                  <div className="p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/60 flex items-center justify-between text-xs">
                    <span className="font-semibold text-outline">Lesson Progress:</span>
                    <span className="font-extrabold text-primary font-mono">
                      {stats.completedCount} / {stats.assignedCount} ({stats.percentage}%)
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-outline-variant/60">
                  {user.role === 'Student' && (
                    <button
                      onClick={() => setUserForLessonsModal(user)}
                      className="py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      title="Manage available lessons for this student"
                    >
                      <span className="material-symbols-outlined text-sm">auto_stories</span>
                      Lessons
                    </button>
                  )}
                  <button
                    onClick={() => onSelectUser(user)}
                    className="py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    View
                  </button>
                  <button
                    onClick={(e) => handleOpenEdit(user, e)}
                    className="py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleOpenResetPassword(user, e)}
                    className="py-1.5 bg-tertiary/10 hover:bg-tertiary/20 text-tertiary font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    title="Reset user password"
                  >
                    <span className="material-symbols-outlined text-sm">key</span>
                    Reset
                  </button>
                  <button
                    onClick={(e) => handleOpenDelete(user, e)}
                    disabled={user.id === currentUser?.id}
                    className="py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-on-surface">
            <thead className="bg-surface-container-low text-xs uppercase tracking-wider text-outline font-semibold border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Progress (Completed / Available)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-on-surface-variant font-medium">
                    No users matching search filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const stats = getUserProgressStats(user);

                  return (
                    <tr key={user.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <UserAvatar size="md" />
                          <div>
                            <p className="font-semibold text-on-surface">{user.name}</p>
                            <p className="text-xs text-on-surface-variant">{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-tertiary-container/30 text-tertiary' : 'bg-primary-fixed/60 text-primary'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role === 'Student' ? (
                          <div className="space-y-1 max-w-[160px]">
                            <div className="flex justify-between text-xs font-mono font-bold">
                              <span className="text-on-surface">{stats.completedCount} / {stats.assignedCount} Lessons</span>
                              <span className="text-primary">{stats.percentage}%</span>
                            </div>
                            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full transition-all duration-300"
                                style={{ width: `${stats.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-outline">N/A (Admin)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {user.isOnline && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Online
                            </span>
                          )}
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${user.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            {user.status}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        {user.role === 'Student' && (
                          <button
                            onClick={() => setUserForLessonsModal(user)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 transition-all cursor-pointer"
                            title="Manage lessons available to this student"
                          >
                            <span className="material-symbols-outlined text-base">auto_stories</span>
                            <span>Lessons</span>
                          </button>
                        )}
                        <button
                          onClick={() => onSelectUser(user)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-container px-2.5 py-1.5 rounded-lg border border-primary/20 hover:border-primary/40 bg-primary/5 transition-all cursor-pointer"
                          title="View details"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </button>
                        <button
                          onClick={(e) => handleOpenEdit(user, e)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface hover:bg-surface-container-high px-2.5 py-1.5 rounded-lg border border-outline-variant transition-all cursor-pointer"
                          title="Edit user"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={(e) => handleOpenResetPassword(user, e)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-tertiary hover:bg-tertiary/10 px-2.5 py-1.5 rounded-lg border border-tertiary/20 transition-all cursor-pointer"
                          title="Reset Password"
                        >
                          <span className="material-symbols-outlined text-base">key</span>
                        </button>
                        <button
                          onClick={(e) => handleOpenDelete(user, e)}
                          disabled={user.id === currentUser?.id}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Delete user"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANAGE STUDENT AVAILABLE LESSONS MODAL */}
      {userForLessonsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Configure Student Lessons</span>
                <button
                  type="button"
                  onClick={handleToggleSelectAllLessons}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:bg-primary/10 px-2.5 py-1 rounded-xl border border-primary/20 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {availableLessons.length > 0 && availableLessons.every(l => (userForLessonsModal.assignedLessonIds || []).includes(l.id)) ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span>
                    {availableLessons.length > 0 && availableLessons.every(l => (userForLessonsModal.assignedLessonIds || []).includes(l.id)) ? 'Deselect All' : 'Select All'}
                  </span>
                </button>
              </div>

              <button
                onClick={() => setUserForLessonsModal(null)}
                className="text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/60 border border-outline-variant rounded-2xl p-2 bg-surface-container-low/30 space-y-1">
              {availableLessons.map((lesson) => {
                const assigned = (userForLessonsModal.assignedLessonIds || ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-consonants-quiz-1']).includes(lesson.id);
                const isCompleted = (userForLessonsModal.completedLessonIds || []).includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-on-surface">{lesson.title}</p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant uppercase">
                          {lesson.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={() => {
                          toggleStudentLessonCompletion(userForLessonsModal.id, lesson.id);
                          // Refresh current modal user object
                          const updatedUsers = getStoredUsers();
                          const updatedModalUser = updatedUsers.find(u => u.id === userForLessonsModal.id);
                          if (updatedModalUser) setUserForLessonsModal(updatedModalUser);
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${isCompleted
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-surface-container text-outline hover:bg-surface-container-high'
                          }`}
                        title={isCompleted ? 'Click to mark incomplete' : 'Click to mark completed'}
                      >
                        {isCompleted ? 'Completed ✓' : 'Mark Completed'}
                      </button>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${assigned ? 'bg-primary/10 text-primary' : 'bg-surface-container text-outline'}`}>
                          {assigned ? 'Available' : 'Hidden'}
                        </span>
                        <input
                          type="checkbox"
                          checked={assigned}
                          onChange={() => {
                            handleToggleStudentLesson(userForLessonsModal, lesson.id);
                            const updatedUsers = getStoredUsers();
                            const updatedModalUser = updatedUsers.find(u => u.id === userForLessonsModal.id);
                            if (updatedModalUser) setUserForLessonsModal(updatedModalUser);
                          }}
                          className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setUserForLessonsModal(null)}
                className="px-5 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE STUDENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant max-w-md w-full p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">person_add</span>
                <h2 className="text-lg sm:text-xl font-bold text-on-surface font-headline">Register Student Account</h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {crudError && (
              <div className="p-3 bg-rose-500/10 text-rose-700 text-xs rounded-xl border border-rose-500/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{crudError}</span>
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Initial Password</label>
                <input
                  type="text"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="StudentPass123!"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="pt-3 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-low min-h-[40px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container shadow-xs min-h-[40px] cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant max-w-md w-full p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">edit</span>
                <h2 className="text-lg sm:text-xl font-bold text-on-surface font-headline">Edit User Details</h2>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {crudError && (
              <div className="p-3 bg-rose-500/10 text-rose-700 text-xs rounded-xl border border-rose-500/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{crudError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-outline mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Student">Student</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-outline mb-1">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-low min-h-[40px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container shadow-xs min-h-[40px] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resetPasswordUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant max-w-md w-full p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150 font-body">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-xl">key</span>
                <h2 className="text-lg sm:text-xl font-bold text-on-surface font-headline">Reset Account Password</h2>
              </div>
              <button onClick={() => setResetPasswordUser(null)} className="text-outline hover:text-on-surface cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant text-xs space-y-1">
              <p className="font-bold text-on-surface">{resetPasswordUser.name}</p>
              <p className="text-on-surface-variant">Username: {resetPasswordUser.username}</p>
            </div>

            {crudError && (
              <div className="p-3 bg-rose-500/10 text-rose-700 text-xs rounded-xl border border-rose-500/20">
                {crudError}
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">New Temporary Password</label>
                <input
                  type="password"
                  required
                  value={resetPasswordInput}
                  onChange={(e) => setResetPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary font-mono"
                />
                <p className="text-[11px] text-outline mt-1">User will be required to change this password upon their next login.</p>
              </div>

              <div className="pt-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setResetPasswordUser(null)}
                  className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-low min-h-[40px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-tertiary text-on-tertiary rounded-xl text-xs font-bold hover:opacity-90 shadow-xs min-h-[40px] cursor-pointer"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && deletingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant max-w-md w-full p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-on-surface font-headline">Delete Student Account</h2>
                <p className="text-xs text-on-surface-variant">This action cannot be undone.</p>
              </div>
            </div>

            {crudError && (
              <div className="p-3 bg-rose-500/10 text-rose-700 text-xs rounded-xl border border-rose-500/20">
                {crudError}
              </div>
            )}

            <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant text-xs space-y-1">
              <p className="font-bold text-on-surface">{deletingUser.name}</p>
              <p className="text-on-surface-variant">{deletingUser.username}</p>
            </div>

            <div className="pt-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-low min-h-[40px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-xs min-h-[40px] cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
