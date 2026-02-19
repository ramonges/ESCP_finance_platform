-- ============================================
-- COMPLETE DATABASE SETUP FOR ESCP FINANCE +
-- ============================================
-- Run this entire script in your Supabase SQL Editor
-- Project ID: qarzqmdbswuwjizxpmwt
-- This creates ALL tables from scratch for a brand new project
--
-- Tables created:
--   1. profiles (user profiles, linked to auth.users)
--   2. user_answered_questions (tracks all answered questions)
--   3. user_missed_questions (tracks wrong answers for review)
--   4. user_progress (overall user progress)
--   5. user_section_progress (tracks position in each section)
--   6. premium_purchases (Stripe payment records)
--   7. articles (sharing feature - user publications)
--   8. article_likes (sharing feature - likes)
--   9. article_comments (sharing feature - comments)


-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  auth_provider text DEFAULT 'email',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow public read of profiles (needed for sharing feature to show author names)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);


-- ============================================
-- 2. USER ANSWERED QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_answered_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section text NOT NULL,
  question_number integer NOT NULL,
  was_correct boolean NOT NULL DEFAULT false,
  block_type text NULL,
  asset_category text NULL,
  strategy_category text NULL,
  answered_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),

  UNIQUE(user_id, section, question_number)
);

CREATE INDEX IF NOT EXISTS idx_user_answered_questions_user_id
  ON public.user_answered_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_answered_questions_section
  ON public.user_answered_questions(section);
CREATE INDEX IF NOT EXISTS idx_user_answered_questions_block_type
  ON public.user_answered_questions(block_type);
CREATE INDEX IF NOT EXISTS idx_user_answered_questions_asset_category
  ON public.user_answered_questions(asset_category);
CREATE INDEX IF NOT EXISTS idx_user_answered_questions_strategy_category
  ON public.user_answered_questions(strategy_category);

ALTER TABLE public.user_answered_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own answered questions"
  ON public.user_answered_questions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own answered questions"
  ON public.user_answered_questions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answered questions"
  ON public.user_answered_questions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own answered questions"
  ON public.user_answered_questions FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================
-- 3. USER MISSED QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_missed_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section text NOT NULL,
  question_number integer NOT NULL,
  question_text text NOT NULL,
  correct_answer text NOT NULL,
  reviewed boolean DEFAULT false,
  understood boolean DEFAULT false,
  block_type text NULL,
  asset_category text NULL,
  strategy_category text NULL,
  user_attempted_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),

  UNIQUE(user_id, section, question_number)
);

CREATE INDEX IF NOT EXISTS idx_user_missed_questions_user_id
  ON public.user_missed_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missed_questions_section
  ON public.user_missed_questions(section);
CREATE INDEX IF NOT EXISTS idx_user_missed_questions_block_type
  ON public.user_missed_questions(block_type);
CREATE INDEX IF NOT EXISTS idx_user_missed_questions_asset_category
  ON public.user_missed_questions(asset_category);
CREATE INDEX IF NOT EXISTS idx_user_missed_questions_strategy_category
  ON public.user_missed_questions(strategy_category);
CREATE INDEX IF NOT EXISTS idx_user_missed_questions_understood
  ON public.user_missed_questions(understood) WHERE understood = false;

ALTER TABLE public.user_missed_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own missed questions"
  ON public.user_missed_questions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own missed questions"
  ON public.user_missed_questions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own missed questions"
  ON public.user_missed_questions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own missed questions"
  ON public.user_missed_questions FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================
-- 4. USER PROGRESS TABLE (overall progress)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section text NOT NULL,
  total_questions integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  wrong_answers integer DEFAULT 0,
  block_type text NULL,
  asset_category text NULL,
  strategy_category text NULL,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),

  UNIQUE(user_id, section)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id
  ON public.user_progress(user_id);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON public.user_progress FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================
-- 5. USER SECTION PROGRESS TABLE (resume position)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_section_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section text NOT NULL,
  current_question_index integer NOT NULL DEFAULT 0,
  block_type text NULL,
  asset_category text NULL,
  strategy_category text NULL,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),

  UNIQUE(user_id, section)
);

CREATE INDEX IF NOT EXISTS idx_user_section_progress_user_id
  ON public.user_section_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_section_progress_section
  ON public.user_section_progress(section);
