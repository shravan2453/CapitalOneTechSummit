-- =====================================================================
-- OneLoan / Capital One Tech Summit - Supabase Schema
-- ---------------------------------------------------------------------
-- Paste this entire file into the Supabase SQL Editor and click "Run".
-- It is idempotent: safe to run multiple times.
-- =====================================================================

-- Required extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. users  (application-level profile, joined to auth.users by email)
-- ---------------------------------------------------------------------
create table if not exists public.users (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),
  email                   text unique not null,
  name                    text,
  age                     integer,
  graduation_date         date,
  expected_income         numeric not null default 0,
  credit_score_range      text,
  state_of_residence      text,
  school_name             text,
  program_type            text,
  enrollment_status       text,
  current_savings         numeric,
  monthly_budget          numeric not null default 0,
  other_debt              numeric,
  financial_dependents    integer,
  risk_preference         text,
  target_payoff_date      date,
  prioritize              text,
  dependency_status       text,
  annual_gap              numeric,
  cosigner                boolean,
  subsidizable            boolean,
  fels_eligible           boolean,
  parent_plus             boolean,
  target_payoff_duration  integer,
  max_monthly_payment     numeric,
  in_school_payment       text,
  tuition_growth_rate     numeric,
  year_level              text,
  optimize_by             text,
  family_size             integer
);

-- ---------------------------------------------------------------------
-- 2. loans  (a user's saved loans)
-- ---------------------------------------------------------------------
create table if not exists public.loans (
  id                          uuid primary key default gen_random_uuid(),
  created_at                  timestamptz not null default now(),
  user_id                     uuid references public.users(id) on delete cascade,
  name                        text not null,
  type                        text not null,
  lender                      text,
  interest_rate               numeric not null default 0,
  term_years                  numeric not null default 10,
  fixed_variable              text,
  origination_fee             numeric,
  grace_period                numeric,
  min_payment                 numeric,
  max_amount                  numeric,
  amount                      numeric,
  repayment_plan              text,
  loan_category               text,
  loan_subtype                text,
  year_level                  text,
  annual_limit                numeric,
  aggregate_limit             numeric,
  in_school_payment_strategy  text,
  weighted_avg_rate           numeric,
  total_cost                  numeric,
  total_interest              numeric,
  payoff_date                 date,
  is_paid                     boolean not null default false,
  paid_date                   date
);

create index if not exists loans_user_id_idx on public.loans (user_id);

-- ---------------------------------------------------------------------
-- 3. loans_form  (raw "loans you've already taken" form, JSON blob)
-- ---------------------------------------------------------------------
create table if not exists public.loans_form (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

-- =====================================================================
-- Row Level Security (RLS)
-- =====================================================================

alter table public.users      enable row level security;
alter table public.loans      enable row level security;
alter table public.loans_form enable row level security;

-- ----- users: match by JWT email ------------------------------------
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (email = auth.jwt() ->> 'email');

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
  for insert with check (email = auth.jwt() ->> 'email');

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (email = auth.jwt() ->> 'email');

-- ----- loans: must reference a users row whose email matches JWT ----
drop policy if exists "loans_select_own" on public.loans;
create policy "loans_select_own" on public.loans
  for select using (
    user_id in (select id from public.users where email = auth.jwt() ->> 'email')
  );

drop policy if exists "loans_insert_own" on public.loans;
create policy "loans_insert_own" on public.loans
  for insert with check (
    user_id in (select id from public.users where email = auth.jwt() ->> 'email')
  );

drop policy if exists "loans_update_own" on public.loans;
create policy "loans_update_own" on public.loans
  for update using (
    user_id in (select id from public.users where email = auth.jwt() ->> 'email')
  );

drop policy if exists "loans_delete_own" on public.loans;
create policy "loans_delete_own" on public.loans
  for delete using (
    user_id in (select id from public.users where email = auth.jwt() ->> 'email')
  );

-- ----- loans_form: keyed directly on auth.uid() ---------------------
drop policy if exists "loans_form_all_own" on public.loans_form;
create policy "loans_form_all_own" on public.loans_form
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- =====================================================================
-- Done. Verify with:
--   select table_name from information_schema.tables
--     where table_schema = 'public';
-- =====================================================================
