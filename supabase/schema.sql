-- ==============================================================================
-- DIGITAL HEROES (Level 1) - Complete Database Schema & Seed Data
-- Edition 2026
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CHARITIES TABLE (§ 08)
CREATE TABLE IF NOT EXISTS public.charities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Youth & Education', 'Health & Research', 'Environment & Conservation', 'Community & Hunger', 'Veterans & First Responders')),
    logo_url TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    total_raised NUMERIC(12, 2) DEFAULT 0.00,
    is_featured BOOLEAN DEFAULT false,
    upcoming_events JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES / USERS TABLE (§ 03, § 10)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
    avatar_url TEXT,
    handicap NUMERIC(4, 1) DEFAULT 12.5,
    home_club TEXT DEFAULT 'St. Andrews Links',
    charity_id UUID REFERENCES public.charities(id) ON DELETE SET NULL,
    charity_percentage NUMERIC(5, 2) DEFAULT 10.00 CHECK (charity_percentage >= 10.00 AND charity_percentage <= 100.00),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBSCRIPTIONS TABLE (§ 04)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'lapsed', 'cancelled', 'trial')),
    amount NUMERIC(8, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    billing_cycle TEXT NOT NULL,
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    renewal_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GOLF SCORES TABLE (§ 05: Stableford 1–45, 1 score per date, rolling 5 max)
CREATE TABLE IF NOT EXISTS public.scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 45),
    score_date DATE NOT NULL,
    course_name TEXT DEFAULT 'Championship Course',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_score_date UNIQUE (user_id, score_date)
);

-- Index for fast score retrieval
CREATE INDEX IF NOT EXISTS idx_scores_user_date ON public.scores(user_id, score_date DESC);

-- Automated FIFO trigger function to enforce strictly retaining only latest 5 scores
CREATE OR REPLACE FUNCTION enforce_rolling_5_scores()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.scores
    WHERE id NOT IN (
        SELECT id FROM public.scores
        WHERE user_id = NEW.user_id
        ORDER BY score_date DESC, created_at DESC
        LIMIT 5
    ) AND user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_enforce_rolling_5_scores ON public.scores;
CREATE TRIGGER trigger_enforce_rolling_5_scores
AFTER INSERT ON public.scores
FOR EACH ROW
EXECUTE FUNCTION enforce_rolling_5_scores();

-- 5. DRAWS TABLE (§ 06, § 07)
CREATE TABLE IF NOT EXISTS public.draws (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_number INT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    draw_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'simulated', 'completed')),
    logic_type TEXT NOT NULL DEFAULT 'random' CHECK (logic_type IN ('random', 'algorithmic')),
    drawn_numbers INT[] DEFAULT NULL,
    total_prize_pool NUMERIC(12, 2) DEFAULT 0.00,
    jackpot_pool NUMERIC(12, 2) DEFAULT 0.00,   -- 40%
    tier2_pool NUMERIC(12, 2) DEFAULT 0.00,     -- 35%
    tier3_pool NUMERIC(12, 2) DEFAULT 0.00,     -- 25%
    rollover_jackpot NUMERIC(12, 2) DEFAULT 0.00,
    total_participants INT DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- 6. DRAW ENTRIES & PARTICIPATION TABLE (§ 06, § 07)
CREATE TABLE IF NOT EXISTS public.draw_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submitted_scores INT[] NOT NULL,
    matched_count INT DEFAULT 0,
    tier_won TEXT DEFAULT 'none' CHECK (tier_won IN ('jackpot', 'tier2', 'tier3', 'none')),
    prize_amount NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_draw_entry UNIQUE (draw_id, user_id)
);

-- 7. WINNER VERIFICATIONS TABLE (§ 09)
CREATE TABLE IF NOT EXISTS public.winner_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID NOT NULL REFERENCES public.draw_entries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
    proof_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    payout_date TIMESTAMPTZ
);

-- 8. DONATIONS & CHARITY CONTRIBUTIONS TABLE (§ 08)
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('subscription_portion', 'independent_donation')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- REALISTIC SEED DATA
-- ==============================================================================

-- Clear existing data
TRUNCATE public.donations, public.winner_verifications, public.draw_entries, 
         public.draws, public.scores, public.subscriptions, public.profiles, public.charities CASCADE;

