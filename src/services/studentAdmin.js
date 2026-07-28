/**
 * StudentAdmin Service
 * Deep administrative domain module for student account filtering, progress statistics,
 * and batch lesson access control assignments.
 */

export function filterUsers(users = [], { searchQuery = '', roleFilter = 'All', statusFilter = 'All' } = {}) {
  const query = searchQuery.trim().toLowerCase();
  return users.filter(user => {
    const matchesSearch = !query || 
      user.name?.toLowerCase().includes(query) ||
      (user.username && user.username.toLowerCase().includes(query));
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All'
      ? true
      : statusFilter === 'Online'
        ? !!user.isOnline
        : user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });
}

export function getStudentProgressStats(user) {
  if (!user) return { assignedCount: 0, completedCount: 0, percentage: 0 };
  const assigned = user.assignedLessonIds || ['les-vowels-1', 'les-vowels-quiz-1'];
  const completed = user.completedLessonIds || [];
  const assignedCount = assigned.length;
  const completedCount = completed.filter(id => assigned.includes(id)).length;
  const percentage = assignedCount > 0 ? Math.round((completedCount / assignedCount) * 100) : 0;
  return { assignedCount, completedCount, percentage };
}

export function toggleAllStudentLessons(user, availableLessons = []) {
  if (!user) return [];
  const currentAssigned = user.assignedLessonIds || [];
  const areAllAssigned = availableLessons.length > 0 && availableLessons.every(l => currentAssigned.includes(l.id));
  return areAllAssigned ? [] : availableLessons.map(l => l.id);
}

export function toggleStudentLessonAssignment(user, lessonId) {
  if (!user) return [];
  const currentAssigned = user.assignedLessonIds || ['les-vowels-1', 'les-vowels-quiz-1'];
  if (currentAssigned.includes(lessonId)) {
    return currentAssigned.filter(id => id !== lessonId);
  }
  return [...currentAssigned, lessonId];
}
