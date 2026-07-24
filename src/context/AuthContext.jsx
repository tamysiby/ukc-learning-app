import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  authSignIn,
  authSignOut,
  getStoredSession,
  getStoredUsers,
  saveStoredUsers,
  saveStoredSession,
  setUserOnlineState
} from '../services/supabaseClient';

const AuthContext = createContext(null);

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const THROTTLE_INTERVAL_MS = 10 * 1000; // Throttle activity updates every 10 seconds

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [sessionNotice, setSessionNotice] = useState('');

  const lastActivityTimeRef = useRef(Date.now());
  const inactivityTimerRef = useRef(null);
  const throttleTimerRef = useRef(0);

  // Load session & sync users list
  useEffect(() => {
    const savedUser = getStoredSession();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    const allUsers = getStoredUsers();
    setUsers(allUsers);
    setLoading(false);
  }, []);

  // Sync users list whenever storage updates (e.g., from admin CRUD or online status shifts)
  const refreshUsersList = () => {
    setUsers(getStoredUsers());
  };

  // Cross-tab single-session enforcement & storage synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Sync list of users
      refreshUsersList();

      if (!currentUser) return;

      // Check if session storage updated
      if (e.key === 'ukc_app_session_v1') {
        const newSession = e.newValue ? JSON.parse(e.newValue) : null;
        if (!newSession) {
          // Logged out in another tab
          setCurrentUser(null);
        }
      }

      // Check if user database updated (Single Session Superseded check)
      if (e.key === 'ukc_app_users_db_v1' && e.newValue) {
        try {
          const updatedUsers = JSON.parse(e.newValue);
          const selfRecord = updatedUsers.find(u => u.id === currentUser.id);

          // If a new session ID was assigned to this user from another login event
          if (selfRecord && selfRecord.activeSessionId && selfRecord.activeSessionId !== currentUser.activeSessionId) {
            authSignOut(currentUser.id);
            setCurrentUser(null);
            setSessionNotice('Your account was logged in from another session. You have been automatically signed out.');
          }
        } catch (err) {
          console.error('Error parsing cross-tab session update:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);

  // 15-Minute Throttled Inactivity Auto-Logout Tracker
  useEffect(() => {
    if (!currentUser) {
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
      return;
    }

    const resetActivityTimer = () => {
      const now = Date.now();
      // Throttle: only update lastActivityTime at most once every 10 seconds to avoid CPU churn
      if (now - throttleTimerRef.current > THROTTLE_INTERVAL_MS) {
        throttleTimerRef.current = now;
        lastActivityTimeRef.current = now;
      }
    };

    // User interaction events
    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    events.forEach(evt => window.addEventListener(evt, resetActivityTimer, { passive: true }));

    // Periodic check every 15 seconds to see if 15 mins of inactivity passed
    inactivityTimerRef.current = setInterval(() => {
      const idleDuration = Date.now() - lastActivityTimeRef.current;
      if (idleDuration >= INACTIVITY_TIMEOUT_MS) {
        // Auto Logout
        authSignOut(currentUser.id);
        setCurrentUser(null);
        setUsers(getStoredUsers());
        setSessionNotice('You were automatically logged out due to 15 minutes of inactivity.');
      }
    }, 15000);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, resetActivityTimer));
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    };
  }, [currentUser]);

  const login = async (email, password) => {
    setAuthError('');
    setSessionNotice('');
    setLoading(true);
    
    const res = await authSignIn(email, password);
    setLoading(false);
    
    if (res.error) {
      setAuthError(res.error);
      return { success: false, error: res.error };
    }

    setCurrentUser(res.user);
    lastActivityTimeRef.current = Date.now();
    refreshUsersList();
    return { success: true, user: res.user };
  };

  const logout = async () => {
    if (currentUser) {
      await authSignOut(currentUser.id);
    } else {
      await authSignOut();
    }
    setCurrentUser(null);
    setAuthError('');
    refreshUsersList();
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
      joinedDate: new Date().toISOString().split('T')[0],
      isOnline: false,
      activeSessionId: null
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
        sessionNotice,
        clearError: () => setAuthError(''),
        clearSessionNotice: () => setSessionNotice(''),
        login,
        logout,
        users,
        refreshUsersList,
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