-- Insert Charities
INSERT INTO public.charities (id, name, tagline, description, category, logo_url, cover_image, total_raised, is_featured, upcoming_events)
VALUES
(
    'c1111111-1111-1111-1111-111111111111',
    'Fairway Dreams Foundation',
    'Empowering underprivileged youth through mentorship & sport',
    'Fairway Dreams provides equipment, golf coaching, and academic tutoring to youth in underserved communities across the nation. Over 12,000 children have graduated through our life-skills academy.',
    'Youth & Education',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=160&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    48250.00,
    true,
    '[{"title": "Annual Youth Open Charity Day", "date": "2026-10-15", "location": "Pebble Beach, CA", "goal": "$50,000"}]'::jsonb
),
(
    'c2222222-2222-2222-2222-222222222222',
    'Clean Ocean Alliance',
    'Restoring marine ecosystems and eradicating coastal plastic waste',
    'Working directly with coastal fishing communities to recover marine debris and protect coral reef biodiversity. Every dollar raised extracts 5 lbs of plastic from ocean waters.',
    'Environment & Conservation',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=160&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80',
    34120.00,
    true,
    '[{"title": "Coastal Conservation Scramble", "date": "2026-11-04", "location": "Torrey Pines, CA", "goal": "$35,000"}]'::jsonb
),
(
    'c3333333-3333-3333-3333-333333333333',
    'Hope Cancer Research',
    'Funding next-generation targeted immunotherapy trials',
    'Dedicated to accelerating early-detection cancer diagnostics and providing emotional and housing support grants to families receiving outpatient treatments.',
    'Health & Research',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=160&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80',
    72900.00,
    true,
    '[{"title": "Swing for the Cure Invitational", "date": "2026-09-28", "location": "Pinehurst No. 2, NC", "goal": "$80,000"}]'::jsonb
),
(
    'c4444444-4444-4444-4444-444444444444',
    'Veterans Forward Initiative',
    'Rehabilitation, adaptive athletics, and transition careers for heroes',
    'Connecting injured veterans with adaptive sports, mental health counseling, and direct career placement in tech and renewable energy fields.',
    'Veterans & First Responders',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=160&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?w=800&auto=format&fit=crop&q=80',
    21500.00,
    false,
    '[{"title": "Honor & Drive Pro-Am", "date": "2026-10-30", "location": "Kiawah Island, SC", "goal": "$25,000"}]'::jsonb
);

-- Insert Users (1 Admin, 3 Active Subscribers)
INSERT INTO public.profiles (id, email, full_name, role, avatar_url, handicap, home_club, charity_id, charity_percentage)
VALUES
(
    'a1111111-aaaa-1111-aaaa-111111111111',
    'admin@digitalheroes.com',
    'Sarah Vance (Head of Operations)',
    'admin',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    4.2,
    'The Royal Troon',
    'c1111111-1111-1111-1111-111111111111',
    15.00
),
(
    'b2222222-bbbb-2222-bbbb-222222222222',
    'abhayraj@digitalheroes.com',
    'Abhayraj Singh',
    'subscriber',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    9.8,
    'St. Andrews Links',
    'c3333333-3333-3333-3333-333333333333',
    20.00
),
(
    'b3333333-cccc-3333-cccc-333333333333',
    'marcus.chen@example.com',
    'Marcus Chen',
    'subscriber',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    14.0,
    'Augusta National Club',
    'c2222222-2222-2222-2222-222222222222',
    12.50
),
(
    'b4444444-dddd-4444-dddd-444444444444',
    'elena.rostova@example.com',
    'Elena Rostova',
    'subscriber',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    7.5,
    'Whistling Straits',
    'c1111111-1111-1111-1111-111111111111',
    10.00
);

