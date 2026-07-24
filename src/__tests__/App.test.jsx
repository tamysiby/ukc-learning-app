import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

describe('UKC Learning App Authentic Auth & Protected Navigation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders landing login page when unauthenticated', () => {
    render(<App />);
    expect(screen.getByText('UKC Learning Portal')).toBeInTheDocument();
    expect(screen.getByText(/Sign in to your learning dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Portal/i })).toBeInTheDocument();
  });

  it('logs in as Admin via quick demo shortcut and renders Admin User Management', async () => {
    render(<App />);
    
    const adminDemoBtn = screen.getByRole('button', { name: /Admin Login/i });
    fireEvent.click(adminDemoBtn);

    await waitFor(() => {
      expect(screen.getByText(/User Management/i)).toBeInTheDocument();
      expect(screen.getByText(/Admin Portal/i)).toBeInTheDocument();
    });

    // Test logout button returns to login page
    const logoutBtn = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign In to Portal/i })).toBeInTheDocument();
    });
  });

  it('logs in as Student via quick demo shortcut and renders Student Lesson Pathway', async () => {
    render(<App />);
    
    const studentDemoBtn = screen.getByRole('button', { name: /Student Login/i });
    fireEvent.click(studentDemoBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/KOREAN FOUNDATIONS/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/Unit 3: Essential Vocabulary/i)).toBeInTheDocument();
    });
  });
});
