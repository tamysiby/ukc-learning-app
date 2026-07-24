import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  authSignIn,
  authSignOut,
  getStoredSession,
  getStoredUsers,
  saveStoredUsers,
  saveStoredSession
} from '../services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Initial load: restore active session & user list
  useEffect(() => {
    const savedUser = getStoredSession();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    const allUsers = getStoredUsers();
    setUsers(allUsers);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setAuthError('');
    setLoading(true);
    const res = await authSignIn(email, password);
    setLoading(false);
    
    if (res.error) {
      setAuthError(res.error);
      return { success: false, error: res.error };
    }

    setCurrentUser(res.user);
    // Refresh local list state
    setUsers(getStoredUsers());
    return { success: true, user: res.user };
  };

  const logout = async () => {
    await authSignOut();
    setCurrentUser(null);
    setAuthError('');
  };

  const createStudentUser = (newStudentData) => {
    if (!currentUser || currentUser.role !== 'Admin') {
      return { success: false, error: 'Only Administrators can create new student accounts.' };
    }

    const currentUsers = getStoredUsers();
    const existing = currentUsers.find(u => u.email.toLowerCase() === newStudentData.email.trim().toLowerCase());
    
    if (existing) {
      return { success: false, error: `An account with email '${newStudentData.email}' already exists.` };
    }

    const createdUser = {
      id: `usr-${Date.now()}`,
      name: newStudentData.name.trim(),
      email: newStudentData.email.trim().toLowerCase(),
      password: newStudentData.password || 'StudentPass123!',
      role: newStudentData.role || 'Student',
      status: 'Active',
      level: newStudentData.level || 'Beginner (Level 1)',
      progress: 0,
      streak: 0,
      lastActive: 'Never',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const updatedList = [createdUser, ...currentUsers];
    saveStoredUsers(updatedList);
    setUsers(updatedList);
    return { success: true, user: createdUser };
  };

  const updateStudentUser = (userId, updates) => {
    if (!currentUser || currentUser.role !== 'Admin') {
      return { success: false, error: 'Only Administrators can edit student accounts.' };
    }

    const currentUsers = getStoredUsers();
    const updatedList = currentUsers.map(u => {
      if (u.id === userId) {
        return { ...u, ...updates };
      }
      return u;
    });

    saveStoredUsers(updatedList);
    setUsers(updatedList);

    // If current logged-in user modified their own profile, update session
    if (currentUser.id === userId) {
      const updatedSelf = { ...currentUser, ...updates };
      setCurrentUser(updatedSelf);
      saveStoredSession(updatedSelf);
    }

    return { success: true };
  };

  const deleteStudentUser = (userId) => {
    if (!currentUser || currentUser.role !== 'Admin') {
      return { success: false, error: 'Only Administrators can delete student accounts.' };
    }

    if (currentUser.id === userId) {
      return { success: false, error: 'You cannot delete your own active Admin account.' };
    }

    const currentUsers = getStoredUsers();
    const updatedList = currentUsers.filter(u => u.id !== userId);
    saveStoredUsers(updatedList);
    setUsers(updatedList);
    return { success: true };
  };

  const toggleUserStatus = (userId) => {
    if (!currentUser || currentUser.role !== 'Admin') return;
    const target = users.find(u => u.id === userId);
    if (!target) return;
    const newStatus = target.status === 'Active' ? 'Inactive' : 'Active';
    updateStudentUser(userId, { status: newStatus });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        loading,
        authError,
        clearError: () => setAuthError(''),
        login,
        logout,
        users,
        createStudentUser,
        updateStudentUser,
        deleteStudentUser,
        toggleUserStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
