import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminLessonManagement from '../components/AdminLessonManagement';
import { AuthProvider } from '../context/AuthContext';

function renderWithAuth(ui) {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
}

describe('Admin Lesson Management Portal Component', () => {
  it('renders lesson management header and default platform lessons', async () => {
    renderWithAuth(<AdminLessonManagement />);
    expect(screen.getByText('Lesson Management')).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByText(/Hangul Vowels|한글 모음/i)[0]).toBeInTheDocument());
  });

  it('opens manage student access modal when button is clicked', async () => {
    renderWithAuth(<AdminLessonManagement />);
    await waitFor(() => expect(screen.getAllByRole('button', { name: /Access|Manage Access/i }).length).toBeGreaterThan(0));
    const manageBtns = screen.getAllByRole('button', { name: /Access|Manage Access/i });

    fireEvent.click(manageBtns[0]);
    expect(screen.getByText(/Lesson Access Assignment/i)).toBeInTheDocument();
  });
});
