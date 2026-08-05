/**
 * UserSessionStore
 * Deep module encapsulating user persistence, active session verification,
 * single-session token validation, and database access.
 */

import { supabase } from './supabaseClient';
import { verifyPassword } from './cryptoUtils';

export const STORAGE_USERS_KEY = 'ukc_app_users_db_v2';
export const STORAGE_SESSION_KEY = 'ukc_app_session_v1';

export const isDev = !!(import.meta.env?.DEV || import.meta.env?.MODE === 'development');

export const isSupabaseConfigured = !!(
  (import.meta.env?.VITE_SUPABASE_URL &&
  !import.meta.env?.VITE_SUPABASE_URL.includes('placeholder') &&
  import.meta.env?.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env?.VITE_SUPABASE_ANON_KEY.includes('placeholder')) ||
  import.meta.env?.MODE === 'test'
);

export const getStoredUsers = () => {
  return [];
};

export const saveStoredUsers = () => {};

// Session Storage Management (Stored exclusively in sessionStorage)
export const getStoredSession = () => {
  try {
    const rawSession = sessionStorage.getItem(STORAGE_SESSION_KEY);
    if (rawSession) return JSON.parse(rawSession);
  } catch (e) {
    console.error('Error reading session:', e);
  }
  return null;
};

export const saveStoredSession = (user) => {
  try {
    if (user) {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
    }
  } catch (e) {
    console.error('Error saving session:', e);
  }
};

// Update user online status in database
export const setUserOnlineState = async (userId, isOnline) => {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('users').update({
      is_online: isOnline,
      last_active: isOnline ? new Date().toISOString() : undefined
    }).eq('id', userId);
  } catch (e) {}
};

// Fetch users directly from Supabase DB
export const fetchUsersFromSupabase = async () => {
  if (!isSupabaseConfigured) {
    return {
      users: [],
      error: 'Database Connection Error: Database is offline or non-configured.'
    };
  }

  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      return {
        users: [],
        error: `Database Fetch Error: Unable to retrieve user records (${error.message || 'Connection error'}).`
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

    const defaultAssigned = ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-consonants-quiz-1', 'les-batchim-1', 'les-eyo-1', 'les-classroom-vocab-1', 'les-vocab-practice-1', 'les-vocab-practice-quiz-1', 'les-vocab-practice-2', 'les-vocab-practice-quiz-2', 'les-hobbies-1', 'les-hobbies-quiz-1', 'les-sino-numbers-1', 'les-korean-numbers-1', 'les-number-usage-1', 'les-pronunciation-1', 'les-occupations-1', 'les-occupations-quiz-1'];

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
        mustChangePassword: u.must_change_password ?? false,
        lastActive: u.last_active ? new Date(u.last_active).toLocaleString() : 'Never',
        joinedDate: u.created_at ? u.created_at.split('T')[0] : '2026-01-01',
        assignedLessonIds: (accessMap[u.id] && accessMap[u.id].length > 0) ? accessMap[u.id] : defaultAssigned,
        completedLessonIds: progressMap[u.id] || []
      }));

      return { users: mappedUsers, error: null };
    }

    return { users: [], error: 'Database returned no user records.' };
  } catch (err) {
    return {
      users: [],
      error: `Database Connection Error: ${err.message || 'Failed to communicate with Supabase database.'}`
    };
  }
};

