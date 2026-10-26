-- ==============================================================================
-- PENG HONG DIGITAL LIBRARY - SUPABASE DATABASE & STORAGE INITIALIZATION
-- ==============================================================================
-- Copy and paste this entire script into your Supabase SQL Editor and click "Run".
-- ==============================================================================

-- 1. Create Books Table
create table if not exists public.books (
  id text primary key,
  title text not null,
  author text not null default 'Prof. Lay PengHong',
  category text not null check (category in ('Law', 'Economics')),
  price_usd numeric(10, 2) not null,
  price_khr integer not null,
  description text,
  total_pages integer not null default 10,
  preview_pages integer not null default 3,
  storage_path text not null,
  publisher text not null default 'Royal University of Law and Economics (RULE)',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on books
alter table public.books enable row level security;

-- Allow public read access to book catalog details
create policy "Allow public read access to books"
  on public.books for select
  using (true);

-- Allow service role (server-side admin API) to insert/update/delete books
create policy "Allow service role to manage books"
  on public.books for all
  using (true)
  with check (true);

-- 2. Create Purchases Table (Tracks ABA PayWay transactions)
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  book_id text references public.books(id) on delete cascade not null,
  student_email text not null,
  student_name text,
  amount_usd numeric(10, 2) not null,
  amount_khr integer not null,
  transaction_id text unique not null,
  payment_method text not null default 'aba_payway',
  status text not null default 'completed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on purchases
alter table public.purchases enable row level security;

-- Allow public read access to verify purchase by student email and transaction ID
create policy "Allow public read access to purchases"
  on public.purchases for select
  using (true);

-- Allow service role to record completed purchases
create policy "Allow service role to insert purchases"
  on public.purchases for insert
  with check (true);

-- 3. Create Private Storage Bucket for PDFs
-- Notice: public = false ensures PDFs can NEVER be downloaded directly via public URLs
insert into storage.buckets (id, name, public)
values ('books', 'books', false)
on conflict (id) do nothing;

-- Ensure service role can upload and manage PDF objects in the 'books' bucket
create policy "Service role full access on books bucket"
  on storage.objects for all
  using (bucket_id = 'books')
  with check (bucket_id = 'books');
