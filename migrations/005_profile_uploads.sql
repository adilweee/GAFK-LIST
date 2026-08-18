-- Run after 004_community_expansion.sql.
alter table public.profiles add column if not exists profile_theme text not null default 'cyan' check (profile_theme in ('cyan','purple','gold','green','rose'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-media', 'profile-media', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

create policy "public read profile media" on storage.objects for select using (bucket_id = 'profile-media');
