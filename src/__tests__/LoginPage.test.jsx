import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import LoginPage from '../components/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { setUserOnlineState } from '../services/supabaseClient';

describe('LoginPage Component', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders login form with username, password, and submit button', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    expect(screen.getByText('UKC Learning Portal')).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Portal/i })).toBeInTheDocument();
  });

  it('shows error badge when invalid credentials are submitted', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In to Portal/i });

    fireEvent.change(usernameInput, { target: { value: 'unknown_user' } });
    fireEvent.change(passInput, { target: { value: 'wrongpass' } });
    
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows active session warning dialog when logging into an already active account', async () => {
    // Set minji as online in database store
    setUserOnlineState('usr-1', true, 'sess_existing_123');

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const studentDemoBtn = screen.getByRole('button', { name: /Student Login/i });

    await act(async () => {
      fireEvent.click(studentDemoBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Active Session Detected/i)).toBeInTheDocument();
      expect(screen.getByText(/Continuing will log out the older session/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