CREATE INDEX IF NOT EXISTS idx_user_section_progress_block_type
  ON public.user_section_progress(block_type);
CREATE INDEX IF NOT EXISTS idx_user_section_progress_asset_category
  ON public.user_section_progress(asset_category);
CREATE INDEX IF NOT EXISTS idx_user_section_progress_strategy_category
  ON public.user_section_progress(strategy_category);

ALTER TABLE public.user_section_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own section progress"
  ON public.user_section_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own section progress"
  ON public.user_section_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own section progress"
  ON public.user_section_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own section progress"
  ON public.user_section_progress FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_user_section_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_section_progress_updated_at
  BEFORE UPDATE ON public.user_section_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_section_progress_updated_at();


-- ============================================
-- 6. PREMIUM PURCHASES TABLE (Stripe)
-- ============================================
CREATE TABLE IF NOT EXISTS public.premium_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id text UNIQUE NOT NULL,
  block_type text CHECK (block_type IN ('sales', 'trading', 'quant')),
  trading_desk text,
  company_type text CHECK (company_type IN ('bank', 'hedge-fund')),
  amount decimal(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_premium_purchases_user_id
  ON public.premium_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_purchases_stripe_session_id
  ON public.premium_purchases(stripe_session_id);

ALTER TABLE public.premium_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
  ON public.premium_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert purchases"
  ON public.premium_purchases FOR INSERT
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_premium_purchases_updated_at
  BEFORE UPDATE ON public.premium_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- 7. ARTICLES TABLE (Sharing Feature)
-- ============================================
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('Interview Questions', 'Interview Feedback', 'General Comment', 'Compensation')),
  company_type text NULL CHECK (company_type IN ('bank', 'hedge fund')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,

  CONSTRAINT company_type_only_for_interview_questions
    CHECK (
      (category = 'Interview Questions' AND company_type IS NOT NULL) OR
      (category != 'Interview Questions' AND company_type IS NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_articles_user_id ON public.articles(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_company_type ON public.articles(company_type) WHERE company_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category_created_at ON public.articles(category, created_at DESC);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view articles"
  ON public.articles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create articles"
  ON public.articles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own articles"
  ON public.articles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own articles"
  ON public.articles FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION update_articles_updated_at();


-- ============================================
-- 8. ARTICLE LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.article_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,

  UNIQUE(article_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_article_likes_article_id ON public.article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_user_id ON public.article_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_article_user ON public.article_likes(article_id, user_id);

ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON public.article_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like articles"
  ON public.article_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike articles"
  ON public.article_likes FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================
-- 9. ARTICLE COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.article_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_article_comments_article_id ON public.article_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_article_comments_user_id ON public.article_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_article_comments_created_at ON public.article_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_comments_article_created ON public.article_comments(article_id, created_at DESC);

ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON public.article_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.article_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.article_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.article_comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_article_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_article_comments_updated_at
  BEFORE UPDATE ON public.article_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_article_comments_updated_at();


-- ============================================
-- 10. HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION get_article_like_count(article_uuid uuid)
RETURNS bigint AS $$
  SELECT COUNT(*)::bigint
  FROM public.article_likes
  WHERE article_id = article_uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION get_article_comment_count(article_uuid uuid)
RETURNS bigint AS $$
  SELECT COUNT(*)::bigint
  FROM public.article_comments
  WHERE article_id = article_uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION user_liked_article(article_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS(
    SELECT 1
    FROM public.article_likes
    WHERE article_id = article_uuid AND user_id = user_uuid
  );
$$ LANGUAGE sql STABLE;


-- ============================================
-- DONE!
-- ============================================
-- Your ESCP Finance + database is fully set up with:
--   1. profiles - user profiles linked to auth
--   2. user_answered_questions - track all answers
--   3. user_missed_questions - track wrong answers for review
--   4. user_progress - overall progress per section
--   5. user_section_progress - resume position tracking
--   6. premium_purchases - Stripe payment records
--   7. articles - user publications (sharing)
--   8. article_likes - like tracking
--   9. article_comments - comment system
--  10. Helper functions for article stats
--
-- All tables have:
--   - Row Level Security (RLS) enabled
--   - Proper policies for user isolation
--   - Indexes for query performance
--   - Auto-updating timestamps where needed
