-- ==========================================
-- UKC Learning App - Complete Supabase Schema
-- Project Reference: znmtrfujrebzrurwubly
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------
-- 1. PROFILES TABLE (Linked to auth.users)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Admin', 'Student')) DEFAULT 'Student',
    status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    level TEXT NOT NULL DEFAULT 'Beginner (Level 1)',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    streak INTEGER DEFAULT 0 CHECK (streak >= 0),
    avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by email & role
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies:
-- Allow authenticated users to read their own profile OR allow Admins to read all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING (
        (auth.jwt() ->> 'role' = 'service_role') OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Admin'
        ) OR
        id = auth.uid()
    );

-- Allow Admins to insert new profiles
CREATE POLICY "Admins can insert profiles" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Admin'
        ) OR id = auth.uid()
    );

-- Allow users to update their own profile OR Admins to update any profile
CREATE POLICY "Users and Admins can update profiles" ON public.profiles
    FOR UPDATE TO authenticated
    USING (
        id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- Allow Admins to delete profiles
CREATE POLICY "Admins can delete profiles" ON public.profiles
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'Admin'
        )
    );

-- ------------------------------------------
-- 2. AUTOMATIC USER PROFILE TRIGGER
-- ------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role, level, status)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'Student'),
        COALESCE(NEW.raw_user_meta_data->>'level', 'Beginner (Level 1)'),
        'Active'
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------
-- 3. CURRICULUM UNITS & LESSONS TABLES
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.units (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    level TEXT NOT NULL,
    description TEXT,
    order_num INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    unit_id TEXT REFERENCES public.units(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('hangul_interactive', 'vocab_flashcard', 'quiz')),
    order_num INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ready_for_build',
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view units" ON public.units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT TO authenticated USING (true);

-- ------------------------------------------
-- 4. STUDENT LESSON PROGRESS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    score INTEGER DEFAULT 0,
    mastered_cards JSONB DEFAULT '[]'::jsonb,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view and manage their own progress" ON public.student_progress
    FOR ALL TO authenticated
    USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin'));

-- ------------------------------------------
-- 5. INITIAL SEED DATA FOR UNITS & LESSONS
-- ------------------------------------------
INSERT INTO public.units (id, title, level, description, order_num) VALUES
('unit-1', 'Korean Foundations', 'Beginner (Level 1)', 'Master core alphabet, daily nouns, verbs, and etiquette phrases.', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lessons (id, unit_id, title, type, order_num, status, content_json) VALUES
('les-u1-00', 'unit-1', 'Introduction to Hangul (Korean Alphabet)', 'hangul_interactive', 0, 'ready_for_build', '{
  "consonants": [
    {"char": "ㄱ", "name": "Giyeok", "sound": "g/k"},
    {"char": "ㄴ", "name": "Nieun", "sound": "n"},
    {"char": "ㄷ", "name": "Digeut", "sound": "d/t"},
    {"char": "ㄹ", "name": "Rieul", "sound": "r/l"},
    {"char": "ㅁ", "name": "Mieum", "sound": "m"},
    {"char": "ㅂ", "name": "Bieup", "sound": "b/p"},
    {"char": "ㅅ", "name": "Siot", "sound": "s"},
    {"char": "ㅇ", "name": "Ieung", "sound": "silent / ng"},
    {"char": "ㅈ", "name": "Jieut", "sound": "j"},
    {"char": "ㅎ", "name": "Hieut", "sound": "h"}
  ],
  "vowels": [
    {"char": "ㅏ", "sound": "a"},
    {"char": "ㅓ", "sound": "eo"},
    {"char": "ㅗ", "sound": "o"},
    {"char": "ㅜ", "sound": "u"},
    {"char": "ㅡ", "sound": "eu"},
    {"char": "ㅣ", "sound": "i"}
  ],
  "practiceBlocks": [
    {"hangul": "가", "romanization": "ga", "components": ["ㄱ", "ㅏ"]},
    {"hangul": "나", "romanization": "na", "components": ["ㄴ", "ㅏ"]},
    {"hangul": "다", "romanization": "da", "components": ["ㄷ", "ㅏ"]},
    {"hangul": "아", "romanization": "a", "components": ["ㅇ", "ㅏ"]},
    {"hangul": "한국", "romanization": "Han-guk", "meaning": "Korea", "components": ["한", "국"]}
  ]
}'::jsonb),
('les-u1-01', 'unit-1', 'Greetings & Manners', 'vocab_flashcard', 1, 'completed', '{
  "flashcards": [
    {"id": "fc-g1", "korean": "안녕하세요", "romanization": "An-nyeong-ha-se-yo", "english": "Hello / Good day (Formal)", "category": "Greetings", "exampleSentence": "안녕하세요! 반갑습니다.", "exampleTranslation": "Hello! Nice to meet you."},
    {"id": "fc-g2", "korean": "안녕히 가세요", "romanization": "An-nyeong-hi ga-se-yo", "english": "Goodbye (to someone leaving)", "category": "Etiquette", "exampleSentence": "안녕히 가세요, 조심히 들어가세요.", "exampleTranslation": "Goodbye, get home safely."}
  ]
}'::jsonb),
('les-u1-02', 'unit-1', 'Essential Daily Vocabulary', 'vocab_flashcard', 2, 'active', '{
  "flashcards": [
    {"id": "fc-1", "korean": "안녕하세요", "romanization": "An-nyeong-ha-se-yo", "english": "Hello / Good day (Formal)", "category": "Greetings", "exampleSentence": "안녕하세요! 만나서 반갑습니다.", "exampleTranslation": "Hello! Nice to meet you."},
    {"id": "fc-2", "korean": "감사합니다", "romanization": "Gam-sa-ham-ni-da", "english": "Thank you (Formal)", "category": "Etiquette", "exampleSentence": "도와주셔서 감사합니다.", "exampleTranslation": "Thank you for helping me."},
    {"id": "fc-3", "korean": "학교", "romanization": "Hak-gyo", "english": "School", "category": "Places & Education", "exampleSentence": "저는 아침 일찍 학교에 갑니다.", "exampleTranslation": "I go to school early in the morning."},
    {"id": "fc-4", "korean": "학생", "romanization": "Hak-saeng", "english": "Student", "category": "People", "exampleSentence": "민지 씨는 열심히 공부하는 학생입니다.", "exampleTranslation": "Minji is a student who studies hard."},
    {"id": "fc-5", "korean": "선생님", "romanization": "Seon-saeng-nim", "english": "Teacher / Instructor", "category": "People", "exampleSentence": "선생님께 질문을 드렸습니다.", "exampleTranslation": "I asked the teacher a question."}
  ]
}'::jsonb),
('les-u1-03', 'unit-1', 'School & Education Words', 'vocab_flashcard', 3, 'ready_for_build', '{
  "flashcards": [
    {"id": "fc-se1", "korean": "책상", "romanization": "Chaek-sang", "english": "Desk", "category": "Classroom", "exampleSentence": "책상 위에 책이 있습니다.", "exampleTranslation": "There is a book on the desk."},
    {"id": "fc-se2", "korean": "의자", "romanization": "Ui-ja", "english": "Chair", "category": "Classroom", "exampleSentence": "의자에 앉으세요.", "exampleTranslation": "Please sit on the chair."},
    {"id": "fc-se3", "korean": "연필", "romanization": "Yeon-pil", "english": "Pencil", "category": "Supplies", "exampleSentence": "연필로 글씨를 씁니다.", "exampleTranslation": "I write with a pencil."},
    {"id": "fc-se4", "korean": "교실", "romanization": "Gyo-sil", "english": "Classroom", "category": "Campus", "exampleSentence": "학생들이 교실에 있습니다.", "exampleTranslation": "Students are in the classroom."},
    {"id": "fc-se5", "korean": "공부하다", "romanization": "Gong-bu-ha-da", "english": "To study", "category": "Verbs", "exampleSentence": "도서관에서 공부합니다.", "exampleTranslation": "I study in the library."}
  ]
}'::jsonb),
('quiz-u1', 'unit-1', 'Unit 1 Master Quiz', 'quiz', 4, 'ready_for_build', '{
  "passingScore": 80,
  "questions": [
    {"id": "u1-q1", "type": "multiple_choice", "prompt": "What is the correct formal phrase for ''Thank you''?", "options": ["감사합니다", "학교", "교실", "의자"], "correctIndex": 0},
    {"id": "u1-q2", "type": "multiple_choice", "prompt": "What is the English meaning of ''선생님''?", "options": ["Student", "Teacher", "Pencil", "Desk"], "correctIndex": 1},
    {"id": "u1-q3", "type": "multiple_choice", "prompt": "Complete: ''저는 _____에 갑니다.'' (I go to school.)", "options": ["학교", "안녕하세요", "반갑습니다", "연필"], "correctIndex": 0},
    {"id": "u1-q4", "type": "multiple_choice", "prompt": "Which phrase do you use when YOU leave while the host stays?", "options": ["안녕히 계세요", "안녕히 가세요", "감사합니다", "공부하다"], "correctIndex": 0},
    {"id": "u1-q5", "type": "multiple_choice", "prompt": "Complete: ''도서관에서 _____.'' (I study in the library.)", "options": ["공부합니다", "선생님", "학생", "책상"], "correctIndex": 0}
  ]
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
