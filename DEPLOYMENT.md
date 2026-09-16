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

## DigitalOcean test environment

The App Platform spec is in `.do/app.yaml`. It deploys `main` as one same-origin test app: the Vite frontend at `/`, Express API at `/api`, and a PostgreSQL 16 dev database. The pre-deploy job runs migrations and the idempotent demo seed.

In DigitalOcean, create an App from `ikhmend/zeeliin_app`, choose the spec, then add these encrypted runtime secrets before the first deployment: `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, and `METRICS_TOKEN`. Add the `SMTP_*` secrets too if password-reset email needs to be tested. Leave `VITE_API_URL` unset: the frontend already uses same-origin `/api`.

After deployment, verify `/health`, `/ready`, `/api-docs`, then sign in as `demo` / `DemoPass123`. The created database is a development database; use a managed PostgreSQL cluster before deploying production.

## Cloudflare Pages frontend

The frontend can be deployed to Cloudflare Pages while the Express API remains on DigitalOcean. Use a custom frontend domain and API subdomain under the same parent domain, for example `test.example.com` and `api.test.example.com`; this keeps authentication cookies same-site.

In Cloudflare Pages, connect this repository and configure:

- Root directory: `loan-system`
- Build command: `npm ci && npm run build`
- Build output directory: `dist`
- Environment variable: `VITE_API_URL=https://api.test.example.com/api`

Copy `loan-system/.env.cloudflare.example` as the value reference. Do not use `/api` here: Pages does not proxy requests to an external API. No `_redirects` file is needed because Pages automatically serves this React app as an SPA.

On the DigitalOcean API service, configure these runtime values for the Cloudflare test domain:

```sh
CORS_ORIGIN=https://test.example.com
FRONTEND_URL=https://test.example.com
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
```

Connect `test.example.com` to the Pages project in **Workers & Pages → Custom domains**, and point `api.test.example.com` at the DigitalOcean API with HTTPS enabled. For temporary Pages preview URLs on a different site, add that exact URL to `CORS_ORIGIN` and use `COOKIE_SAME_SITE=none`; use the custom test domain for normal authentication testing.