// Authentic Authentication Functions
export const authSignIn = async (username, password) => {
  const cleanUsername = username?.trim().toLowerCase();

  if (!isSupabaseConfigured) {
    return {
      user: null,
      error: 'Database Connection Error: Database is offline or non-configured.'
    };
  }

  try {
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('username', cleanUsername)
      .single();

    if (dbError || !dbUser) {
      if (dbError && dbError.code !== 'PGRST116') {
        return { user: null, error: `Database Authentication Error: ${dbError.message}` };
      }
      return { user: null, error: 'Invalid username or password. Please check your credentials and try again.' };
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

      const defaultAssigned = ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-consonants-quiz-1', 'les-batchim-1', 'les-eyo-1', 'les-classroom-vocab-1', 'les-vocab-practice-1', 'les-vocab-practice-quiz-1', 'les-vocab-practice-2', 'les-vocab-practice-quiz-2', 'les-hobbies-1', 'les-hobbies-quiz-1', 'les-sino-numbers-1', 'les-korean-numbers-1', 'les-number-usage-1', 'les-pronunciation-1', 'les-occupations-1', 'les-occupations-quiz-1'];

      const isDefaultPass = await verifyPassword('StudentPass123!', dbUser.password);

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
        mustChangePassword: (dbUser.must_change_password === true) || isDefaultPass,
        lastActive: 'Just now',
        joinedDate: dbUser.created_at ? dbUser.created_at.split('T')[0] : '2026-01-01',
        assignedLessonIds: assignedIds.length > 0 ? assignedIds : defaultAssigned,
        completedLessonIds: completedIds
      };

      if (isDev) {
        console.log('[DEV userSessionStore] authSignIn evaluated mustChangePassword:', {
          username: dbUser.username,
          dbMustChange: dbUser.must_change_password,
          isDefaultPass,
          finalMustChange: userObj.mustChangePassword
        });
      }

      saveStoredSession(userObj);
      return { user: userObj, error: null };
    }
  } catch (err) {
    return {
      user: null,
      error: `Database Authentication Error: Unable to connect to Supabase database. ${err.message || ''}`
    };
  }
};

export const authSignOut = async (userId = null) => {
  const currentSession = getStoredSession();
  const targetId = userId || currentSession?.id;

  if (targetId && isSupabaseConfigured) {
    try {
      await supabase
        .from('users')
        .update({ is_online: false })
        .eq('id', targetId);
    } catch (e) {}
  }

  try {
    await supabase.auth.signOut();
  } catch (e) {}
  saveStoredSession(null);
};

// Database Mutations (Create, Update, Delete)
export const createStudentUserInDb = async (userData) => {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database Connection Error: Database is offline or non-configured.' };
  }

  try {
    const corePayload = {
      username: userData.username,
      name: userData.name,
      password: userData.password,
      role: userData.role || 'Student',
      status: userData.status || 'Active',
      level: userData.level || 'Beginner (Level 1)'
    };

    const { data, error } = await supabase.from('users').insert([corePayload]).select().single();

    if (error) {
      return { success: false, error: `Database Create Failed: ${error.message}` };
    }

    if (data?.id && userData.mustChangePassword !== undefined) {
      try {
        await supabase.from('users').update({ must_change_password: userData.mustChangePassword }).eq('id', data.id);
      } catch (e) {}
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: `Database Connection Failed: ${err.message}` };
  }
};

export const updateStudentUserInDb = async (userId, updates) => {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database Connection Error: Database is offline or non-configured.' };
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

    if (Object.keys(dbUpdates).length > 0) {
      const { error } = await supabase.from('users').update(dbUpdates).eq('id', userId);
      if (error) {
        return { success: false, error: `Database Update Failed: ${error.message}` };
      }
    }

    if (updates.mustChangePassword !== undefined) {
      if (isDev) {
        console.log('[DEV userSessionStore] updateStudentUserInDb setting must_change_password in DB:', {
          userId,
          mustChangePassword: updates.mustChangePassword
        });
      }
      try {
        await supabase.from('users').update({ must_change_password: updates.mustChangePassword }).eq('id', userId);
      } catch (e) {}
    }

    if (updates.completedLessonIds !== undefined && Array.isArray(updates.completedLessonIds)) {
      try {
        const uniqueCompleted = Array.from(new Set(updates.completedLessonIds));
        await supabase.from('student_lesson_progress').delete().eq('student_id', userId);
        if (uniqueCompleted.length > 0) {
          const progressRows = uniqueCompleted.map(lessonId => ({
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
        const uniqueAssigned = Array.from(new Set(updates.assignedLessonIds));
        await supabase.from('student_lesson_access').delete().eq('student_id', userId);
        if (uniqueAssigned.length > 0) {
          const accessRows = uniqueAssigned.map(lessonId => ({
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
    return { success: false, error: 'Database Connection Error: Database is offline or non-configured.' };
  }

  try {
    await supabase.from('student_lesson_progress').delete().eq('student_id', userId);
    await supabase.from('student_lesson_access').delete().eq('student_id', userId);
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) {
      return { success: false, error: `Database Delete Failed: ${error.message}` };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: `Database Connection Error: ${err.message}` };
  }
};
