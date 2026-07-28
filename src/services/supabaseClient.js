import { createClient } from '@supabase/supabase-js';
import { verifyPassword } from './cryptoUtils';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export {
  STORAGE_USERS_KEY,
  STORAGE_SESSION_KEY,
  isDev,
  isSupabaseConfigured,
  initialMockUsers,
  mockFlashcards,
  generateSessionId,
  getStoredUsers,
  saveStoredUsers,
  getStoredSession,
  saveStoredSession,
  setUserOnlineState,
  fetchUsersFromSupabase,
  authSignIn,
  authSignOut,
  createStudentUserInDb,
  updateStudentUserInDb,
  deleteStudentUserInDb
} from './userSessionStore';

