# Deployment runtime

## Required services

- PostgreSQL
- SMTP server for password-reset email
- HTTPS reverse proxy

Copy `backend/.env.example` and `loan-system/.env.example` into the deployment secret/config system. Do not commit real `.env` files.

Set `TRUST_PROXY_HOPS` to the exact number of trusted proxies between the client and Express. Use `1` for a single Nginx/load-balancer proxy. Set `COOKIE_SECURE=true` under HTTPS. Prefer serving the frontend and `/api` from the same site; otherwise configure `CORS_ORIGIN` and `COOKIE_SAME_SITE` explicitly.

## Database

From `backend/`, run:

```sh
npm run db:migrate
npm run db:seed
```

The seed creates demo login `demo` / `DemoPass123` with one personal loan and three installments.

## Probes and monitoring

- `GET /health`: process liveness; does not query dependencies.
- `GET /ready`: PostgreSQL readiness; returns HTTP 503 when unavailable or shutting down.
- `GET /metrics`: Prometheus text metrics. Set `METRICS_TOKEN` and send it as `Authorization: Bearer <token>`.

Application and request logs are emitted as one JSON object per line. Use `LOG_LEVEL=info` in production.

Send `SIGTERM` during deployment. The server stops accepting new requests, closes PostgreSQL connections, and exits after in-flight requests finish (10-second forced timeout).
