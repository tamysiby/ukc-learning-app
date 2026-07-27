import { createClient } from '@supabase/supabase-js';
import { verifyPassword } from './cryptoUtils';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const STORAGE_USERS_KEY = 'ukc_app_users_db_v2';
const STORAGE_SESSION_KEY = 'ukc_app_session_v1';

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
    activeSessionId: null,
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
    activeSessionId: null,
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
    activeSessionId: null,
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
    activeSessionId: null,
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
    activeSessionId: null,
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

// Helper to generate unique session token
export const generateSessionId = () => {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Check if an active session currently exists for a username
export const checkActiveSessionExists = (username) => {
  if (!username) return false;
  const cleanUsername = username.trim().toLowerCase();
  const users = getStoredUsers();
  const user = users.find(u => u.username?.toLowerCase() === cleanUsername);
  return !!(user && (user.isOnline || user.activeSessionId));
};

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
export const setUserOnlineState = (userId, isOnline, sessionId = null) => {
  const users = getStoredUsers();
  const updatedList = users.map(u => {
    if (u.id === userId) {
      return {
        ...u,
        isOnline: isOnline,
        lastActive: isOnline ? 'Just now' : u.lastActive,
        activeSessionId: isOnline ? (sessionId || u.activeSessionId) : null
      };
    }
    return u;
  });
  saveStoredUsers(updatedList);
  return updatedList;
};

export const isSupabaseConfigured = !!(
  import.meta.env?.VITE_SUPABASE_URL &&
  !import.meta.env?.VITE_SUPABASE_URL.includes('placeholder') &&
  import.meta.env?.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env?.VITE_SUPABASE_ANON_KEY.includes('placeholder')
);

// Fetch users directly from Supabase DB (with fallback to local storage)
export const fetchUsersFromSupabase = async () => {
  if (!isSupabaseConfigured) {
    return getStoredUsers();
  }

  try {
    const { data, error } = await supabase.from('users').select('*');
    if (!error && Array.isArray(data) && data.length > 0) {
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
        assignedLessonIds: u.assigned_lesson_ids || ['les-vowels-1', 'les-vowels-quiz-1', 'les-consonants-1', 'les-consonants-quiz-1', 'les-batchim-1', 'les-eyo-1', 'les-vocab-practice-1', 'les-vocab-practice-quiz-1', 'les-vocab-practice-2', 'les-vocab-practice-quiz-2'],
        completedLessonIds: u.completed_lesson_ids || []
      }));
      saveStoredUsers(mappedUsers);
      return mappedUsers;
    }
  } catch (err) {
    console.warn('Failed to fetch users from Supabase DB, using local store fallback:', err);
  }

  return getStoredUsers();
};

// Authentic Authentication Functions
export const authSignIn = async (username, password) => {
  const cleanUsername = username?.trim().toLowerCase();
  const newSessionId = generateSessionId();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanUsername, password });
      if (!error && data.user) {
        // Fetch user profile
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        const userObj = {
          ...(profile || {
            id: data.user.id,
            name: data.user.email ? data.user.email.split('@')[0] : cleanUsername,
            username: cleanUsername,
            role: data.user.user_metadata?.role || 'Student',
            status: 'Active',
            level: 'Beginner (Level 1)'
          }),
          isOnline: true,
          activeSessionId: newSessionId,
          lastActive: 'Just now'
        };
        
        // Update profile online state in Supabase
        await supabase.from('profiles').update({ last_active: new Date().toISOString() }).eq('id', data.user.id);
        
        setUserOnlineState(userObj.id, true, newSessionId);
        saveStoredSession(userObj);
        return { user: userObj, error: null };
      }
    } catch (err) {
      console.warn('Supabase auth failed, trying local store:', err);
    }
  }

  // Local fallback authentication
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
    activeSessionId: newSessionId,
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
    setUserOnlineState(targetId, false, null);
  }

  try {
    await supabase.auth.signOut();
  } catch (e) {
    // Ignore offline errors
  }
  saveStoredSession(null);
};
