/**
 * UserSessionStore
 * Deep module encapsulating user persistence, active session verification,
 * single-session token validation, database access, and local dev storage fallbacks.
 */

import { supabase } from './supabaseClient';
import { verifyPassword } from './cryptoUtils';

export const STORAGE_USERS_KEY = 'ukc_app_users_db_v2';
export const STORAGE_SESSION_KEY = 'ukc_app_session_v1';

export const isDev = !!(import.meta.env?.DEV || import.meta.env?.MODE === 'development');

export const isSupabaseConfigured = !!(
  import.meta.env?.VITE_SUPABASE_URL &&
  !import.meta.env?.VITE_SUPABASE_URL.includes('placeholder') &&
  import.meta.env?.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env?.VITE_SUPABASE_ANON_KEY.includes('placeholder')
);

// Default Seed Users (Admin & Students)
export const initialMockUsers = [
  {
    id: 'usr-admin-1',
    name: 'Tae-hyun Choi (Admin)',
    username: 'admin',
    password: 'AdminPass123!',
    role: 'Admin',
    status: 'Active',
    level: 'Staff Administrator',
    progress: 100,
    streak: 45,
    lastActive: 'Just now',
    joinedDate: '2025-08-01',
    isOnline: false,
    mustChangePassword: false,
    assignedLessonIds: ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-consonants-quiz-1', 'les-batchim-1', 'les-eyo-1', 'les-vocab-practice-1', 'les-vocab-practice-quiz-1', 'les-vocab-practice-2', 'les-vocab-practice-quiz-2'],
    completedLessonIds: ['les-vowels-1']
  },
  {
    id: 'usr-1',
    name: 'Min-ji Kim',
    username: 'minji.kim',
    password: 'StudentPass123!',
    role: 'Student',
    status: 'Active',
    level: 'Intermediate (Level 3)',
    progress: 78,
    streak: 14,
    lastActive: '10 mins ago',
    joinedDate: '2026-01-15',
    isOnline: false,
    mustChangePassword: false,
    assignedLessonIds: ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-consonants-quiz-1', 'les-batchim-1', 'les-eyo-1', 'les-vocab-practice-1', 'les-vocab-practice-quiz-1', 'les-vocab-practice-2', 'les-vocab-practice-quiz-2'],
    completedLessonIds: ['les-vowels-1']
  },
  {
    id: 'usr-2',
    name: 'Ji-hoon Park',
    username: 'jihoon.park',
    password: 'StudentPass123!',
    role: 'Student',
    status: 'Active',
    level: 'Beginner (Level 1)',
    progress: 42,
    streak: 5,
    lastActive: '2 hours ago',
    joinedDate: '2026-03-01',
    isOnline: false,
    mustChangePassword: false,
    assignedLessonIds: ['les-vowels-1', 'les-vowels-quiz-1'],
    completedLessonIds: []
  },
  {
    id: 'usr-3',
    name: 'Soo-jin Lee',
    username: 'soojin.lee',
    password: 'StudentPass123!',
    role: 'Student',
    status: 'Inactive',
    level: 'Advanced (Level 5)',
    progress: 95,
    streak: 0,
    lastActive: '4 days ago',
    joinedDate: '2025-11-10',
    isOnline: false,
    mustChangePassword: false,
    assignedLessonIds: ['les-hangul-1'],
    completedLessonIds: []
  },
  {
    id: 'usr-5',
    name: 'Eun-ji Choi',
    username: 'eunji.choi',
    password: 'StudentPass123!',
    role: 'Student',
    status: 'Active',
    level: 'Elementary (Level 2)',
    progress: 60,
    streak: 9,
    lastActive: '1 hour ago',
    joinedDate: '2026-02-14',
    isOnline: false,
    mustChangePassword: false,
    assignedLessonIds: ['les-hangul-1', 'les-vocab-1'],
    completedLessonIds: []
  }
];

