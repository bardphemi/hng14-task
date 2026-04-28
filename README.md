# hng14-stg0-task

TypeScript + Express API for:
- classifying a name by gender (`Genderize`)
- creating and storing enriched profiles (`Genderize` + `Agify` + `Nationalize`)
- OAuth-based authentication with GitHub and access/refresh token rotation
- searching, filtering, and deleting profiles from PostgreSQL

## Current Features
- `GET /health` health check route (public)
- `GET /docs` Swagger UI (public)
- `GET /docs.json` OpenAPI JSON spec (public)
- `GET /auth/github` GitHub OAuth redirect (public)
- `GET /auth/github/callback` completes OAuth and returns tokens (public)
- `POST /auth/refresh` rotates refresh token and returns new access/refresh tokens (public)
- `POST /auth/logout` revokes refresh token via `x-refresh-token` header (public)
- `GET /api/classify?name=...` returns normalized gender prediction (protected)
- `POST /api/profiles` creates a profile (admin-only)
- `POST /api/profiles/upload` bulk profile upload via file (`multipart/form-data`, protected)
- `GET /api/profiles` fetches profiles with filters, sorting, and pagination (protected)
- `GET /api/profiles/search?q=...` natural-language profile search (protected)
- `GET /api/profiles/:id` fetches profile by id (protected)
- `DELETE /api/profiles/:id` deletes a profile by id (protected)
- `GET /api/users` fetch users route (protected)
- Structured success/error responses via middleware
- Winston logging with daily rotate file transport
- Jest unit + integration tests (`supertest` + `nock`)

## Access Control
- All `/api/*` routes require `Authorization: Bearer <access_token>`.
- `POST /api/profiles` requires an `admin` role.
- `/auth/*` routes are not behind `authCheck`.
- All `/api/profiles*` routes also require `x-api-version: 1`.

## Stack
- Node.js + TypeScript
- Express 5
- PostgreSQL + Knex migrations
- Axios for upstream API calls
- Joi validation for request schemas
- JWT for access tokens
- Jest / ts-jest for testing

## Requirements
- Node.js 18+
- npm or Yarn
- PostgreSQL database

## Environment Variables
Create a `.env` file:

```env
PORT=3000
NODE_ENV=development

# Database
DEV_DATABASE_URL=postgresql://username:password@localhost:5432/db_name
DATABASE_URL=postgresql://username:password@host:5432/db_name

# External classifiers
GENDERIZE_URL=https://api.genderize.io
AGIFY_API_URL=https://api.agify.io
NATIONALIZE_API_URL=https://api.nationalize.io

# Auth
JWT_ACCESS_SECRET=replace_with_strong_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_AUTH_URL=https://github.com/login/oauth/access_token
GITHUB_USER_URL=https://api.github.com/user
```

Notes:
- `DEV_DATABASE_URL` is used in development.
- `DATABASE_URL` is used in production config.
- `JWT_ACCESS_SECRET` is required for signing/verifying access tokens.

## Setup

```bash
yarn install
```

## Run

```bash
yarn dev
```

## Database Migration

```bash
yarn migrate
```

Rollback:

```bash
yarn rollback
```

Optional:
- `yarn seed`
- `yarn migrate:prod`
- `yarn rollback:prod`
- `yarn seed:prod`

## API Endpoints
Base URL: `http://localhost:<PORT>`

### Public
- `GET /health`
- `GET /docs`
- `GET /docs.json`
- `GET /auth/github`
- `GET /auth/github/callback?code=...`
- `POST /auth/refresh`
- `POST /auth/logout`

### Protected
All protected routes require:

```http
Authorization: Bearer <access_token>
```

- `GET /api/classify?name=anna`
- `GET /api/profiles`
- `GET /api/profiles/search?q=female adults in nigeria`
- `GET /api/profiles/:id`
- `DELETE /api/profiles/:id`
- `POST /api/profiles/upload`
- `GET /api/users`

Profile routes also require:

```http
x-api-version: 1
```

### Admin-only
- `POST /api/profiles`

### Fetch Profiles Query Params
- `gender`: `male | female`
- `country_id`: 2-letter country code (e.g. `NG`)
- `age_group`: `child | teenager | adult | senior`
- `min_age`
- `max_age`
- `min_gender_probability`
- `min_country_probability`
- `sort_by`: `age | created_at | gender_probability`
- `order`: `asc | desc`
- `page` (default `1`)
- `limit` (default `10`, max `50`)

## Scripts
```bash
yarn dev
yarn build
yarn start
yarn test
yarn test:unit
yarn test:integration
yarn migrate
yarn rollback
yarn seed
yarn migrate:prod
yarn rollback:prod
yarn seed:prod
```

## Testing
Run all tests:

```bash
yarn test
```

Run integration tests:

```bash
yarn test:integration
```

Run unit tests:

```bash
yarn test:unit
```
