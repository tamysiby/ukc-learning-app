import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const STORAGE_USERS_KEY = 'ukc_app_users_db_v1';
const STORAGE_SESSION_KEY = 'ukc_app_session_v1';

// Default Seed Users (Admin & Students)
export const initialMockUsers = [
  {
    id: 'usr-admin-1',
    name: 'Tae-hyun Choi (Admin)',
    email: 'admin@ukc.edu',
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
    assignedLessonIds: ['les-hangul-1', 'les-vocab-1', 'les-greetings-2', 'les-grammar-3'],
    completedLessonIds: ['les-hangul-1', 'les-vocab-1']
  },
  {
    id: 'usr-1',
    name: 'Min-ji Kim',
    email: 'minji.kim@ukc.edu',
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
    assignedLessonIds: ['les-hangul-1', 'les-vocab-1', 'les-greetings-2'],
    completedLessonIds: ['les-hangul-1']
  },
  {
    id: 'usr-2',
    name: 'Ji-hoon Park',
    email: 'jihoon.park@ukc.edu',
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
    assignedLessonIds: ['les-hangul-1', 'les-vocab-1'],
    completedLessonIds: []
  },
  {
    id: 'usr-3',
    name: 'Soo-jin Lee',
    email: 'soojin.lee@ukc.edu',
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
    assignedLessonIds: ['les-hangul-1'],
    completedLessonIds: []
  },
  {
    id: 'usr-5',
    name: 'Eun-ji Choi',
    email: 'eunji.choi@ukc.edu',
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
    audioUrl: '',
    exampleSentence: '안녕하세요! 만나서 반갑습니다.',
    exampleTranslation: 'Hello! Nice to meet you.'
  },
  {
    id: 'fc-2',
    korean: '감사합니다',
    romanization: 'Gam-sa-ham-ni-da',
    english: 'Thank you (Formal)',
    category: 'Etiquette',
    audioUrl: '',
    exampleSentence: '도와주셔서 감사합니다.',
    exampleTranslation: 'Thank you for helping me.'
  },
  {
    id: 'fc-3',
    korean: '학교',
    romanization: 'Hak-gyo',
    english: 'School',
    category: 'Places & Education',
    audioUrl: '',
    exampleSentence: '저는 아침 일찍 학교에 갑니다.',
    exampleTranslation: 'I go to school early in the morning.'
  },
  {
    id: 'fc-4',
    korean: '학생',
    romanization: 'Hak-saeng',
    english: 'Student',
    category: 'People',
    audioUrl: '',
    exampleSentence: '민지 씨는 열심히 공부하는 학생입니다.',
    exampleTranslation: 'Minji is a student who studies hard.'
  },
  {
    id: 'fc-5',
    korean: '선생님',
    romanization: 'Seon-saeng-nim',
    english: 'Teacher / Instructor',
    category: 'People',
    audioUrl: '',
    exampleSentence: '선생님께 질문을 드렸습니다.',
    exampleTranslation: 'I asked the teacher a question.'
  }
];

// Helper to generate unique session token
export const generateSessionId = () => {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Check if an active session currently exists for an email address
export const checkActiveSessionExists = (email) => {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  const users = getStoredUsers();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);
  return !!(user && (user.isOnline || user.activeSessionId));
};

// User Storage Management
export const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (raw) return JSON.parse(raw);
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

// Authentic Authentication Functions
export const authSignIn = async (email, password) => {
  const cleanEmail = email?.trim().toLowerCase();
  const newSessionId = generateSessionId();

  // Attempt Supabase auth if real URL configured
  const isSupabaseConfigured = import.meta.env?.VITE_SUPABASE_URL && !import.meta.env?.VITE_SUPABASE_URL.includes('placeholder');
  
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (!error && data.user) {
        // Fetch user profile
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        const userObj = {
          ...(profile || {
            id: data.user.id,
            name: data.user.email.split('@')[0],
            email: data.user.email,
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
  const matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!matchedUser) {
    return { user: null, error: 'Account not found. Student accounts must be added by an Administrator.' };
  }

  if (matchedUser.status === 'Inactive') {
    return { user: null, error: 'Account is currently inactive. Please contact your system administrator.' };
  }

  if (matchedUser.password && matchedUser.password !== password) {
    return { user: null, error: 'Invalid password. Please check your credentials and try again.' };
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
