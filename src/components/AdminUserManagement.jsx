import React, { useState } from 'react';
import { initialMockUsers } from '../services/supabaseClient';

export default function AdminUserManagement({ onSelectUser }) {
  const [users, setUsers] = useState(initialMockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Student', level: 'Beginner (Level 1)' });

  // Filtering users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const created = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Active',
      level: newUser.level,
      progress: 0,
      streak: 0,
      lastActive: 'Never',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`
    };
    setUsers([created, ...users]);
    setNewUser({ name: '', email: '', role: 'Student', level: 'Beginner (Level 1)' });
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-headline">User Management</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-label">Manage student registrations, level assignments, and access.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-on-primary font-medium text-xs sm:text-sm rounded-xl shadow-xs hover:bg-primary-container transition-colors gap-2 min-h-[44px]"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add New User
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

      {/* MOBILE CARD VIEW (Visible on small screens) */}
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
                  onClick={() => handleToggleStatus(user.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {user.status}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/60">
                <span className="text-outline">Level: <strong className="text-on-surface">{user.level}</strong></span>
                <span className="text-primary font-bold">{user.progress}% Completed</span>
              </div>

              <button
                onClick={() => onSelectUser(user)}
                className="w-full py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary font-bold text-xs rounded-xl flex items-center justify-center gap-1 min-h-[40px]"
              >
                View Student Progress
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Hidden on small screens) */}
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
                        onClick={() => handleToggleStatus(user.id)}
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
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => onSelectUser(user)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-container px-3 py-1.5 rounded-lg border border-primary/20 hover:border-primary/40 bg-primary/5 transition-all"
                      >
                        View Details
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant max-w-md w-full p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-on-surface font-headline">Register New User</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddUserSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase text-outline mb-1">Full Name</label>
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
                  <label className="block text-xs font-semibold uppercase text-outline mb-1">Level</label>
                  <select
                    value={newUser.level}
                    onChange={(e) => setNewUser({ ...newUser, level: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Beginner (Level 1)">Beginner L1</option>
                    <option value="Elementary (Level 2)">Elementary L2</option>
                    <option value="Intermediate (Level 3)">Intermediate L3</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container-low min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-semibold hover:bg-primary-container shadow-xs min-h-[40px]"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
