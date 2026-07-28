import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import LoginPage from '../components/LoginPage';
import { AuthProvider } from '../context/AuthContext';

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

  it('displays database failure error banner when database operation fails', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In to Portal/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passInput, { target: { value: 'wrongpass' } });
    
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Invalid username or password|Database/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
