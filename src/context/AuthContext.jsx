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
} from '../services/userSessionStore';
import { fetchLessonsFromSupabase } from '../services/lessonRegistry';
import { hashPassword } from '../services/cryptoUtils';

const AuthContext = createContext(null);

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const THROTTLE_INTERVAL_MS = 10 * 1000; // Throttle activity updates every 10 seconds

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [authError, setAuthError] = useState('');
  const [lessonsError, setLessonsError] = useState('');

  const lastActivityTimeRef = useRef(Date.now());
  const inactivityTimerRef = useRef(null);
  const throttleTimerRef = useRef(0);
  const lessonsErrorTimerRef = useRef(null);
  const authErrorTimerRef = useRef(null);

  const refreshLessonsList = async () => {
    setLoadingLessons(true);
    const res = await fetchLessonsFromSupabase();
    if (res.error) {
      if (lessonsErrorTimerRef.current) clearTimeout(lessonsErrorTimerRef.current);
      lessonsErrorTimerRef.current = setTimeout(() => {
        setLessonsError(res.error);
        setLessons([]);
        setLoadingLessons(false);
      }, 2500);
    } else if (res.lessons) {
      if (lessonsErrorTimerRef.current) clearTimeout(lessonsErrorTimerRef.current);
      setLessonsError('');
      setLessons(res.lessons);
      setLoadingLessons(false);
    }
  };

  // Load session & sync users/lessons list from Supabase DB on startup
  useEffect(() => {
    const savedUser = getStoredSession();
    if (savedUser) {
      setCurrentUser(savedUser);
    }

    refreshLessonsList();

    // Live DB user roster fetch on startup (only required for Admin accounts or unauthenticated state)
    if (!savedUser || savedUser.role === 'Admin') {
      fetchUsersFromSupabase().then(res => {
        if (res.error) {
          if (authErrorTimerRef.current) clearTimeout(authErrorTimerRef.current);
          authErrorTimerRef.current = setTimeout(() => {
            setAuthError(res.error);
            setUsers([]);
          }, 2500);
        } else if (res.users) {
          if (authErrorTimerRef.current) clearTimeout(authErrorTimerRef.current);
          setAuthError('');
          setUsers(res.users);
        }
      }).catch(err => {
        if (authErrorTimerRef.current) clearTimeout(authErrorTimerRef.current);
        authErrorTimerRef.current = setTimeout(() => {
          setAuthError(err.message || 'Database Connection Failed');
          setUsers([]);
        }, 2500);
      });
    }
  }, []);

  // Sync users list (Admin only)
  const refreshUsersList = async () => {
    const activeSession = getStoredSession();
    // Optimization: Skip full user directory scan if current user is a Student
    if (activeSession && activeSession.role !== 'Admin') {
      return;
    }

    const res = await fetchUsersFromSupabase();
    if (res.error) {
      if (authErrorTimerRef.current) clearTimeout(authErrorTimerRef.current);
      authErrorTimerRef.current = setTimeout(() => {
        setAuthError(res.error);
      }, 2500);
    } else if (res.users) {
      if (authErrorTimerRef.current) clearTimeout(authErrorTimerRef.current);
      setAuthError('');
      setUsers(res.users);

      // Check current active stored session to prevent stale closure re-login on logout
      if (activeSession?.id) {
        const dbRecord = res.users.find(u => u.id === activeSession.id);
        if (dbRecord) {
          setCurrentUser(prevSelf => {
            const currentMustChange = prevSelf ? prevSelf.mustChangePassword : activeSession.mustChangePassword;
            const mergedCompleted = Array.from(new Set([
              ...(activeSession.completedLessonIds || []),
              ...(prevSelf?.completedLessonIds || []),
              ...(dbRecord.completedLessonIds || [])
            ]));
            const updatedSelf = {
              ...dbRecord,
              ...activeSession,
              ...prevSelf,
              mustChangePassword: currentMustChange === false ? false : (dbRecord.mustChangePassword ?? false),
              completedLessonIds: mergedCompleted
            };
            if (isDev) {
              console.log('[DEV AuthContext] refreshUsersList session sync:', {
                userId: activeSession.id,
                activeRoute: window.location.hash || '#pathway',
                dbMustChange: dbRecord.mustChangePassword,
                activeSessionMustChange: activeSession.mustChangePassword,
                finalMustChange: updatedSelf.mustChangePassword
              });
            }
            saveStoredSession(updatedSelf);
            return updatedSelf;
          });
        }
      }
    }
  };

  // Cross-tab storage synchronization
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
      }
    }, 10000);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, resetActivityTimer));
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    };
  }, [currentUser]);

  const login = async (username, password) => {
    setAuthError('');
    setLoading(true);

    const res = await authSignIn(username, password);
    setLoading(false);

    if (res.error) {
      setAuthError(res.error);
      return { success: false, error: res.error };
    }

    setCurrentUser(res.user);
    lastActivityTimeRef.current = Date.now();
    saveStoredSession(res.user);
    if (res.user?.role === 'Admin') {
      refreshUsersList();
    }
    return { success: true, user: res.user };
  };

  const logout = async () => {
    const targetId = currentUser?.id;
    setCurrentUser(null);
    setAuthError('');
    saveStoredSession(null);
    if (targetId) {
      await authSignOut(targetId);
    } else {
      await authSignOut();
    }
    refreshUsersList();
  };

  const createStudentUser = async (newStudentData) => {
    if (!currentUser || currentUser.role !== 'Admin') {
      return { success: false, error: 'Only Administrators can create new student accounts.' };
    }

    const existing = users.find(u => u.username?.toLowerCase() === newStudentData.username.trim().toLowerCase());

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
    setUsers(updatedList);
    return { success: true, user: createdUser };
  };

  const adminResetPassword = async (userId, newPassword) => {
    if (!currentUser || currentUser.role !== 'Admin') {
      return { success: false, error: 'Only Administrators can reset account passwords.' };
    }

    const hashedPassword = await hashPassword(newPassword);

    const dbRes = await updateStudentUserInDb(userId, { password: hashedPassword, mustChangePassword: true });
    if (!dbRes.success && !isDev) {
      return { success: false, error: dbRes.error };
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          password: hashedPassword,
          mustChangePassword: true
        };
      }
      return u;
    }));

    setCurrentUser(prevSelf => {
      if (prevSelf && prevSelf.id === userId) {
        const updatedSelf = { ...prevSelf, password: hashedPassword, mustChangePassword: true };
        saveStoredSession(updatedSelf);
        return updatedSelf;
      }
      return prevSelf;
    });

    return { success: true };
  };

  const changeUserPassword = async (newPassword) => {
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to change your password.' };
    }

    const hashedPassword = await hashPassword(newPassword);

    const dbRes = await updateStudentUserInDb(currentUser.id, { password: hashedPassword, mustChangePassword: false });
    if (!dbRes.success && !isDev) {
      return { success: false, error: dbRes.error };
    }

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          password: hashedPassword,
          mustChangePassword: false
        };
      }
      return u;
    }));

    setCurrentUser(prevSelf => {
      if (!prevSelf) return prevSelf;
      const updatedSelf = { ...prevSelf, password: hashedPassword, mustChangePassword: false };
      if (isDev) {
        console.log('[DEV AuthContext] changeUserPassword: Password updated successfully. Updating mustChangePassword to false for user:', prevSelf.id);
      }
      saveStoredSession(updatedSelf);
      return updatedSelf;
    });

    return { success: true };
  };

  const updateStudentUser = async (userId, updates) => {
    if (!currentUser || currentUser.role !== 'Admin') {
      return { success: false, error: 'Only Administrators can edit student accounts.' };
    }

    const dbRes = await updateStudentUserInDb(userId, updates);
    if (!dbRes.success && !isDev) {
      return { success: false, error: dbRes.error };
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, ...updates };
      }
      return u;
    }));

    setCurrentUser(prevSelf => {
      if (prevSelf?.id === userId) {
        const updatedSelf = { ...prevSelf, ...updates };
        saveStoredSession(updatedSelf);
        return updatedSelf;
      }
      return prevSelf;
    });

    return { success: true };
  };

  const deleteStudentUser = async (userId) => {
    if (!currentUser || currentUser.role !== 'Admin') {
      return { success: false, error: 'Only Administrators can delete student accounts.' };
    }

    if (currentUser.id === userId) {
      return { success: false, error: 'You cannot delete your own active Admin account.' };
    }

    const dbRes = await deleteStudentUserInDb(userId);
    if (!dbRes.success && !isDev) {
      return { success: false, error: dbRes.error };
    }

    setUsers(prev => prev.filter(u => u.id !== userId));
    return { success: true };
  };

  const toggleUserStatus = async (userId) => {
    if (!currentUser || currentUser.role !== 'Admin') return;
    const target = users.find(u => u.id === userId);
    if (!target) return;
    const newStatus = target.status === 'Active' ? 'Inactive' : 'Active';
    return await updateStudentUser(userId, { status: newStatus });
  };

  const updateStudentAssignedLessons = async (userId, lessonIds) => {
    const dbRes = await updateStudentUserInDb(userId, { assignedLessonIds: lessonIds });
    if (!dbRes.success && !isDev) {
      return { success: false, error: dbRes.error };
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, assignedLessonIds: lessonIds };
      }
      return u;
    }));

    setCurrentUser(prevSelf => {
      if (prevSelf?.id === userId) {
        const updatedSelf = { ...prevSelf, assignedLessonIds: lessonIds };
        saveStoredSession(updatedSelf);
        return updatedSelf;
      }
      return prevSelf;
    });
    return { success: true };
  };

  const markLessonCompleted = (userId, lessonId) => {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) return;

    let extraLessonId = null;
    if (lessonId === 'les-vowels-quiz-1') extraLessonId = 'les-vowels-1';
    if (lessonId === 'les-consonants-quiz-1') extraLessonId = 'les-consonants-1';

    setCurrentUser(prevSelf => {
      const activeUser = (prevSelf?.id === targetUserId) ? prevSelf : users.find(u => u.id === targetUserId);
      let completed = activeUser?.completedLessonIds ? [...activeUser.completedLessonIds] : [];

      if (!completed.includes(lessonId)) {
        completed.push(lessonId);
      }
      if (extraLessonId && !completed.includes(extraLessonId)) {
        completed.push(extraLessonId);
      }

      setUsers(prevUsers => {
        if (prevUsers.length > 0) {
          return prevUsers.map(u => u.id === targetUserId ? { ...u, completedLessonIds: completed } : u);
        }
        return prevUsers;
      });

      updateStudentUserInDb(targetUserId, { completedLessonIds: completed });

      if (prevSelf && prevSelf.id === targetUserId) {
        const updatedSelf = { ...prevSelf, completedLessonIds: completed };
        saveStoredSession(updatedSelf);
        return updatedSelf;
      }
      return prevSelf;
    });
  };

  const toggleStudentLessonCompletion = (userId, lessonId) => {
    const target = (currentUser?.id === userId) ? currentUser : users.find(u => u.id === userId);
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

    setUsers(prev => prev.length > 0 ? prev.map(u => u.id === userId ? { ...u, completedLessonIds: updatedCompleted } : u) : prev);

    setCurrentUser(prevSelf => {
      if (prevSelf && prevSelf.id === userId) {
        const updatedSelf = { ...prevSelf, completedLessonIds: updatedCompleted };
        saveStoredSession(updatedSelf);
        return updatedSelf;
      }
      return prevSelf;
    });

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
        clearError: () => setAuthError(''),
        login,
        logout,
        users,
        lessons,
        lessonsError,
        loadingLessons,
        refreshUsersList,
        refreshLessonsList,
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
