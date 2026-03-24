# Auth + PostgreSQL

## PostgreSQL

1. Start database:

```bash
docker compose up -d postgres
```

2. Copy env template and set real values if needed:

```bash
cp .env.example .env
```

## Run backend

```bash
npm install
npm run start:dev
```

Backend auth endpoints:
- `POST /api/auth/register` body: `{ "login": "user_1", "password": "secret123" }`
- `POST /api/auth/login` body: `{ "login": "user_1", "password": "secret123" }`
- `GET /api/auth/me` header: `Authorization: Bearer <token>`

## Run frontend

```bash
cd ../frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` if backend runs on a different host/port.

## Quick check

1. Register a new user in UI (`login + password`).
2. Log in with the same credentials.
3. Verify "Личный кабинет" shows the user login.
4. Click logout and verify user session is removed.
# backend
