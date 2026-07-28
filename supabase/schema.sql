-- ==========================================
-- UKC Learning App - Supabase Database Schema & Migration
-- ==========================================

-- 1. Enable UUID & Cryptographic Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------
-- 2. USERS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL DEFAULT 'StudentPass123!',
    role TEXT NOT NULL CHECK (role IN ('Student', 'Admin')) DEFAULT 'Student',
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    level TEXT NOT NULL DEFAULT 'Beginner (Level 1)',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    streak INTEGER DEFAULT 0 CHECK (streak >= 0),
    is_online BOOLEAN DEFAULT false,
    must_change_password BOOLEAN DEFAULT false,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lookup
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access to users" ON public.users FOR ALL USING (true);

-- ------------------------------------------
-- 3. LESSONS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    order_index NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('vocab', 'vocab quiz', 'custom')),
    paired_vocab_id TEXT,
    paired_quiz_id TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Draft')),
    words JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access to lessons" ON public.lessons FOR ALL USING (true);

-- ------------------------------------------
-- 4. STUDENT LESSON ACCESS TABLE (Batch Assignment)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_lesson_access (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    student_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

ALTER TABLE public.student_lesson_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated access to access table" ON public.student_lesson_access FOR ALL USING (true);

-- ------------------------------------------
-- 5. STUDENT LESSON PROGRESS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_lesson_progress (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    student_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    score INTEGER DEFAULT 0,
    UNIQUE(student_id, lesson_id)
);

ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated access to progress table" ON public.student_lesson_progress FOR ALL USING (true);

-- ------------------------------------------
-- 6. SEED DATA FOR LESSONS
-- ------------------------------------------
INSERT INTO public.lessons (id, order_index, unit, title, description, type, paired_quiz_id, paired_vocab_id, status, words) VALUES
('les-vowels-1', 1, 'Unit 1: Hangul & Korean Basics', '한글 모음', 'Learn fundamental Korean vowel characters and sound pronunciations.', 'vocab', 'les-vowels-quiz-1', NULL, 'Active', '[
  {"id": "v-1", "korean": "ㅏ", "romanization": "a", "english": "a", "category": "Vowels"},
  {"id": "v-2", "korean": "ㅓ", "romanization": "eo", "english": "eo", "category": "Vowels"},
  {"id": "v-3", "korean": "ㅗ", "romanization": "o", "english": "o", "category": "Vowels"},
  {"id": "v-4", "korean": "ㅜ", "romanization": "u", "english": "u", "category": "Vowels"},
  {"id": "v-5", "korean": "ㅡ", "romanization": "eu", "english": "eu", "category": "Vowels"},
  {"id": "v-6", "korean": "ㅣ", "romanization": "i", "english": "i", "category": "Vowels"}
]'::jsonb),
('les-vowels-quiz-1', 2, 'Unit 1: Hangul & Korean Basics', '한글 모음 퀴즈', 'Test your knowledge on Korean vowels and vocabulary.', 'vocab quiz', NULL, 'les-vowels-1', 'Active', '[]'::jsonb),
('les-consonants-1', 3, 'Unit 1: Hangul & Korean Basics', '한글 자음', 'Learn basic Korean consonants and consonant vocabulary.', 'vocab', 'les-consonants-quiz-1', NULL, 'Active', '[
  {"id": "c-1", "korean": "ㄱ", "romanization": "g", "english": "g", "category": "Consonants"},
  {"id": "c-2", "korean": "ㄴ", "romanization": "n", "english": "n", "category": "Consonants"},
  {"id": "c-3", "korean": "ㄷ", "romanization": "d", "english": "d", "category": "Consonants"}
]'::jsonb),
('les-consonants-quiz-1', 4, 'Unit 1: Hangul & Korean Basics', '한글 자음 퀴즈', 'Test your knowledge on Korean consonants and vocabulary.', 'vocab quiz', NULL, 'les-consonants-1', 'Active', '[]'::jsonb),
('les-batchim-1', 4.5, 'Unit 1: Hangul & Korean Basics', '자음 4: 받침', 'Learn the concept of 받침 (final consonants) and the 7 representative sound groups.', 'custom', NULL, NULL, 'Active', '[
  {"id": "bat-1", "korean": "밥", "romanization": "bap", "english": "rice", "category": "ㅂ [p]"},
  {"id": "bat-21", "korean": "당근", "romanization": "dang-geun", "english": "carrot", "category": "ㅇ / ㄴ"}
]'::jsonb),
('les-eyo-1', 4.6, 'Unit 1: Hangul & Korean Basics', '입니다 & 이에요/예요', 'Learn sentence endings: 받침 O + 이에요 / 받침 X + 예요 and formal 입니다/입니까?.', 'custom', NULL, NULL, 'Active', '[
  {"id": "eyo-1", "korean": "가방이에요", "romanization": "ga-bang-i-e-yo", "english": "it''s a bag", "category": "받침 O"},
  {"id": "eyo-2", "korean": "의자예요", "romanization": "ui-ja-ye-yo", "english": "it''s a chair", "category": "받침 X"}
]'::jsonb),
('les-vocab-practice-1', 5, 'Unit 1: Hangul & Korean Basics', '단어연습 1', 'Essential Korean vocabulary reading practice (No 받침).', 'vocab', 'les-vocab-practice-quiz-1', NULL, 'Active', '[]'::jsonb),
('les-vocab-practice-quiz-1', 6, 'Unit 1: Hangul & Korean Basics', '단어연습 1 퀴즈', 'Test your vocabulary knowledge on 단어연습1.', 'vocab quiz', NULL, 'les-vocab-practice-1', 'Active', '[]'::jsonb),
('les-vocab-practice-2', 7, 'Unit 1: Hangul & Korean Basics', '단어연습 2', 'Korean vocabulary reading practice with 받침.', 'vocab', 'les-vocab-practice-quiz-2', NULL, 'Active', '[]'::jsonb),
('les-vocab-practice-quiz-2', 8, 'Unit 1: Hangul & Korean Basics', '단어연습 2 퀴즈', 'Test your vocabulary knowledge on 단어연습2.', 'vocab quiz', NULL, 'les-vocab-practice-2', 'Active', '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  type = EXCLUDED.type,
  words = EXCLUDED.words;

-- ------------------------------------------
-- 7. SEED DATA FOR USERS
-- ------------------------------------------
INSERT INTO public.users (id, username, name, password, role, status, level, progress, streak) VALUES
('usr-admin-1', 'admin', 'Tae-hyun Choi (Admin)', crypt('AdminPass123!', gen_salt('bf')), 'Admin', 'Active', 'Staff Administrator', 100, 45),
('usr-1', 'minji.kim', 'Min-ji Kim', crypt('StudentPass123!', gen_salt('bf')), 'Student', 'Active', 'Intermediate (Level 3)', 78, 14),
('usr-2', 'jihoon.park', 'Ji-hoon Park', crypt('StudentPass123!', gen_salt('bf')), 'Student', 'Active', 'Beginner (Level 1)', 42, 5),
('usr-3', 'soojin.lee', 'Soo-jin Lee', crypt('StudentPass123!', gen_salt('bf')), 'Student', 'Inactive', 'Advanced (Level 5)', 95, 0),
('usr-5', 'eunji.choi', 'Eun-ji Choi', crypt('StudentPass123!', gen_salt('bf')), 'Student', 'Active', 'Elementary (Level 2)', 60, 9)
ON CONFLICT (id) DO NOTHING;
