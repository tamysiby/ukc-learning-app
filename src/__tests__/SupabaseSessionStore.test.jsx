import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  updateStudentUserInDb,
  fetchUsersFromSupabase,
  supabase,
  authSignOut,
  saveStoredSession,
  getStoredSession
} from '../services/supabaseClient';

describe('Supabase Database Store & Schema Integrity', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('never sends completed_lesson_ids or assigned_lesson_ids to users table in PATCH requests', async () => {
    const updatePayloads = [];
    const tableQueries = [];

    vi.spyOn(supabase, 'from').mockImplementation((tableName) => {
      tableQueries.push(tableName);
      return {
        update: (payload) => {
          updatePayloads.push({ tableName, payload });
          return {
            eq: () => Promise.resolve({ error: null })
          };
        },
        upsert: () => Promise.resolve({ error: null }),
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null })
        })
      };
    });

    const result = await updateStudentUserInDb('usr-1', {
      name: 'Updated Min-ji',
      completedLessonIds: ['les-vowels-1', 'les-vocab-practice-1'],
      assignedLessonIds: ['les-vowels-1']
    });

    expect(result.success).toBe(true);

    // Verify 'users' table update payload
    const usersTableUpdate = updatePayloads.find(p => p.tableName === 'users');
    expect(usersTableUpdate).toBeDefined();
    expect(usersTableUpdate.payload).toEqual({ name: 'Updated Min-ji' });
    expect(usersTableUpdate.payload.completed_lesson_ids).toBeUndefined();
    expect(usersTableUpdate.payload.assigned_lesson_ids).toBeUndefined();

    // Verify relational tables were queried
    expect(tableQueries).includes('student_lesson_progress');
    expect(tableQueries).includes('student_lesson_access');
  });

  it('correctly maps relational student_lesson_progress into completedLessonIds array', async () => {
    vi.spyOn(supabase, 'from').mockImplementation((tableName) => {
      if (tableName === 'users') {
        return {
          select: () => Promise.resolve({
            data: [
              { id: 'usr-1', username: 'minji.kim', name: 'Min-ji Kim', role: 'Student', status: 'Active' }
            ],
            error: null
          })
        };
      }
      if (tableName === 'student_lesson_progress') {
        return {
          select: () => Promise.resolve({
            data: [
              { student_id: 'usr-1', lesson_id: 'les-vowels-1' },
              { student_id: 'usr-1', lesson_id: 'les-vocab-practice-1' }
            ],
            error: null
          })
        };
      }
      if (tableName === 'student_lesson_access') {
        return {
          select: () => Promise.resolve({
            data: [
              { student_id: 'usr-1', lesson_id: 'les-vowels-1' }
            ],
            error: null
          })
        };
      }
      return { select: () => Promise.resolve({ data: [], error: null }) };
    });

    const res = await fetchUsersFromSupabase();
    expect(res.error).toBeNull();
    expect(res.users).toHaveLength(1);
    expect(res.users[0].completedLessonIds).toEqual(['les-vowels-1', 'les-vocab-practice-1']);
    expect(res.users[0].assignedLessonIds).toEqual(['les-vowels-1']);
  });

  it('authSignOut clears stored session and invalidates active session tokens', async () => {
    saveStoredSession({ id: 'usr-1', username: 'minji.kim' });
    expect(getStoredSession()).not.toBeNull();

    await authSignOut('usr-1');

    expect(getStoredSession()).toBeNull();
  });
});
