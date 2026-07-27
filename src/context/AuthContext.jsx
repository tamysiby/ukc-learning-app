import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  authSignIn,
  authSignOut,
  getStoredSession,
  getStoredUsers,
  saveStoredUsers,
  saveStoredSession,
  fetchUsersFromSupabase,
  isSupabaseConfigured,
  isDev,
  createStudentUserInDb,
  updateStudentUserInDb,
  deleteStudentUserInDb
} from '../services/supabaseClient';
import { hashPassword } from '../services/cryptoUtils';

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

  // Load session & sync users list from Supabase DB on startup
  useEffect(() => {
    const savedUser = getStoredSession();
    if (savedUser) {
      setCurrentUser(savedUser);
    }

    if (isDev) {
      const cachedUsers = getStoredUsers();
      setUsers(cachedUsers);
      setLoading(false);
    }

    // Asynchronous background live DB fetch on startup
    fetchUsersFromSupabase().then(res => {
      if (res.error && !isDev) {
        setAuthError(res.error);
        setUsers([]);
      } else if (res.users) {
        setUsers(res.users);
      }
      setLoading(false);
    }).catch(err => {
      if (!isDev) {
        setAuthError(err.message || 'Database Connection Failed');
      }
      setLoading(false);
    });
  }, []);

  // Sync users list
  const refreshUsersList = async () => {
    const res = await fetchUsersFromSupabase();
    if (res.error && !isDev) {
      setAuthError(res.error);
    } else if (res.users) {
      setUsers(res.users);

      // Preserve completedLessonIds & assignedLessonIds from active local session if newer
      if (currentUser?.id) {
        const dbRecord = res.users.find(u => u.id === currentUser.id);
        if (dbRecord) {
          const mergedCompleted = Array.from(new Set([
            ...(currentUser.completedLessonIds || []),
            ...(dbRecord.completedLessonIds || [])
          ]));
          const updatedSelf = {
            ...dbRecord,
            ...currentUser,
            completedLessonIds: mergedCompleted,
            activeSessionId: currentUser.activeSessionId
          };
          setCurrentUser(updatedSelf);
          saveStoredSession(updatedSelf);
        }
      }
    }
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

  const login = async (username, password) => {
    setAuthError('');
    setSessionNotice('');
    setLoading(true);

    const res = await authSignIn(username, password);
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

  const createStudentUser = async (newStudentData) => {
    if (!currentUser || currentUser.role !== 'Admin') {
      return { success: false, error: 'Only Administrators can create new student accounts.' };
    }

    const currentUsers = getStoredUsers();
    const existing = currentUsers.find(u => u.username?.toLowerCase() === newStudentData.username.trim().toLowerCase());

    if (existing) {
      return { success: false, error: `An account with username '${newStudentData.username}' already exists.` };
    }

    const hashedPassword = await hashPassword(newStudentData.password || 'StudentPass123!');

    const dbRes = await createStudentUserInDb({
      username: newStudentData.username.trim().toLowerCase(),
      name: newStudentData.name.trim(),
      password: hashedPassword,
      role: newStudentData.role || 'Student',
      status: 'Active',
      level: newStudentData.level || 'Beginner (Level 1)',
      mustChangePassword: true
    });

    if (!dbRes.success && !isDev) {
      return { success: false, error: dbRes.error };
    }

    const createdUser = {
      id: dbRes.data?.id || `usr-${Date.now()}`,
      name: newStudentData.name.trim(),
      username: newStudentData.username.trim().toLowerCase(),
      password: hashedPassword,
      role: newStudentData.role || 'Student',
      status: 'Active',
      level: newStudentData.level || 'Beginner (Level 1)',
      progress: 0,
      streak: 0,
      lastActive: 'Never',
      joinedDate: new Date().toISOString().split('T')[0],
      isOnline: false,
      activeSessionId: null,
      mustChangePassword: true
    };

    const updatedList = [createdUser, ...users];
    if (isDev) saveStoredUsers(updatedList);
    setUsers(updatedList);
    return { success: true, user: createdUser };
  };

  const adminResetPassword = async (userId, newPassword) => {
    if (!currentUser || currentUser.role !== 'Admin') {
      return { success: false, error: 'Only Administrators can reset account passwords.' };
    }

    const dbRes = await updateStudentUserInDb(userId, { password: hashedPassword, mustChangePassword: true });
    if (!dbRes.success && !isDev) {
      return { success: false, error: dbRes.error };
    }

    const currentUsers = users.length > 0 ? users : getStoredUsers();
    const updatedList = currentUsers.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          password: hashedPassword,
          mustChangePassword: true
        };
      }
      return u;
    });

    if (isDev) saveStoredUsers(updatedList);
    setUsers(updatedList);

    if (currentUser.id === userId) {
      const updatedSelf = { ...currentUser, password: hashedPassword, mustChangePassword: true };
      setCurrentUser(updatedSelf);
      saveStoredSession(updatedSelf);
    }

    return { success: true };
  };

  const changeUserPassword = async (newPassword) => {
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to change your password.' };
    }

    const dbRes = await updateStudentUserInDb(currentUser.id, { password: hashedPassword, mustChangePassword: false });
    if (!dbRes.success && !isDev) {
      return { success: false, error: dbRes.error };
    }

    const currentUsers = users.length > 0 ? users : getStoredUsers();
    const updatedList = currentUsers.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          password: hashedPassword,
          mustChangePassword: false
        };
      }
      return u;
    });

    if (isDev) saveStoredUsers(updatedList);
    setUsers(updatedList);

    const updatedSelf = { ...currentUser, password: hashedPassword, mustChangePassword: false };
    setCurrentUser(updatedSelf);
    saveStoredSession(updatedSelf);

    return { success: true };
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
    updateStudentUserInDb(userId, { assignedLessonIds: lessonIds });

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

    let extraLessonId = null;
    if (lessonId === 'les-vowels-quiz-1') extraLessonId = 'les-vowels-1';
    if (lessonId === 'les-consonants-quiz-1') extraLessonId = 'les-consonants-1';

    let updatedCompleted = [];
    const currentUsers = getStoredUsers();
    const updatedList = currentUsers.map(u => {
      if (u.id === targetUserId) {
        let completed = u.completedLessonIds || [];
        if (!completed.includes(lessonId)) {
          completed = [...completed, lessonId];
        }
        if (extraLessonId && !completed.includes(extraLessonId)) {
          completed = [...completed, extraLessonId];
        }
        updatedCompleted = completed;
        return { ...u, completedLessonIds: completed };
      }
      return u;
    });

    saveStoredUsers(updatedList);
    setUsers(updatedList);

    if (currentUser?.id === targetUserId) {
      let completed = currentUser.completedLessonIds || [];
      let updated = false;
      if (!completed.includes(lessonId)) {
        completed = [...completed, lessonId];
        updated = true;
      }
      if (extraLessonId && !completed.includes(extraLessonId)) {
        completed = [...completed, extraLessonId];
        updated = true;
      }
      if (updated) {
        const updatedSelf = { ...currentUser, completedLessonIds: completed };
        setCurrentUser(updatedSelf);
        saveStoredSession(updatedSelf);
      }
    }

    updateStudentUserInDb(targetUserId, { completedLessonIds: updatedCompleted });
  };

  const toggleStudentLessonCompletion = (userId, lessonId) => {
    const currentUsers = getStoredUsers();
    const target = currentUsers.find(u => u.id === userId);
    if (!target) return;

    const completed = target.completedLessonIds || [];
    let updatedCompleted;
    if (completed.includes(lessonId)) {
      updatedCompleted = completed.filter(id => id !== lessonId);
    } else {
      updatedCompleted = [...completed, lessonId];
      if (lessonId === 'les-vowels-quiz-1' && !updatedCompleted.includes('les-vowels-1')) {
        updatedCompleted.push('les-vowels-1');
      }
      if (lessonId === 'les-consonants-quiz-1' && !updatedCompleted.includes('les-consonants-1')) {
        updatedCompleted.push('les-consonants-1');
      }
    }

    const updatedList = currentUsers.map(u => {
      if (u.id === userId) {
        return { ...u, completedLessonIds: updatedCompleted };
      }
      return u;
    });

    saveStoredUsers(updatedList);
    setUsers(updatedList);

    if (currentUser?.id === userId) {
      const updatedSelf = { ...currentUser, completedLessonIds: updatedCompleted };
      setCurrentUser(updatedSelf);
      saveStoredSession(updatedSelf);
    }

    updateStudentUserInDb(userId, { completedLessonIds: updatedCompleted });
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
        adminResetPassword,
        changeUserPassword,
        toggleUserStatus,
        updateStudentAssignedLessons,
        markLessonCompleted,
        toggleStudentLessonCompletion
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
