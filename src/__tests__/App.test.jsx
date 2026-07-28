import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App';
import { initialMockUsers, supabase } from '../services/supabaseClient';
import { DEFAULT_LESSONS } from '../services/lessonRegistry';

describe('UKC Learning App Authentic Auth & Protected Navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();

    vi.spyOn(supabase, 'from').mockImplementation((tableName) => {
      if (tableName === 'users') {
        const mockUserList = initialMockUsers.map(u => ({
          ...u,
          is_online: false,
          created_at: u.joinedDate ? `${u.joinedDate}T00:00:00Z` : '2026-01-01T00:00:00Z'
        }));
        const queryObj = {
          then: (resolve, reject) => Promise.resolve({ data: mockUserList, error: null }).then(resolve, reject),
          eq: (field, val) => ({
            single: () => {
              const user = mockUserList.find(u => u[field]?.toLowerCase() === String(val).toLowerCase());
              return Promise.resolve({ data: user || null, error: user ? null : { code: 'PGRST116', message: 'Not found' } });
            }
          })
        };
        return {
          select: () => queryObj,
          update: () => ({ eq: () => Promise.resolve({ error: null }) })
        };
      }
      if (tableName === 'lessons') {
        return {
          select: () => ({
            order: () => Promise.resolve({
              data: DEFAULT_LESSONS.map(l => ({
                ...l,
                order_index: l.order,
                paired_vocab_id: l.pairedVocabId,
                paired_quiz_id: l.pairedQuizId
              })),
              error: null
            })
          })
        };
      }
      return {
        select: () => Promise.resolve({ data: [], error: null }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) })
      };
    });
  });

  it('renders landing login page when unauthenticated', () => {
    render(<App />);
    expect(screen.getByText('UKC Learning Portal')).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Portal/i })).toBeInTheDocument();
  });

  it('logs in as Admin via quick demo shortcut and renders Admin User Management', async () => {
    render(<App />);
    
    const adminDemoBtn = screen.getByRole('button', { name: /Admin Login/i });
    fireEvent.click(adminDemoBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/User Management/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/Admin Portal/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Test logout button returns to login page
    const logoutBtn = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign In to Portal/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('logs in as Student via quick demo shortcut and renders Student Lesson Pathway', async () => {
    render(<App />);
    
    const studentDemoBtn = screen.getByRole('button', { name: /Student Login/i });
    fireEvent.click(studentDemoBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/한글 모음/i)[0]).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