export const mockFlashcards = [
  {
    id: 'fc-1',
    korean: '안녕하세요',
    romanization: 'An-nyeong-ha-se-yo',
    english: 'Hello / Good day (Formal)',
    category: 'Greetings',
    audioUrl: ''
  },
  {
    id: 'fc-2',
    korean: '감사합니다',
    romanization: 'Gam-sa-ham-ni-da',
    english: 'Thank you (Formal)',
    category: 'Etiquette',
    audioUrl: ''
  },
  {
    id: 'fc-3',
    korean: '학교',
    romanization: 'Hak-gyo',
    english: 'School',
    category: 'Places & Education',
    audioUrl: ''
  },
  {
    id: 'fc-4',
    korean: '학생',
    romanization: 'Hak-saeng',
    english: 'Student',
    category: 'People',
    audioUrl: ''
  },
  {
    id: 'fc-5',
    korean: '선생님',
    romanization: 'Seon-saeng-nim',
    english: 'Teacher / Instructor',
    category: 'People',
    audioUrl: ''
  }
];

// User Storage Management
export const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (raw) {
      const users = JSON.parse(raw);
      if (Array.isArray(users) && users.length > 0) {
        const hasLegacy = users.some(u => !u.username && u.email);
        if (hasLegacy) {
          const migrated = users.map(u => {
            if (!u.username && u.email) {
              return {
                ...u,
                username: u.email === 'admin@ukc.edu' ? 'admin' : u.email.split('@')[0]
              };
            }
            return u;
          });
          saveStoredUsers(migrated);
          return migrated;
        }
        return users;
      }
    }
  } catch (e) {
    console.error('Error reading stored users:', e);
  }
  saveStoredUsers(initialMockUsers);
  return initialMockUsers;
};

export const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users:', e);
  }
};

// Session Storage Management (Populates both sessionStorage AND localStorage)
export const getStoredSession = () => {
  try {
    const rawSession = sessionStorage.getItem(STORAGE_SESSION_KEY);
    if (rawSession) return JSON.parse(rawSession);
    const rawLocal = localStorage.getItem(STORAGE_SESSION_KEY);
    if (rawLocal) return JSON.parse(rawLocal);
  } catch (e) {
    console.error('Error reading session:', e);
  }
  return null;
};

export const saveStoredSession = (user) => {
  try {
    if (user) {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  } catch (e) {
    console.error('Error saving session:', e);
  }
};

// Update user online status
export const setUserOnlineState = (userId, isOnline) => {
  const users = getStoredUsers();
  const updatedList = users.map(u => {
    if (u.id === userId) {
      return {
        ...u,
        isOnline: isOnline,
        lastActive: isOnline ? 'Just now' : u.lastActive
      };
    }
    return u;
  });
  saveStoredUsers(updatedList);
  return updatedList;
};

// Fetch users directly from Supabase DB (with fallback to local storage ONLY in dev)
export const fetchUsersFromSupabase = async () => {
  if (!isSupabaseConfigured) {
    if (isDev) {
      return { users: getStoredUsers(), error: null };
    }
    return {
      users: [],
      error: 'Database Configuration Missing: Supabase URL and Anon Key are not configured for production.'
    };
  }

  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      if (isDev) {
        console.warn('Supabase DB fetch error, falling back to local storage (DEV):', error);
        return { users: getStoredUsers(), error: null };
      }
      return {
        users: [],
        error: `Database Service Failure: Unable to fetch user records from Supabase (${error.message || 'Connection error'}).`
      };
    }

    let progressMap = {};
    let accessMap = {};
    try {
      const { data: progressData } = await supabase.from('student_lesson_progress').select('student_id, lesson_id');
      if (Array.isArray(progressData)) {
        progressData.forEach(row => {
          if (!progressMap[row.student_id]) progressMap[row.student_id] = [];
          progressMap[row.student_id].push(row.lesson_id);
        });
      }
    } catch (e) {}

    try {
      const { data: accessData } = await supabase.from('student_lesson_access').select('student_id, lesson_id');
      if (Array.isArray(accessData)) {
        accessData.forEach(row => {
          if (!accessMap[row.student_id]) accessMap[row.student_id] = [];
          accessMap[row.student_id].push(row.lesson_id);
        });
      }
    } catch (e) {}

    const defaultAssigned = ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-consonants-quiz-1', 'les-batchim-1', 'les-eyo-1', 'les-vocab-practice-1', 'les-vocab-practice-quiz-1', 'les-vocab-practice-2', 'les-vocab-practice-quiz-2'];

    if (Array.isArray(data)) {
      const mappedUsers = data.map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        password: u.password,
        role: u.role,
        status: u.status,
        level: u.level || 'Beginner (Level 1)',
        progress: u.progress || 0,
        streak: u.streak || 0,
        isOnline: u.is_online || false,
        activeSessionId: u.active_session_id || null,
        mustChangePassword: u.must_change_password ?? false,
        lastActive: u.last_active ? new Date(u.last_active).toLocaleString() : 'Never',
        joinedDate: u.created_at ? u.created_at.split('T')[0] : '2026-01-01',
        assignedLessonIds: (accessMap[u.id] && accessMap[u.id].length > 0) ? accessMap[u.id] : defaultAssigned,
        completedLessonIds: progressMap[u.id] || []
      }));
      if (isDev) {
        saveStoredUsers(mappedUsers);
      }
      return { users: mappedUsers, error: null };
    }
  } catch (err) {
    if (isDev) {
      console.warn('Failed to fetch users from Supabase DB, using local store fallback (DEV):', err);
      return { users: getStoredUsers(), error: null };
    }
    return {
      users: [],
      error: `Database Connection Error: ${err.message || 'Failed to communicate with Supabase database.'}`
    };
  }

  return { users: isDev ? getStoredUsers() : [], error: isDev ? null : 'No user data returned from database.' };
};

