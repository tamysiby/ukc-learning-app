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

-- Ensure column exists on pre-existing users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;

-- Index for lookup
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to users" ON public.users;
CREATE POLICY "Allow public read access to users" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access to users" ON public.users;
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
DROP POLICY IF EXISTS "Allow public read access to lessons" ON public.lessons;
CREATE POLICY "Allow public read access to lessons" ON public.lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access to lessons" ON public.lessons;
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
DROP POLICY IF EXISTS "Allow authenticated access to access table" ON public.student_lesson_access;
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
DROP POLICY IF EXISTS "Allow authenticated access to progress table" ON public.student_lesson_progress;
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
('les-particles-1', 4.65, 'Unit 1: Hangul & Korean Basics', 'N이/가 N예요/이에? · N은/는 N예요/이에요.', 'Learn Subject particles (이/가) and Topic particles (은/는) in Q&A sentence structures.', 'custom', NULL, NULL, 'Active', '[
  {"id": "pt-1", "korean": "이름이 뭐예요?", "romanization": "i-reu-mi mweo-ye-yo?", "english": "what is your name?", "category": "Questions"},
  {"id": "pt-2", "korean": "저는 스테파니예요.", "romanization": "jeo-neun seu-te-pa-ni-ye-yo", "english": "i am Stephanie", "category": "Answers"},
  {"id": "pt-3", "korean": "직업이 뭐예요?", "romanization": "ji-geo-bi mweo-ye-yo?", "english": "what is your occupation?", "category": "Questions"},
  {"id": "pt-4", "korean": "리에 씨는 요리사예요.", "romanization": "ri-e ssi-neun yo-ri-sa-ye-yo", "english": "Rie is a chef", "category": "Answers"},
  {"id": "pt-5", "korean": "취미가 농구예요?", "romanization": "chwi-mi-ga nong-gu-ye-yo?", "english": "is your hobby basketball?", "category": "Questions"},
  {"id": "pt-6", "korean": "아니요, 취미는 야구예요.", "romanization": "a-ni-yo, chwi-mi-neun ya-gu-ye-yo", "english": "no, my hobby is baseball", "category": "Answers"},
  {"id": "pt-7", "korean": "선생님이 한국 사람이에요?", "romanization": "seon-saeng-ni-mi han-gug sa-ra-mi-e-yo?", "english": "is the teacher Korean?", "category": "Questions"},
  {"id": "pt-8", "korean": "네, 선생님은 한국 사람이에요.", "romanization": "ne, seon-saeng-ni-meun han-gug sa-ra-mi-e-yo", "english": "yes, the teacher is Korean", "category": "Answers"}
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
('les-vocab-practice-quiz-2', 8, 'Unit 1: Hangul & Korean Basics', '단어연습 2 퀴즈', 'Test your vocabulary knowledge on 단어연습2.', 'vocab quiz', NULL, 'les-vocab-practice-2', 'Active', '[]'::jsonb),
('les-hobbies-1', 9, 'Unit 1: Hangul & Korean Basics', 'Hobbies (취미)', 'Essential Korean vocabulary for hobbies, sports, and leisure activities.', 'vocab', 'les-hobbies-quiz-1', NULL, 'Active', '[
  {"id": "hob-1", "korean": "요리", "romanization": "yo-ri", "english": "cooking", "category": "Hobbies"},
  {"id": "hob-2", "korean": "야구", "romanization": "ya-gu", "english": "baseball", "category": "Sports"},
  {"id": "hob-3", "korean": "컴퓨터 게임", "romanization": "keom-pyu-teo ge-im", "english": "computer games", "category": "Hobbies"},
  {"id": "hob-4", "korean": "음악 감상", "romanization": "eum-ag gam-sang", "english": "listening to music", "category": "Hobbies"},
  {"id": "hob-5", "korean": "수영", "romanization": "su-yeong", "english": "swimming", "category": "Sports"},
  {"id": "hob-6", "korean": "농구", "romanization": "nong-gu", "english": "basketball", "category": "Sports"},
  {"id": "hob-7", "korean": "태권도", "romanization": "tae-gwon-do", "english": "taekwondo", "category": "Sports"},
  {"id": "hob-8", "korean": "독서", "romanization": "dok-seo", "english": "reading", "category": "Hobbies"},
  {"id": "hob-9", "korean": "영화 감상", "romanization": "yeong-hwa gam-sang", "english": "watching movies", "category": "Hobbies"},
  {"id": "hob-10", "korean": "여행", "romanization": "yeo-haeng", "english": "traveling", "category": "Hobbies"},
  {"id": "hob-11", "korean": "쇼핑", "romanization": "syo-ping", "english": "shopping", "category": "Hobbies"},
  {"id": "hob-12", "korean": "축구", "romanization": "chuk-gu", "english": "soccer", "category": "Sports"},
  {"id": "hob-13", "korean": "러닝", "romanization": "reo-ning", "english": "running", "category": "Sports"},
  {"id": "hob-14", "korean": "그림 그리기", "romanization": "geu-rim geu-ri-gi", "english": "drawing", "category": "Hobbies"},
  {"id": "hob-15", "korean": "필라테스", "romanization": "pil-ra-te-seu", "english": "pilates", "category": "Sports"},
  {"id": "hob-16", "korean": "산책", "romanization": "san-chaek", "english": "walking", "category": "Hobbies"}
]'::jsonb),
('les-hobbies-quiz-1', 10, 'Unit 1: Hangul & Korean Basics', 'Hobbies Quiz (취미 퀴즈)', 'Test your knowledge on Korean hobbies vocabulary.', 'vocab quiz', NULL, 'les-hobbies-1', 'Active', '[]'::jsonb),
('les-sino-numbers-1', 11, 'Unit 1: Hangul & Korean Basics', 'Sino Numbers (숫자)', 'Learn Korean Sino-Korean numerals and numbers.', 'vocab', NULL, NULL, 'Active', '[
  {"id": "sino-0", "korean": "영(공)", "romanization": "yeong (gong)", "english": "0", "category": "Numbers"},
  {"id": "sino-1", "korean": "일", "romanization": "il", "english": "1", "category": "Numbers"},
  {"id": "sino-2", "korean": "이", "romanization": "i", "english": "2", "category": "Numbers"},
  {"id": "sino-3", "korean": "삼", "romanization": "sam", "english": "3", "category": "Numbers"},
  {"id": "sino-4", "korean": "사", "romanization": "sa", "english": "4", "category": "Numbers"},
  {"id": "sino-5", "korean": "오", "romanization": "o", "english": "5", "category": "Numbers"},
  {"id": "sino-6", "korean": "육", "romanization": "yuk", "english": "6", "category": "Numbers"},
  {"id": "sino-7", "korean": "칠", "romanization": "chil", "english": "7", "category": "Numbers"},
  {"id": "sino-8", "korean": "팔", "romanization": "pal", "english": "8", "category": "Numbers"},
  {"id": "sino-9", "korean": "구", "romanization": "gu", "english": "9", "category": "Numbers"},
  {"id": "sino-10", "korean": "십", "romanization": "sip", "english": "10", "category": "Numbers"},
  {"id": "sino-11", "korean": "십일", "romanization": "si-bil", "english": "11", "category": "Numbers"},
  {"id": "sino-12", "korean": "십이", "romanization": "si-bi", "english": "12", "category": "Numbers"},
  {"id": "sino-13", "korean": "십삼", "romanization": "sip-sam", "english": "13", "category": "Numbers"},
  {"id": "sino-15", "korean": "십오", "romanization": "si-bo", "english": "15", "category": "Numbers"},
  {"id": "sino-16", "korean": "십육", "romanization": "sim-nyuk", "english": "16", "category": "Numbers"},
  {"id": "sino-17", "korean": "십칠", "romanization": "sip-chil", "english": "17", "category": "Numbers"},
  {"id": "sino-18", "korean": "십팔", "romanization": "sip-pal", "english": "18", "category": "Numbers"},
  {"id": "sino-19", "korean": "십구", "romanization": "sip-gu", "english": "19", "category": "Numbers"},
  {"id": "sino-20", "korean": "이십", "romanization": "i-sip", "english": "20", "category": "Numbers"},
  {"id": "sino-30", "korean": "삼십", "romanization": "sam-sip", "english": "30", "category": "Numbers"},
  {"id": "sino-40", "korean": "사십", "romanization": "sa-sip", "english": "40", "category": "Numbers"},
  {"id": "sino-50", "korean": "오십", "romanization": "o-sip", "english": "50", "category": "Numbers"},
  {"id": "sino-60", "korean": "육십", "romanization": "yuk-sip", "english": "60", "category": "Numbers"},
  {"id": "sino-70", "korean": "칠십", "romanization": "chil-sip", "english": "70", "category": "Numbers"},
  {"id": "sino-80", "korean": "팔십", "romanization": "pal-sip", "english": "80", "category": "Numbers"},
  {"id": "sino-90", "korean": "구십", "romanization": "gu-sip", "english": "90", "category": "Numbers"},
  {"id": "sino-100", "korean": "백", "romanization": "baek", "english": "100", "category": "Numbers"},
  {"id": "sino-1000", "korean": "천", "romanization": "cheon", "english": "1000", "category": "Numbers"},
  {"id": "sino-10000", "korean": "만", "romanization": "man", "english": "10000", "category": "Numbers"}
]'::jsonb),
('les-korean-numbers-1', 12, 'Unit 1: Hangul & Korean Basics', 'Korean Numbers (숫자)', 'Learn Native Korean numerals and counting numbers.', 'vocab', NULL, NULL, 'Active', '[
  {"id": "kor-num-1", "korean": "하나", "romanization": "ha-na", "english": "1", "category": "Numbers"},
  {"id": "kor-num-2", "korean": "둘", "romanization": "dul", "english": "2", "category": "Numbers"},
  {"id": "kor-num-3", "korean": "셋", "romanization": "set", "english": "3", "category": "Numbers"},
  {"id": "kor-num-4", "korean": "넷", "romanization": "net", "english": "4", "category": "Numbers"},
  {"id": "kor-num-5", "korean": "다섯", "romanization": "da-seot", "english": "5", "category": "Numbers"},
  {"id": "kor-num-6", "korean": "여섯", "romanization": "yeo-seot", "english": "6", "category": "Numbers"},
  {"id": "kor-num-7", "korean": "일곱", "romanization": "il-gop", "english": "7", "category": "Numbers"},
  {"id": "kor-num-8", "korean": "여덟", "romanization": "yeo-deol", "english": "8", "category": "Numbers"},
  {"id": "kor-num-9", "korean": "아홉", "romanization": "a-hop", "english": "9", "category": "Numbers"},
  {"id": "kor-num-10", "korean": "열", "romanization": "yeol", "english": "10", "category": "Numbers"},
  {"id": "kor-num-11", "korean": "열하나", "romanization": "yeol-ha-na", "english": "11", "category": "Numbers"},
  {"id": "kor-num-12", "korean": "열둘", "romanization": "yeol-dul", "english": "12", "category": "Numbers"},
  {"id": "kor-num-14", "korean": "열넷", "romanization": "yeol-net", "english": "14", "category": "Numbers"},
  {"id": "kor-num-15", "korean": "열다섯", "romanization": "yeol-da-seot", "english": "15", "category": "Numbers"},
  {"id": "kor-num-16", "korean": "열여섯", "romanization": "yeol-lyeo-seot", "english": "16", "category": "Numbers"},
  {"id": "kor-num-17", "korean": "열일곱", "romanization": "yeol-ril-gop", "english": "17", "category": "Numbers"},
  {"id": "kor-num-18", "korean": "열여덟", "romanization": "yeol-lyeo-deol", "english": "18", "category": "Numbers"},
  {"id": "kor-num-19", "korean": "열아홉", "romanization": "yeol-ra-hop", "english": "19", "category": "Numbers"},
  {"id": "kor-num-20", "korean": "스물", "romanization": "seu-mul", "english": "20", "category": "Numbers"},
  {"id": "kor-num-30", "korean": "서른", "romanization": "seo-reun", "english": "30", "category": "Numbers"},
  {"id": "kor-num-40", "korean": "마흔", "romanization": "ma-heun", "english": "40", "category": "Numbers"},
  {"id": "kor-num-50", "korean": "쉰", "romanization": "swin", "english": "50", "category": "Numbers"},
  {"id": "kor-num-60", "korean": "예순", "romanization": "ye-sun", "english": "60", "category": "Numbers"},
  {"id": "kor-num-70", "korean": "일흔", "romanization": "il-heun", "english": "70", "category": "Numbers"},
  {"id": "kor-num-80", "korean": "여든", "romanization": "yeo-deun", "english": "80", "category": "Numbers"},
  {"id": "kor-num-90", "korean": "아흔", "romanization": "a-heun", "english": "90", "category": "Numbers"},
  {"id": "kor-num-100", "korean": "백", "romanization": "baek", "english": "100", "category": "Numbers"},
  {"id": "kor-num-1000", "korean": "천", "romanization": "cheon", "english": "1000", "category": "Numbers"},
  {"id": "kor-num-10000", "korean": "만", "romanization": "man", "english": "10000", "category": "Numbers"}
]'::jsonb),
('les-number-usage-1', 15, 'Unit 1: Hangul & Korean Basics', 'Sino vs. Native Numbers (숫자 사용법)', 'Learn when to use Sino-Korean numbers vs. Native Korean numbers with interactive Q&A examples.', 'custom', NULL, NULL, 'Active', '[]'::jsonb),
('les-pronunciation-1', 16, 'Unit 1: Hangul & Korean Basics', 'Korean Pronunciation Rules (한국어 발음 규칙)', 'Master essential Korean pronunciation rules: 연음(liaison), 격음화(aspiration), 비음화(nasalization), 구개음화(palatalization), and 된소리화(glottalization).', 'custom', NULL, NULL, 'Active', '[]'::jsonb),
('les-occupations-1', 17, 'Unit 1: Hangul & Korean Basics', 'Occupations (직업)', 'Learn 18 essential Korean occupation and career vocabulary words with illustrated flashcards.', 'vocab', 'les-occupations-quiz-1', NULL, 'Active', '[
  {"id": "occ-1", "korean": "선생님", "romanization": "seon-saeng-nim", "english": "teacher", "category": "Occupations"},
  {"id": "occ-2", "korean": "교수님", "romanization": "gyo-su-nim", "english": "professor", "category": "Occupations"},
  {"id": "occ-3", "korean": "학생", "romanization": "hak-saeng", "english": "student", "category": "Occupations"},
  {"id": "occ-4", "korean": "의사", "romanization": "ui-sa", "english": "doctor", "category": "Occupations"},
  {"id": "occ-5", "korean": "회사원", "romanization": "hoe-sa-won", "english": "office worker", "category": "Occupations"},
  {"id": "occ-6", "korean": "사업가", "romanization": "sa-eop-ga", "english": "businessperson", "category": "Occupations"},
  {"id": "occ-7", "korean": "가수", "romanization": "ga-su", "english": "singer", "category": "Occupations"},
  {"id": "occ-8", "korean": "배우", "romanization": "bae-u", "english": "actor", "category": "Occupations"},
  {"id": "occ-9", "korean": "경찰관", "romanization": "gyeong-chal-gwan", "english": "police officer", "category": "Occupations"},
  {"id": "occ-10", "korean": "요리사", "romanization": "yo-ri-sa", "english": "chef", "category": "Occupations"},
  {"id": "occ-11", "korean": "화가", "romanization": "hwa-ga", "english": "painter", "category": "Occupations"},
  {"id": "occ-12", "korean": "엔지니어", "romanization": "en-ji-ni-eo", "english": "engineer", "category": "Occupations"},
  {"id": "occ-13", "korean": "공무원", "romanization": "gong-mu-won", "english": "civil servant", "category": "Occupations"},
  {"id": "occ-14", "korean": "주부", "romanization": "ju-bu", "english": "homemaker", "category": "Occupations"},
  {"id": "occ-15", "korean": "개발자", "romanization": "gae-bal-ja", "english": "developer", "category": "Occupations"},
  {"id": "occ-16", "korean": "목사님", "romanization": "mok-sa-nim", "english": "pastor", "category": "Occupations"},
  {"id": "occ-17", "korean": "간호사", "romanization": "gan-ho-sa", "english": "nurse", "category": "Occupations"},
  {"id": "occ-18", "korean": "회계사", "romanization": "hoe-gye-sa", "english": "accountant", "category": "Occupations"}
]'::jsonb),
('les-occupations-quiz-1', 18, 'Unit 1: Hangul & Korean Basics', 'Occupations Quiz (직업 퀴즈)', 'Test your knowledge on Korean occupation and career vocabulary.', 'vocab quiz', NULL, 'les-occupations-1', 'Active', '[]'::jsonb)
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
