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
('les-classroom-vocab-1', 4.7, 'Unit 1: Hangul & Korean Basics', 'Classroom Vocab (교실용어)', 'Essential classroom expressions, phrases, and commands in Korean.', 'custom', NULL, NULL, 'Active', '[
  {"id": "cr-1", "korean": "보세요", "romanization": "bo-se-yo", "english": "please look", "category": "Commands"},
  {"id": "cr-2", "korean": "들으세요", "romanization": "deu-reu-se-yo", "english": "please listen", "category": "Commands"},
  {"id": "cr-3", "korean": "읽으세요", "romanization": "il-geu-se-yo", "english": "please read", "category": "Commands"},
  {"id": "cr-4", "korean": "쓰세요", "romanization": "sseu-se-yo", "english": "please write", "category": "Commands"},
  {"id": "cr-5", "korean": "말하세요", "romanization": "mal-ha-se-yo", "english": "please speak", "category": "Commands"},
  {"id": "cr-6", "korean": "외우세요", "romanization": "oe-u-se-yo", "english": "please memorize", "category": "Commands"},
  {"id": "cr-7", "korean": "듣고 따라하세요", "romanization": "deud-go tta-ra-ha-se-yo", "english": "listen and repeat", "category": "Commands"},
  {"id": "cr-8", "korean": "듣고 대답하세요", "romanization": "deud-go dae-dap-ha-se-yo", "english": "listen and answer", "category": "Commands"},
  {"id": "cr-9", "korean": "질문 있어요?", "romanization": "jil-mun is-seo-yo?", "english": "do you have any questions?", "category": "Questions"},
  {"id": "cr-10", "korean": "친구에게 물어보세요", "romanization": "chin-gu-e-ge mu-reo-bo-se-yo", "english": "ask your friend", "category": "Commands"},
  {"id": "cr-11", "korean": "무슨 뜻이에요?", "romanization": "mu-seun tteus-i-e-yo?", "english": "what does it mean?", "category": "Questions"},
  {"id": "cr-12", "korean": "한국말로 뭐예요?", "romanization": "han-gug-mal-ro mweo-ye-yo?", "english": "how do you say it in Korean?", "category": "Questions"},
  {"id": "cr-13", "korean": "알겠어요?", "romanization": "al-ges-seo-yo?", "english": "do you understand?", "category": "Questions"},
  {"id": "cr-14", "korean": "네, 알아요.", "romanization": "ne, al-a-yo", "english": "yes, i understand", "category": "Answers"},
  {"id": "cr-15", "korean": "아니요, 몰라요.", "romanization": "a-ni-yo, mol-la-yo", "english": "no, i don''t know", "category": "Answers"},
  {"id": "cr-16", "korean": "같아요", "romanization": "gat-a-yo", "english": "it''s the same", "category": "Expressions"},
  {"id": "cr-17", "korean": "달라요", "romanization": "dal-ra-yo", "english": "it''s different", "category": "Expressions"},
  {"id": "cr-18", "korean": "비슷해요", "romanization": "bi-seut-hae-yo", "english": "it''s similar", "category": "Expressions"},
  {"id": "cr-19", "korean": "좋아요", "romanization": "joh-a-yo", "english": "it''s good", "category": "Feedback"},
  {"id": "cr-20", "korean": "잘했어요", "romanization": "jal-haes-seo-yo", "english": "good job", "category": "Feedback"},
  {"id": "cr-21", "korean": "수고했습니다", "romanization": "su-go-haess-seub-ni-da", "english": "you did well", "category": "Feedback"},
  {"id": "cr-22", "korean": "고생했습니다", "romanization": "go-saeng-haess-seub-ni-da", "english": "you did well", "category": "Feedback"}
]'::jsonb),
('les-vocab-practice-1', 5, 'Unit 1: Hangul & Korean Basics', '단어연습 1', 'Essential Korean vocabulary reading practice (No 받침).', 'vocab', 'les-vocab-practice-quiz-1', NULL, 'Active', '[
  {"id": "vp1-2", "korean": "사자", "romanization": "sa-ja", "english": "lion", "category": "Vocab"},
  {"id": "vp1-3", "korean": "새", "romanization": "sae", "english": "bird", "category": "Vocab"},
  {"id": "vp1-4", "korean": "뼈", "romanization": "ppyeo", "english": "bone", "category": "Vocab"},
  {"id": "vp1-5", "korean": "시계", "romanization": "si-gye", "english": "clock", "category": "Vocab"},
  {"id": "vp1-6", "korean": "소주", "romanization": "so-ju", "english": "soju", "category": "Vocab"},
  {"id": "vp1-7", "korean": "쏘다", "romanization": "sso-da", "english": "shoot", "category": "Vocab"},
  {"id": "vp1-9", "korean": "싸다", "romanization": "ssa-da", "english": "cheap", "category": "Vocab"},
  {"id": "vp1-10", "korean": "바지", "romanization": "ba-ji", "english": "pants", "category": "Vocab"},
  {"id": "vp1-11", "korean": "피자", "romanization": "pi-ja", "english": "pizza", "category": "Vocab"},
  {"id": "vp1-12", "korean": "고추", "romanization": "go-chu", "english": "chili pepper", "category": "Vocab"},
  {"id": "vp1-13", "korean": "치즈", "romanization": "chi-jeu", "english": "cheese", "category": "Vocab"},
  {"id": "vp1-14", "korean": "휴지", "romanization": "hyu-ji", "english": "tissue", "category": "Vocab"},
  {"id": "vp1-15", "korean": "호수", "romanization": "ho-su", "english": "lake", "category": "Vocab"},
  {"id": "vp1-16", "korean": "나무", "romanization": "na-mu", "english": "tree", "category": "Vocab"},
  {"id": "vp1-17", "korean": "나비", "romanization": "na-bi", "english": "butterfly", "category": "Vocab"},
  {"id": "vp1-18", "korean": "바나나", "romanization": "ba-na-na", "english": "banana", "category": "Vocab"},
  {"id": "vp1-19", "korean": "우유", "romanization": "u-yu", "english": "milk", "category": "Vocab"},
  {"id": "vp1-20", "korean": "사과", "romanization": "sa-gwa", "english": "apple", "category": "Vocab"},
  {"id": "vp1-21", "korean": "왜", "romanization": "wae", "english": "why", "category": "Vocab"},
  {"id": "vp1-22", "korean": "더워요", "romanization": "deo-wo-yo", "english": "it''s hot", "category": "Vocab"},
  {"id": "vp1-23", "korean": "가위", "romanization": "ga-wi", "english": "scissors", "category": "Vocab"},
  {"id": "vp1-24", "korean": "오리", "romanization": "o-ri", "english": "duck", "category": "Vocab"},
  {"id": "vp1-25", "korean": "토마토", "romanization": "to-ma-to", "english": "tomato", "category": "Vocab"},
  {"id": "vp1-26", "korean": "의사", "romanization": "ui-sa", "english": "doctor", "category": "Vocab"},
  {"id": "vp1-27", "korean": "모자", "romanization": "mo-ja", "english": "hat", "category": "Vocab"},
  {"id": "vp1-28", "korean": "스웨터", "romanization": "seu-we-teo", "english": "sweater", "category": "Vocab"},
  {"id": "vp1-29", "korean": "모래", "romanization": "mo-rae", "english": "sand", "category": "Vocab"},
  {"id": "vp1-30", "korean": "의자", "romanization": "ui-ja", "english": "chair", "category": "Vocab"},
  {"id": "vp1-31", "korean": "주사위", "romanization": "ju-sa-wi", "english": "dice", "category": "Vocab"}
]'::jsonb),
('les-vocab-practice-quiz-1', 6, 'Unit 1: Hangul & Korean Basics', '단어연습 1 퀴즈', 'Test your vocabulary knowledge on 단어연습1.', 'vocab quiz', NULL, 'les-vocab-practice-1', 'Active', '[]'::jsonb),
('les-vocab-practice-2', 7, 'Unit 1: Hangul & Korean Basics', '단어연습 2', 'Korean vocabulary reading practice with 받침.', 'vocab', 'les-vocab-practice-quiz-2', NULL, 'Active', '[
  {"id": "vp2-1", "korean": "가방", "romanization": "ga-bang", "english": "bag", "category": "Vocab"},
  {"id": "vp2-2", "korean": "교실", "romanization": "gyo-sil", "english": "classroom", "category": "Vocab"},
  {"id": "vp2-3", "korean": "김치", "romanization": "gim-chi", "english": "kimchi", "category": "Vocab"},
  {"id": "vp2-4", "korean": "돈", "romanization": "don", "english": "money", "category": "Vocab"},
  {"id": "vp2-5", "korean": "당근", "romanization": "dang-geun", "english": "carrot", "category": "Vocab"},
  {"id": "vp2-6", "korean": "리본", "romanization": "ri-bon", "english": "ribbon", "category": "Vocab"},
  {"id": "vp2-7", "korean": "물", "romanization": "mul", "english": "water", "category": "Vocab"},
  {"id": "vp2-8", "korean": "라면", "romanization": "ra-myeon", "english": "ramen", "category": "Vocab"},
  {"id": "vp2-9", "korean": "사탕", "romanization": "sa-tang", "english": "candy", "category": "Vocab"},
  {"id": "vp2-10", "korean": "수박", "romanization": "su-bak", "english": "watermelon", "category": "Vocab"},
  {"id": "vp2-11", "korean": "양말", "romanization": "yang-mal", "english": "socks", "category": "Vocab"},
  {"id": "vp2-12", "korean": "김밥", "romanization": "gim-bap", "english": "kimbap", "category": "Vocab"},
  {"id": "vp2-13", "korean": "자전거", "romanization": "ja-jeon-geo", "english": "bicycle", "category": "Vocab"},
  {"id": "vp2-14", "korean": "장갑", "romanization": "jang-gap", "english": "gloves", "category": "Vocab"},
  {"id": "vp2-15", "korean": "지하철", "romanization": "ji-ha-cheol", "english": "subway", "category": "Vocab"},
  {"id": "vp2-16", "korean": "친구", "romanization": "chin-gu", "english": "friend", "category": "Vocab"},
  {"id": "vp2-17", "korean": "컴퓨터", "romanization": "keom-pyu-teo", "english": "computer", "category": "Vocab"},
  {"id": "vp2-18", "korean": "풍선", "romanization": "pung-seon", "english": "balloon", "category": "Vocab"},
  {"id": "vp2-19", "korean": "학교", "romanization": "hak-gyo", "english": "school", "category": "Vocab"},
  {"id": "vp2-20", "korean": "호랑이", "romanization": "ho-rang-i", "english": "tiger", "category": "Vocab"}
]'::jsonb),
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