// Authentic Authentication Functions
export const authSignIn = async (username, password) => {
  const cleanUsername = username?.trim().toLowerCase();

  if (isSupabaseConfigured) {
    try {
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('username', cleanUsername)
        .single();

      if (dbError || !dbUser) {
        if (!isDev) {
          return { user: null, error: 'Invalid username or password. Please check your credentials and try again.' };
        }
      } else {
        if (dbUser.status === 'Inactive') {
          return { user: null, error: 'Account is currently inactive. Please contact your system administrator.' };
        }

        const isPasswordValid = await verifyPassword(password, dbUser.password);
        if (!isPasswordValid) {
          return { user: null, error: 'Invalid username or password. Please check your credentials and try again.' };
        }

        const nowIso = new Date().toISOString();
        await supabase
          .from('users')
          .update({ is_online: true, last_active: nowIso })
          .eq('id', dbUser.id);

        let completedIds = [];
        try {
          const { data: pData } = await supabase.from('student_lesson_progress').select('lesson_id').eq('student_id', dbUser.id);
          if (Array.isArray(pData)) completedIds = pData.map(p => p.lesson_id);
        } catch (e) {}

        let assignedIds = [];
        try {
          const { data: aData } = await supabase.from('student_lesson_access').select('lesson_id').eq('student_id', dbUser.id);
          if (Array.isArray(aData)) assignedIds = aData.map(a => a.lesson_id);
        } catch (e) {}

        const defaultAssigned = ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-consonants-quiz-1', 'les-batchim-1', 'les-eyo-1', 'les-vocab-practice-1', 'les-vocab-practice-quiz-1', 'les-vocab-practice-2', 'les-vocab-practice-quiz-2'];

        const userObj = {
          id: dbUser.id,
          name: dbUser.name,
          username: dbUser.username,
          password: dbUser.password,
          role: dbUser.role,
          status: dbUser.status,
          level: dbUser.level || 'Beginner (Level 1)',
          progress: dbUser.progress || 0,
          streak: dbUser.streak || 0,
          isOnline: true,
          mustChangePassword: dbUser.must_change_password ?? false,
          lastActive: 'Just now',
          joinedDate: dbUser.created_at ? dbUser.created_at.split('T')[0] : '2026-01-01',
          assignedLessonIds: assignedIds.length > 0 ? assignedIds : defaultAssigned,
          completedLessonIds: completedIds
        };

        saveStoredSession(userObj);
        return { user: userObj, error: null };
      }
    } catch (err) {
      if (!isDev) {
        return {
          user: null,
          error: `Database Authentication Error: Unable to connect to Supabase database. ${err.message || ''}`
        };
      }
      console.warn('Supabase DB query failed, using dev fallback:', err);
    }
  }

  if (!isDev) {
    return {
      user: null,
      error: 'Database Unavailable: Supabase database connection is not configured or failed to respond in production.'
    };
  }

  const users = getStoredUsers();
  const matchedUser = users.find(u => u.username?.toLowerCase() === cleanUsername);

  if (!matchedUser) {
    return { user: null, error: 'Invalid username or password. Please check your credentials and try again.' };
  }

  if (matchedUser.status === 'Inactive') {
    return { user: null, error: 'Account is currently inactive. Please contact your system administrator.' };
  }

  const isPasswordValid = await verifyPassword(password, matchedUser.password);
  if (!isPasswordValid) {
    return { user: null, error: 'Invalid username or password. Please check your credentials and try again.' };
  }

  const updatedUser = {
    ...matchedUser,
    isOnline: true,
    lastActive: 'Just now'
  };

  const updatedUsersList = users.map(u => u.id === matchedUser.id ? updatedUser : u);
  saveStoredUsers(updatedUsersList);
  saveStoredSession(updatedUser);

  return { user: updatedUser, error: null };
};