-- Insert Subscriptions (§ 04)
INSERT INTO public.subscriptions (id, user_id, plan, status, amount, billing_cycle, current_period_start, current_period_end, renewal_date)
VALUES
('fa111111-1111-1111-1111-111111111111', 'a1111111-aaaa-1111-aaaa-111111111111', 'yearly', 'active', 180.00, 'yearly', NOW() - INTERVAL '60 days', NOW() + INTERVAL '305 days', NOW() + INTERVAL '305 days'),
('fa222222-2222-2222-2222-222222222222', 'b2222222-bbbb-2222-bbbb-222222222222', 'monthly', 'active', 19.99, 'monthly', NOW() - INTERVAL '12 days', NOW() + INTERVAL '18 days', NOW() + INTERVAL '18 days'),
('fa333333-3333-3333-3333-333333333333', 'b3333333-cccc-3333-cccc-333333333333', 'yearly', 'active', 180.00, 'yearly', NOW() - INTERVAL '30 days', NOW() + INTERVAL '335 days', NOW() + INTERVAL '335 days'),
('fa444444-4444-4444-4444-444444444444', 'b4444444-dddd-4444-dddd-444444444444', 'monthly', 'active', 19.99, 'monthly', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', NOW() + INTERVAL '25 days');

-- Insert 5 Stableford Scores for Abhayraj Singh (§ 05: strictly 1-45, 1 per date, reverse chronological)
INSERT INTO public.scores (user_id, score, score_date, course_name)
VALUES
('b2222222-bbbb-2222-bbbb-222222222222', 38, CURRENT_DATE - INTERVAL '1 day', 'St. Andrews Old Course'),
('b2222222-bbbb-2222-bbbb-222222222222', 34, CURRENT_DATE - INTERVAL '4 days', 'Carnoustie Championship Links'),
('b2222222-bbbb-2222-bbbb-222222222222', 41, CURRENT_DATE - INTERVAL '8 days', 'Kingsbarns Golf Links'),
('b2222222-bbbb-2222-bbbb-222222222222', 29, CURRENT_DATE - INTERVAL '14 days', 'Gleneagles PGA Centenary'),
('b2222222-bbbb-2222-bbbb-222222222222', 36, CURRENT_DATE - INTERVAL '20 days', 'Muirfield Links');

-- Insert 5 Scores for Marcus Chen
INSERT INTO public.scores (user_id, score, score_date, course_name)
VALUES
('b3333333-cccc-3333-cccc-333333333333', 32, CURRENT_DATE - INTERVAL '2 days', 'Augusta National'),
('b3333333-cccc-3333-cccc-333333333333', 38, CURRENT_DATE - INTERVAL '6 days', 'East Lake Golf Club'),
('b3333333-cccc-3333-cccc-333333333333', 27, CURRENT_DATE - INTERVAL '11 days', 'Sawgrass Stadium Course'),
('b3333333-cccc-3333-cccc-333333333333', 35, CURRENT_DATE - INTERVAL '16 days', 'Bay Hill Club'),
('b3333333-cccc-3333-cccc-333333333333', 42, CURRENT_DATE - INTERVAL '22 days', 'Innisbrook Copperhead');

-- Insert 5 Scores for Elena Rostova
INSERT INTO public.scores (user_id, score, score_date, course_name)
VALUES
('b4444444-dddd-4444-dddd-444444444444', 40, CURRENT_DATE - INTERVAL '3 days', 'Whistling Straits Straits Course'),
('b4444444-dddd-4444-dddd-444444444444', 38, CURRENT_DATE - INTERVAL '7 days', 'Blackwolf Run River Course'),
('b4444444-dddd-4444-dddd-444444444444', 34, CURRENT_DATE - INTERVAL '12 days', 'Erin Hills Golf Course'),
('b4444444-dddd-4444-dddd-444444444444', 31, CURRENT_DATE - INTERVAL '18 days', 'Sand Valley Dunes'),
('b4444444-dddd-4444-dddd-444444444444', 44, CURRENT_DATE - INTERVAL '25 days', 'SentryWorld Course');

-- Insert Past Completed Draw (Draw #101) & Upcoming Scheduled Draw (Draw #102)
INSERT INTO public.draws (id, draw_number, title, draw_date, status, logic_type, drawn_numbers, total_prize_pool, jackpot_pool, tier2_pool, tier3_pool, rollover_jackpot, total_participants, is_published, published_at)
VALUES
(
    'd1111111-1111-1111-1111-111111111111',
    101,
    'August 2026 Monthly Charity Draw',
    NOW() - INTERVAL '18 days',
    'completed',
    'random',
    ARRAY[38, 34, 41, 19, 7],
    25000.00,
    10000.00,  -- 40% (Rolled over!)
    8750.00,   -- 35%
    6250.00,   -- 25%
    10000.00,  -- Unclaimed 5-match jackpot carries forward
    1480,
    true,
    NOW() - INTERVAL '18 days'
),
(
    'd2222222-2222-2222-2222-222222222222',
    102,
    'September 2026 Autumn Championship Draw',
    NOW() + INTERVAL '12 days',
    'scheduled',
    'algorithmic',
    NULL,
    35000.00,  -- Base $25,000 + $10,000 Rollover
    20000.00,  -- $10k base + $10k rollover
    8750.00,
    6250.00,
    10000.00,
    1620,
    false,
    NULL
);

-- Insert Draw Entries for Past Draw #101
INSERT INTO public.draw_entries (id, draw_id, user_id, submitted_scores, matched_count, tier_won, prize_amount)
VALUES
(
    'e1111111-1111-1111-1111-111111111111',
    'd1111111-1111-1111-1111-111111111111',
    'b2222222-bbbb-2222-bbbb-222222222222',  -- Abhayraj matched 3 numbers: [38, 34, 41]
    ARRAY[38, 34, 41, 29, 36],
    3,
    'tier3',
    781.25  -- $6250 / 8 winners
),
(
    'e2222222-2222-2222-2222-222222222222',
    'd1111111-1111-1111-1111-111111111111',
    'b3333333-cccc-3333-cccc-333333333333',
    ARRAY[32, 38, 27, 35, 42],
    1,
    'none',
    0.00
),
(
    'e3333333-3333-3333-3333-333333333333',
    'd1111111-1111-1111-1111-111111111111',
    'b4444444-dddd-4444-dddd-444444444444',  -- Elena matched 2 numbers: [38, 34]
    ARRAY[40, 38, 34, 31, 44],
    2,
    'none',
    0.00
);

-- Insert Winner Verification for Abhayraj (§ 09)
INSERT INTO public.winner_verifications (id, entry_id, user_id, draw_id, proof_url, status, admin_notes, payment_status, submitted_at, reviewed_at, payout_date)
VALUES
(
    'ea111111-1111-1111-1111-111111111111',
    'e1111111-1111-1111-1111-111111111111',
    'b2222222-bbbb-2222-bbbb-222222222222',
    'd1111111-1111-1111-1111-111111111111',
    'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&auto=format&fit=crop&q=80',
    'approved',
    'Verified against Scottish Golf Union official handicap portal. All 3 matched scores confirmed.',
    'paid',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '13 days',
    NOW() - INTERVAL '12 days'
);
