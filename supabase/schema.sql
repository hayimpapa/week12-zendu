-- Zendu schema + seed
-- Run in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists topics (
  id text primary key,
  title text not null,
  description text,
  category text,
  difficulty text,
  thumbnail_url text,
  created_at timestamptz default now()
);

create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  topic_id text references topics(id) on delete cascade,
  title text not null,
  video_url text,
  order_index int not null
);

create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  topic_id text references topics(id) on delete cascade,
  completed_modules jsonb default '[]'::jsonb,
  status text default 'not_started',
  quiz_score int,
  updated_at timestamptz default now(),
  unique (user_id, topic_id)
);

create table if not exists user_wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  topic_id text references topics(id) on delete cascade,
  unique (user_id, topic_id)
);

-- RLS
alter table topics enable row level security;
alter table modules enable row level security;
alter table user_progress enable row level security;
alter table user_wishlist enable row level security;

drop policy if exists "topics readable by all" on topics;
create policy "topics readable by all" on topics for select using (true);

drop policy if exists "modules readable by all" on modules;
create policy "modules readable by all" on modules for select using (true);

drop policy if exists "own progress" on user_progress;
create policy "own progress" on user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own wishlist" on user_wishlist;
create policy "own wishlist" on user_wishlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Seed topics
insert into topics (id, title, description, category, difficulty, thumbnail_url) values
  ('healthy-eating', 'Healthy Eating',
   'Build sustainable habits around food, energy, and nutrition without the fad-diet noise.',
   'Health', 'Beginner',
   'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop'),
  ('personal-finance-basics', 'Personal Finance Basics',
   'A grounded intro to budgeting, saving, and thinking clearly about money.',
   'Finance', 'Beginner',
   'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop'),
  ('mindfulness-and-focus', 'Mindfulness & Focus',
   'Short, practical exercises for a calmer mind and sharper attention.',
   'Wellbeing', 'Beginner',
   'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop')
on conflict (id) do nothing;

-- Seed modules
insert into modules (topic_id, title, video_url, order_index) values
  ('healthy-eating', 'Macronutrients in 5 minutes', 'https://www.youtube.com/embed/fR3NxCR9z2U', 1),
  ('healthy-eating', 'How to read a nutrition label', 'https://www.youtube.com/embed/eO-OYGWdc5U', 2),
  ('healthy-eating', 'Building a balanced plate', 'https://www.youtube.com/embed/W458a21H0zo', 3),
  ('healthy-eating', 'Hydration & energy', 'https://www.youtube.com/embed/9iMGFqMmUFs', 4),
  ('healthy-eating', 'Small habits that stick', 'https://www.youtube.com/embed/1gdkBt9it84', 5),

  ('personal-finance-basics', 'Budgeting fundamentals', 'https://www.youtube.com/embed/HQzoZfc3GwQ', 1),
  ('personal-finance-basics', 'Emergency funds explained', 'https://www.youtube.com/embed/gNYpH5Ik1EI', 2),
  ('personal-finance-basics', 'Understanding interest', 'https://www.youtube.com/embed/Rm6UdfRs3gw', 3),
  ('personal-finance-basics', 'Intro to investing', 'https://www.youtube.com/embed/gFQNPmLKj1k', 4),
  ('personal-finance-basics', 'Avoiding common money traps', 'https://www.youtube.com/embed/lMKPWL9dpgo', 5),

  ('mindfulness-and-focus', 'What mindfulness actually is', 'https://www.youtube.com/embed/w6T02g5hnT4', 1),
  ('mindfulness-and-focus', 'A 5-minute breathing practice', 'https://www.youtube.com/embed/inpok4MKVLM', 2),
  ('mindfulness-and-focus', 'Training focused attention', 'https://www.youtube.com/embed/gPwxHU7MUJs', 3),
  ('mindfulness-and-focus', 'Handling distraction', 'https://www.youtube.com/embed/Hu4Yvq-g7_Y', 4),
  ('mindfulness-and-focus', 'Building a daily habit', 'https://www.youtube.com/embed/ssss7V1_eyA', 5)
on conflict do nothing;
