import { supabase, isSupabaseConfigured } from './supabaseClient';

export async function fetchLessonsFromSupabase() {
  if (!isSupabaseConfigured) {
    return { lessons: [], error: 'Database Connection Error: Database is offline or non-configured.' };
  }

  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      return { lessons: [], error: `Database Fetch Error: Unable to retrieve lessons (${error.message}).` };
    }

    if (!Array.isArray(data) || data.length === 0) {
      return { lessons: [], error: 'Database returned no lesson records.' };
    }

    const mappedLessons = data.map(l => ({
      id: l.id,
      order: Number(l.order_index),
      unit: l.unit,
      title: l.title,
      description: l.description,
      type: l.type,
      pairedVocabId: l.paired_vocab_id,
      pairedQuizId: l.paired_quiz_id,
      status: l.status,
      words: Array.isArray(l.words) ? l.words : []
    }));

    return { lessons: mappedLessons, error: null };
  } catch (err) {
    return { lessons: [], error: `Database Connection Error: ${err.message || 'Failed to communicate with Supabase database.'}` };
  }
}

export async function updateLessonInDb(lesson) {
  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const dbPayload = {
      title: lesson.title,
      type: lesson.type,
      words: Array.isArray(lesson.words) ? lesson.words : [],
      order_index: lesson.order || 1
    };

    const { error } = await supabase
      .from('lessons')
      .update(dbPayload)
      .eq('id', lesson.id);

    if (error) {
      console.error('Database Lesson Update Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Database Connection Error while updating lesson:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Calculates dynamic pathway nodes for a student:
 * 1. Only assigned lessons are displayed.
 * 2. Vocab lessons complete upon opening and are non-blocking.
 * 3. Vocab Quiz lessons block subsequent lessons if incomplete. Completing a quiz auto-completes its paired vocab.
 */
export function getStudentPathwayNodes(
  assignedLessonIds = [],
  completedLessonIds = [],
  lessons = []
) {
  const sortedLessons = [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Filter only assigned lessons
  const assignedLessons = sortedLessons.filter(l => assignedLessonIds.includes(l.id));

  // Determine locking state based on vocab quiz completion
  let allPrecedingQuizzesCompleted = true;

  return assignedLessons.map((lesson) => {
    const isCompleted = completedLessonIds.includes(lesson.id);

    let nodeStatus = 'locked';

    if (isCompleted) {
      nodeStatus = 'completed';
    } else if (allPrecedingQuizzesCompleted) {
      nodeStatus = 'active';
    } else {
      nodeStatus = 'locked';
    }

    // If this lesson is a vocab quiz and it is NOT completed, subsequent lessons will be locked
    if (lesson.type === 'vocab quiz' && !isCompleted) {
      allPrecedingQuizzesCompleted = false;
    }

    return {
      ...lesson,
      nodeStatus
    };
  });
}

/**
 * Calculates complete student pathway domain model:
 * Encapsulates pathway node graph, lock sequencing, completion count metrics,
 * progress percentage calculation, and active node resolution.
 */
export function getStudentPathway(
  assignedLessonIds = [],
  completedLessonIds = [],
  lessons = []
) {
  const nodes = getStudentPathwayNodes(assignedLessonIds, completedLessonIds, lessons);
  const totalLessons = nodes.length;
  const completedCount = nodes.filter(n => completedLessonIds.includes(n.id)).length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const topmostIncompleteLesson = nodes.find(n => !completedLessonIds.includes(n.id)) || null;

  return {
    nodes,
    totalLessons,
    completedCount,
    progressPercentage,
    topmostIncompleteLesson
  };
}
