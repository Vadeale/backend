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

## GitHub Secrets for CI/CD

Add the following secrets in the `backend` repository:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PORT`
- `DEPLOY_SSH_KEY`
- `PORT`
- `STORAGE_ROOT`
- `YOOKASSA_SHOP_ID`
- `YOOKASSA_SECRET_KEY`
- `PAYMENT_RETURN_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SYNCHRONIZE`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

Add the following secrets in the `frontend` repository:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PORT`
- `DEPLOY_SSH_KEY`
- `VITE_API_BASE_URL`
