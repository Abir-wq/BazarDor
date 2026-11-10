# Deploying Bazar Dor (Vercel + PostgreSQL)

## Why a database is necessary

The default local `bazar-auth.sqlite` file works on your PC, but local SQLite is not reliable on Vercel serverless storage. For deployed authentication, use a persistent PostgreSQL database provided by a service you control (Neon, Supabase, or other hosted PostgreSQL).

## Overview

1. Make a new GitHub repository, and push **your own project history** with meaningful changes. The assignment requests 8 real commits; never invent a history just to meet the count.
2. Create a managed PostgreSQL database. Copy its database URL into your Vercel environment as `DATABASE_URL`.
3. In the Vercel project dashboard, set environment variables (do not commit the values):

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
BETTER_AUTH_URL=https://YOUR-REAL-DOMAIN
BETTER_AUTH_SECRET=SAME_SECURE_RANDOM_SECRET_YOU_GENERATED
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

4. Run `npx auth@latest migrate` **against that production database**, only from a trusted environment with the production DATABASE_URL loaded. Review the changes before approval. Never run an unexpected migration.
5. Deploy on Vercel and use its public URL. Add the corresponding production callback URLs in GitHub/Google developer portals.
6. Test the URLs `/`, `/signin`, `/signup`, `/category/chal`, `/product/1`, `/profile`, `/profile/edit`, and the direct refresh of the two dynamic routes.
7. Repeat tests on a mobile viewport and verify no red errors in developer console or deployment logs.

**Note**: Public product data still depends on the official external API being available. This package does not include fake static price records.
