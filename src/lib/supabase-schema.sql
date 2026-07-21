-- Supabase で実行するSQL（SQL Editor → New Query に貼り付け）
-- このファイルをコピーして Supabase Dashboard の SQL Editor で実行

-- セッションテーブル
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,         -- ClerkのユーザーID
  type text not null,            -- 'study' or 'workout'
  duration integer not null,     -- 分
  date date not null,            -- 'YYYY-MM-DD'
  note text default '',
  created_at timestamp with time zone default now()
);

-- user_id で検索するためのインデックス
create index idx_sessions_user_id on sessions (user_id);

-- 日付でソートするためのインデックス
create index idx_sessions_date on sessions (date desc);

-- Row Level Security を有効化
alter table sessions enable row level security;

-- 自分のデータのみ読み取り可能
create policy "Users can read own sessions"
  on sessions for select
  using (user_id = current_setting('app.user_id', true)::text);

-- 自分のデータのみ書き込み可能
create policy "Users can insert own sessions"
  on sessions for insert
  with check (user_id = current_setting('app.user_id', true)::text);

-- 自分のデータのみ削除可能
create policy "Users can delete own sessions"
  on sessions for delete
  using (user_id = current_setting('app.user_id', true)::text);
