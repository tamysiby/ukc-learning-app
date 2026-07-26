import { render, screen, fireEvent } from '@testing-library/react';
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
  it('renders lesson management header and default platform lessons', () => {
    renderWithAuth(<AdminLessonManagement />);
    expect(screen.getByText('Lesson Management')).toBeInTheDocument();
    expect(screen.getAllByText(/한글 모음/i)[0]).toBeInTheDocument();
  });

  it('opens manage student access modal when button is clicked', () => {
    renderWithAuth(<AdminLessonManagement />);
    const manageBtns = screen.getAllByRole('button', { name: /Access|Manage Access/i });
    expect(manageBtns.length).toBeGreaterThan(0);

    fireEvent.click(manageBtns[0]);
    expect(screen.getByText(/Lesson Access Assignment/i)).toBeInTheDocument();
  });
});
