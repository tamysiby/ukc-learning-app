import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initial Stateful Mock Data for standalone execution
export const initialMockUsers = [
  {
    id: 'usr-1',
    name: 'Min-ji Kim',
    email: 'minji.kim@ukc.edu',
    role: 'Student',
    status: 'Active',
    level: 'Intermediate (Level 3)',
    progress: 78,
    streak: 14,
    lastActive: '10 mins ago',
    joinedDate: '2026-01-15',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    name: 'Ji-hoon Park',
    email: 'jihoon.park@ukc.edu',
    role: 'Student',
    status: 'Active',
    level: 'Beginner (Level 1)',
    progress: 42,
    streak: 5,
    lastActive: '2 hours ago',
    joinedDate: '2026-03-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-3',
    name: 'Soo-jin Lee',
    email: 'soojin.lee@ukc.edu',
    role: 'Student',
    status: 'Inactive',
    level: 'Advanced (Level 5)',
    progress: 95,
    streak: 0,
    lastActive: '4 days ago',
    joinedDate: '2025-11-10',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-4',
    name: 'Tae-hyun Choi',
    email: 'taehyun.admin@ukc.edu',
    role: 'Admin',
    status: 'Active',
    level: 'Staff Administrator',
    progress: 100,
    streak: 45,
    lastActive: 'Just now',
    joinedDate: '2025-08-01',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-5',
    name: 'Eun-ji Choi',
    email: 'eunji.choi@ukc.edu',
    role: 'Student',
    status: 'Active',
    level: 'Elementary (Level 2)',
    progress: 60,
    streak: 9,
    lastActive: '1 hour ago',
    joinedDate: '2026-02-14',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
  }
];

export const mockFlashcards = [
  {
    id: 'fc-1',
    korean: '안녕하세요',
    romanization: 'An-nyeong-ha-se-yo',
    english: 'Hello / Good day (Formal)',
    category: 'Greetings',
    audioUrl: '',
    exampleSentence: '안녕하세요! 만나서 반갑습니다.',
    exampleTranslation: 'Hello! Nice to meet you.'
  },
  {
    id: 'fc-2',
    korean: '감사합니다',
    romanization: 'Gam-sa-ham-ni-da',
    english: 'Thank you (Formal)',
    category: 'Etiquette',
    audioUrl: '',
    exampleSentence: '도와주셔서 감사합니다.',
    exampleTranslation: 'Thank you for helping me.'
  },
  {
    id: 'fc-3',
    korean: '학교',
    romanization: 'Hak-gyo',
    english: 'School',
    category: 'Places & Education',
    audioUrl: '',
    exampleSentence: '저는 아침 일찍 학교에 갑니다.',
    exampleTranslation: 'I go to school early in the morning.'
  },
  {
    id: 'fc-4',
    korean: '학생',
    romanization: 'Hak-saeng',
    english: 'Student',
    category: 'People',
    audioUrl: '',
    exampleSentence: '민지 씨는 열심히 공부하는 학생입니다.',
    exampleTranslation: 'Minji is a student who studies hard.'
  },
  {
    id: 'fc-5',
    korean: '선생님',
    romanization: 'Seon-saeng-nim',
    english: 'Teacher / Instructor',
    category: 'People',
    audioUrl: '',
    exampleSentence: '선생님께 질문을 드렸습니다.',
    exampleTranslation: 'I asked the teacher a question.'
  }
];
