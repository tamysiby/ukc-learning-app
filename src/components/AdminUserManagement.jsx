import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminUserManagement({ onSelectUser }) {
  const { users, createStudentUser, updateStudentUser, deleteStudentUser, toggleUserStatus, currentUser } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: 'StudentPass123!',
    role: 'Student',
    level: 'Beginner (Level 1)'
  });

  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [crudError, setCrudError] = useState('');

  // Filtering users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle Add Student Submit
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    setCrudError('');
    if (!newUser.name || !newUser.email) return;

    const res = createStudentUser(newUser);
    if (!res.success) {
      setCrudError(res.error);
      return;
    }

    setNewUser({ name: '', email: '', password: 'StudentPass123!', role: 'Student', level: 'Beginner (Level 1)' });
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
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const res = updateStudentUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
      level: editingUser.level,
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
  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    const res = deleteStudentUser(deletingUser.id);
    if (!res.success) {
      setCrudError(res.error);
      return;
    }
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-headline">User Management</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-label">
            Admin Portal • Create student accounts, assign levels, and manage access.
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
          Add New Student Account
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-3.5 sm:p-6 rounded-2xl border border-outline-variant shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name, email..."
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
          filteredUsers.map((user) => (
            <div key={user.id} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover border border-outline-variant" />
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">{user.name}</h3>
                    <p className="text-xs text-on-surface-variant">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleUserStatus(user.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                    user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {user.status}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/60">
                <span className="text-outline">Level: <strong className="text-on-surface">{user.level}</strong></span>
                <span className="text-primary font-bold">{user.progress}% Progress</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
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
                  onClick={(e) => handleOpenDelete(user, e)}
                  disabled={user.id === currentUser?.id}
                  className="py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Delete
                </button>
              </div>
            </div>
          ))
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
                <th className="px-6 py-4">Current Level</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-on-surface-variant font-medium">
                    No users matching search filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                        <div>
                          <p className="font-semibold text-on-surface">{user.name}</p>
                          <p className="text-xs text-on-surface-variant">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.role === 'Admin' ? 'bg-tertiary-container/30 text-tertiary' : 'bg-primary-fixed/60 text-primary'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-on-surface-variant font-medium text-xs">
                      {user.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{user.progress}%</span>
                          <span className="text-xs text-outline">{user.streak}d streak</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${user.progress}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          user.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {user.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => onSelectUser(user)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-container px-2.5 py-1.5 rounded-lg border border-primary/20 hover:border-primary/40 bg-primary/5 transition-all cursor-pointer"
                        title="View details & progress"
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
                        onClick={(e) => handleOpenDelete(user, e)}
                        disabled={user.id === currentUser?.id}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete user"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                  placeholder="e.g. Soo-jin Park"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="e.g. soojin@ukc.edu"
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
              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="block text-xs font-semibold uppercase text-outline mb-1">Assigned Level</label>
                  <select
                    value={newUser.level}
                    onChange={(e) => setNewUser({ ...newUser, level: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Beginner (Level 1)">Beginner L1</option>
                    <option value="Elementary (Level 2)">Elementary L2</option>
                    <option value="Intermediate (Level 3)">Intermediate L3</option>
                    <option value="Advanced (Level 5)">Advanced L5</option>
                  </select>
                </div>
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
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-outline mb-1">Level</label>
                  <select
                    value={editingUser.level}
                    onChange={(e) => setEditingUser({ ...editingUser, level: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Beginner (Level 1)">Beginner L1</option>
                    <option value="Elementary (Level 2)">Elementary L2</option>
                    <option value="Intermediate (Level 3)">Intermediate L3</option>
                    <option value="Advanced (Level 5)">Advanced L5</option>
                    <option value="Staff Administrator">Staff Admin</option>
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
              <p className="text-on-surface-variant">{deletingUser.email}</p>
              <p className="text-outline text-[11px]">Level: {deletingUser.level}</p>
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