export const authSignOut = async (userId = null) => {
  const currentSession = getStoredSession();
  const targetId = userId || currentSession?.id;

  if (targetId) {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('users')
          .update({ is_online: false })
          .eq('id', targetId);
      } catch (e) {
        // Suppress network errors on signout
      }
    }
    setUserOnlineState(targetId, false);
  }

  try {
    await supabase.auth.signOut();
  } catch (e) {
    // Ignore offline errors
  }
  saveStoredSession(null);
};

// Database Mutations (Create, Update, Delete)
export const createStudentUserInDb = async (userData) => {
  if (!isSupabaseConfigured) {
    if (!isDev) {
      return { success: false, error: 'Database Unconfigured: Cannot create student account without a live Supabase database connection in production.' };
    }
    return { success: true };
  }

  try {
    const { data, error } = await supabase.from('users').insert([{
      username: userData.username,
      name: userData.name,
      password: userData.password,
      role: userData.role || 'Student',
      status: userData.status || 'Active',
      level: userData.level || 'Beginner (Level 1)',
      must_change_password: userData.mustChangePassword ?? true
    }]).select().single();

    if (error) {
      return { success: false, error: `Database Create Failed: ${error.message}` };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: `Database Connection Failed: ${err.message}` };
  }
};

export const updateStudentUserInDb = async (userId, updates) => {
  if (!isSupabaseConfigured) {
    if (!isDev) {
      return { success: false, error: 'Database Unconfigured: Cannot update account without a live Supabase database connection in production.' };
    }
    return { success: true };
  }

  try {
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.username !== undefined) dbUpdates.username = updates.username;
    if (updates.password !== undefined) dbUpdates.password = updates.password;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.level !== undefined) dbUpdates.level = updates.level;
    if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
    if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
    if (updates.mustChangePassword !== undefined) dbUpdates.must_change_password = updates.mustChangePassword;

    if (Object.keys(dbUpdates).length > 0) {
      const { error } = await supabase.from('users').update(dbUpdates).eq('id', userId);
      if (error) {
        return { success: false, error: `Database Update Failed: ${error.message}` };
      }
    }

    if (updates.completedLessonIds !== undefined && Array.isArray(updates.completedLessonIds)) {
      try {
        if (updates.completedLessonIds.length > 0) {
          const progressRows = updates.completedLessonIds.map(lessonId => ({
            student_id: userId,
            lesson_id: lessonId
          }));
          await supabase.from('student_lesson_progress').upsert(progressRows, { onConflict: 'student_id,lesson_id' });
        }
      } catch (err) {
        console.warn('Could not persist student_lesson_progress in Supabase:', err);
      }
    }

    if (updates.assignedLessonIds !== undefined && Array.isArray(updates.assignedLessonIds)) {
      try {
        if (updates.assignedLessonIds.length > 0) {
          const accessRows = updates.assignedLessonIds.map(lessonId => ({
            student_id: userId,
            lesson_id: lessonId
          }));
          await supabase.from('student_lesson_access').upsert(accessRows, { onConflict: 'student_id,lesson_id' });
        }
      } catch (err) {
        console.warn('Could not persist student_lesson_access in Supabase:', err);
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: `Database Connection Error: ${err.message}` };
  }
};

export const deleteStudentUserInDb = async (userId) => {
  if (!isSupabaseConfigured) {
    if (!isDev) {
      return { success: false, error: 'Database Unconfigured: Cannot delete account without a live Supabase database connection in production.' };
    }
    return { success: true };
  }

  try {
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) {
      return { success: false, error: `Database Delete Failed: ${error.message}` };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: `Database Connection Error: ${err.message}` };
  }
};
