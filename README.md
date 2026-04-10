# hng14-stg0-task

A small TypeScript + Express API that classifies a first name by gender using the Genderize upstream service. It exposes a single public endpoint and includes unit and integration tests.

## Features
- `GET /api/classify?name=...` returns a normalized prediction
- `GET /health` returns a simple health status
- Centralized error handling and structured success responses
- Logging via Winston with daily-rotating files
- Unit and integration test suites (Jest + Supertest + Nock)

## Requirements
- Node.js 18.x
- Yarn 1.x

## Setup
```bash
# install dependencies
 yarn install

# start in dev mode
 yarn dev
```

## Environment
Create a `.env` file or export variables:
- `PORT` (example: `3000`)
- `GENDERIZE_URL` (example: `https://api.genderize.io`)

## API
### `GET /health`
Returns:
```json
{ "message": "API is healthy" }
```

### `GET /api/classify?name=anna`
Returns:
```json
{
  "status": "success",
  "data": {
    "name": "anna",
    "gender": "female",
    "sample_size": 200,
    "probability": 0.9,
    "is_confident": true,
    "processed_at": "2026-01-01T00:00:00.000Z"
  }
}
```

## Scripts
```bash
yarn dev
yarn build
yarn start
yarn test
yarn test:unit
yarn test:integration
```

## Tests
```bash
# all tests
 yarn test

# unit only
 yarn test:unit

# integration only
 yarn test:integration
```
