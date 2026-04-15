# hng14-stg0-task

TypeScript + Express API for:
- classifying a name by gender (`Genderize`)
- creating and storing enriched profiles (`Genderize` + `Agify` + `Nationalize`)
- fetching and deleting profiles from PostgreSQL

## Current Features
- `GET /health` health check route
- `GET /api/classify?name=...` returns normalized gender prediction
- `POST /api/profiles` creates a profile (or returns existing one by name)
- `GET /api/profiles` fetches profiles with optional filters
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

### Fetch Profiles
`GET /api/profiles`

Optional query params:
- `gender`
- `country_id`
- `age_group`

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
