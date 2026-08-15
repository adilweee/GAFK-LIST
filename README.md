# GAFK LIST

Public Geometry Dash difficulty list MVP.

## Stack
- Next.js
- Supabase Postgres + Auth
- Vercel deployment

## Roles
- `user`: submit levels, view records and leaderboards
- `moderator`: placement only, after owner approval
- `owner`: full admin control

## Local setup
1. Create a free Supabase project.
2. Open SQL Editor and run `migrations/001_initial.sql` **once**.
3. Copy `.env.example` to `.env.local` and fill the values.
4. Set `OWNER_USERNAME` to the owner's username.
5. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never put it in client-side code or commit it.
6. `npm install`
7. `npm run dev`
8. Open `http://localhost:3000`.

### Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase publishable/anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service-role key, server only
- `OWNER_USERNAME`: username that should receive the Owner role when that account is registered
- `GAFK_INTERNAL_EMAIL_DOMAIN`: synthetic Auth email domain
- `NEXT_PUBLIC_SITE_URL`: local or production site URL

## Points
The current MVP uses a simple placement-based score with a **maximum of 250 points**:
- #1 = 250 points
- #2 = 249 points
- #3 = 248 points
- ...
- #250 = 1 point
- #251+ = 0 points

This formula can be changed later without changing the public placement system.

## Production
Vercel can host the frontend/API and Supabase can provide Postgres/Auth. Review current plan limits and commercial-use terms before publishing at scale.
