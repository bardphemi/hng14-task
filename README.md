# hng14-stg0-task

TypeScript + Express API for:
- classifying a name by gender (`Genderize`)
- creating and storing enriched profiles (`Genderize` + `Agify` + `Nationalize`)
- searching, filtering, and deleting profiles from PostgreSQL

## Current Features
- `GET /health` health check route
- `GET /api/classify?name=...` returns normalized gender prediction
- `POST /api/profiles` creates a profile (or returns existing one by name)
- `POST /api/profiles/upload` bulk profile upload via file (`multipart/form-data`)
- `GET /api/profiles` fetches profiles with filters, sorting, and pagination
- `GET /api/profiles/search?q=...` natural-language profile search
- `GET /api/profiles/:id` fetches profile by id
- `DELETE /api/profiles/:id` deletes a profile by id
- Structured success/error responses via middleware
- Winston logging with daily rotate file transport
- Jest unit + integration tests (`supertest` + `nock`)

## Stack
- Node.js + TypeScript
- Express 5
- PostgreSQL + Knex migrations
- Axios for upstream API calls
- Joi validation for request schemas
- Jest / ts-jest for testing

## Requirements
- Node.js 18+
- npm or Yarn
- PostgreSQL database

## Environment Variables
Create a `.env` file:

```env
PORT=3000
GENDERIZE_URL=https://api.genderize.io
AGIFY_API_URL=https://api.agify.io
NATIONALIZE_API_URL=https://api.nationalize.io
DEV_DATABASE_URL=postgresql://username:password@localhost:5432/db_name
DATABASE_URL=postgresql://username:password@host:5432/db_name
NODE_ENV=development
```

Notes:
- `DEV_DATABASE_URL` is used in development.
- `DATABASE_URL` is used in production config.

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

Production migration commands are also available:
- `yarn migrate:prod`
- `yarn rollback:prod`

## API Endpoints
Base URL: `http://localhost:<PORT>`

### Health
`GET /health`

Response:
```json
{
  "message": "API is healthy"
}
```

### Classify Name
`GET /api/classify?name=anna`

Success response:
```json
{
  "status": "success",
  "message": "Gender prediction successful",
  "data": {
    "name": "anna",
    "gender": "female",
    "sample_size": 200,
    "probability": 0.9,
    "is_confident": true,
    "processed_at": "2026-04-15T01:00:00.000Z"
  }
}
```

### Create Profile
`POST /api/profiles`

Request body:
```json
{
  "name": "anna"
}
```

### Bulk Upload Profiles
`POST /api/profiles/upload`

Request format:
- `multipart/form-data`
- file field name: `file`

### Fetch Profiles (Structured Filters)
`GET /api/profiles`

Optional query params:
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

### Search Profiles (Natural Language)
`GET /api/profiles/search?q=...`

Examples:
- `female adults in nigeria`
- `young guys in kenya above 20`
- `females in canada between 30 and 40`

Also supports:
- `page` (default `1`)
- `limit` (default `10`, max `50`)

### Fetch Profile by Id
`GET /api/profiles/:id`

### Delete Profile by Id
`DELETE /api/profiles/:id`

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
yarn migrate:prod
yarn rollback:prod
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
