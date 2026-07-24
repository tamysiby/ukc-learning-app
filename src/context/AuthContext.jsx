import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  authSignIn,
  authSignOut,
  getStoredSession,
  getStoredUsers,
  saveStoredUsers,
  saveStoredSession
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
  const sessionCheckTimerRef = useRef(null);
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

  // Sync users list
  const refreshUsersList = () => {
    setUsers(getStoredUsers());
  };

  // Single-session enforcement: Validate if current session was superseded
  const validateSessionIntegrity = (currentUsr) => {
    if (!currentUsr || !currentUsr.activeSessionId) return true;

    const allUsers = getStoredUsers();
    const selfRecord = allUsers.find(u => u.id === currentUsr.id);

    // If another session logged in with a different sessionId
    if (selfRecord && selfRecord.activeSessionId && selfRecord.activeSessionId !== currentUsr.activeSessionId) {
      setCurrentUser(null);
      setSessionNotice('Your account was logged in from another session. You have been automatically signed out.');
      saveStoredSession(null);
      refreshUsersList();
      return false;
    }
    return true;
  };

  // Cross-tab single-session enforcement & storage synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      refreshUsersList();

      if (!currentUser) return;

      // Check if session storage updated in another tab/window
      if (e.key === 'ukc_app_session_v1') {
        const newSession = e.newValue ? JSON.parse(e.newValue) : null;
        if (!newSession) {
          // Explicit logout in another tab
          setCurrentUser(null);
        } else if (newSession.id === currentUser.id && newSession.activeSessionId !== currentUser.activeSessionId) {
          // Logged in with a new session in another tab
          setCurrentUser(null);
          setSessionNotice('Your account was logged in from another session. You have been automatically signed out.');
        }
      }

      // Check if users database updated
      if (e.key === 'ukc_app_users_db_v1') {
        validateSessionIntegrity(currentUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);

  // Fast Periodic Session Heartbeat (Validates single-session integrity every 2 seconds)
  useEffect(() => {
    if (!currentUser) {
      if (sessionCheckTimerRef.current) clearInterval(sessionCheckTimerRef.current);
      return;
    }

    sessionCheckTimerRef.current = setInterval(() => {
      validateSessionIntegrity(currentUser);
    }, 2000);

    return () => {
      if (sessionCheckTimerRef.current) clearInterval(sessionCheckTimerRef.current);
    };
  }, [currentUser]);

  // 15-Minute Throttled Inactivity Auto-Logout Tracker
  useEffect(() => {
    if (!currentUser) {
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
      return;
    }

    const resetActivityTimer = () => {
      const now = Date.now();
      // Throttle: update lastActivityTime at most once every 10 seconds to avoid CPU churn
      if (now - throttleTimerRef.current > THROTTLE_INTERVAL_MS) {
        throttleTimerRef.current = now;
        lastActivityTimeRef.current = now;
      }
    };

    // User interaction events
    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    events.forEach(evt => window.addEventListener(evt, resetActivityTimer, { passive: true }));

    // Periodic check every 10 seconds to see if 15 mins of inactivity passed
    inactivityTimerRef.current = setInterval(() => {
      const idleDuration = Date.now() - lastActivityTimeRef.current;
      if (idleDuration >= INACTIVITY_TIMEOUT_MS) {
        // Auto Logout
        authSignOut(currentUser.id);
        setCurrentUser(null);
        refreshUsersList();
        setSessionNotice('You were automatically logged out due to 15 minutes of inactivity.');
      }
    }, 10000);

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

  const updateStudentAssignedLessons = (userId, lessonIds) => {
    const currentUsers = getStoredUsers();
    const updatedList = currentUsers.map(u => {
      if (u.id === userId) {
        return { ...u, assignedLessonIds: lessonIds };
      }
      return u;
    });

    saveStoredUsers(updatedList);
    setUsers(updatedList);

    if (currentUser?.id === userId) {
      const updatedSelf = { ...currentUser, assignedLessonIds: lessonIds };
      setCurrentUser(updatedSelf);
      saveStoredSession(updatedSelf);
    }
    return { success: true };
  };

  const markLessonCompleted = (userId, lessonId) => {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) return;

    const currentUsers = getStoredUsers();
    const updatedList = currentUsers.map(u => {
      if (u.id === targetUserId) {
        const completed = u.completedLessonIds || [];
        if (!completed.includes(lessonId)) {
          return { ...u, completedLessonIds: [...completed, lessonId] };
        }
      }
      return u;
    });

    saveStoredUsers(updatedList);
    setUsers(updatedList);

    if (currentUser?.id === targetUserId) {
      const completed = currentUser.completedLessonIds || [];
      if (!completed.includes(lessonId)) {
        const updatedSelf = { ...currentUser, completedLessonIds: [...completed, lessonId] };
        setCurrentUser(updatedSelf);
        saveStoredSession(updatedSelf);
      }
    }
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
        toggleUserStatus,
        updateStudentAssignedLessons,
        markLessonCompleted
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
