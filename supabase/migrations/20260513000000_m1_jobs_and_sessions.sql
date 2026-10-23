-- M1 schema: jobs + job_sessions (TXT-only, no SRT/VTT/reviewed)

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  video_source_url text not null,
  topic text,
  language text not null default 'zh',
  status text not null default 'pending'
    check (status in ('pending', 'downloading', 'transcribe', 'done')),
  current_session_id uuid
);

create table public.job_sessions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  session_number int not null default 1,
  created_at timestamptz not null default now(),
  subtitle_txt_content text
);

alter table public.jobs
  add constraint fk_current_session
  foreign key (current_session_id) references public.job_sessions(id);

create index jobs_user_created_idx on public.jobs (user_id, created_at desc);
create index jobs_status_idx on public.jobs (status);
create index job_sessions_job_idx on public.job_sessions (job_id);

-- RLS: users only see their own jobs + sessions.
-- The EC2 worker connects with the Supabase Secret key (sb_secret_*) and bypasses RLS.
alter table public.jobs enable row level security;
alter table public.job_sessions enable row level security;

create policy "users read own jobs" on public.jobs
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "users insert own jobs" on public.jobs
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "users read own sessions" on public.job_sessions
  for select to authenticated using (
    exists (select 1 from public.jobs j where j.id = job_id and j.user_id = (select auth.uid()))
  );

-- Signed-in users may only choose the video URL, topic and language.
-- status / current_session_id / timestamps are set by the database and the worker.
revoke all on public.jobs from anon, authenticated;
revoke all on public.job_sessions from anon, authenticated;
grant select on public.jobs to authenticated;
grant insert (user_id, video_source_url, topic, language) on public.jobs to authenticated;
grant select on public.job_sessions to authenticated;

-- Every new job gets its first session row automatically, so the web app can
-- enqueue a job with the user's own (RLS-limited) session — no secret key on Vercel.
create function public.create_first_job_session()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_session_id uuid;
begin
  insert into public.job_sessions (job_id, session_number)
  values (new.id, 1)
  returning id into new_session_id;

  update public.jobs set current_session_id = new_session_id where id = new.id;
  return new;
end;
$$;

revoke execute on function public.create_first_job_session() from public, anon, authenticated;

create trigger jobs_create_first_session
  after insert on public.jobs
  for each row execute function public.create_first_job_session();
