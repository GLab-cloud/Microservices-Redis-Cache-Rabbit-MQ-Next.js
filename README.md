# Microservices Redis Cache RabbitMQ Next.js

A modern, full-stack microservices repository combining Node.js/Express TypeScript backend services with a Next.js frontend. The system uses RabbitMQ for message queuing and Redis for caching to provide a scalable, event-driven architecture.

## What's changed

This README was updated to reflect the current repository contents:
- A Next.js frontend exists in `frontend/` (Next 15, React 19).
- Top-level `server.js` contains a small RabbitMQ connectivity/test script that sends a test message to a queue.
- All three microservices (`services/author`, `services/blog`, `services/user`) include TypeScript sources in `src/` and compiled output in `dist/`.
- Services use the `FRONTEND_URL` environment variable for CORS and `REDIS_REST_URL` for Redis connectivity.
- A `.devcontainer/` folder and devcontainer configuration are included for local development in Codespaces or Docker.

## Repository structure

```
.
├── server.js               # Top-level RabbitMQ connection/test script
├── package.json            # Root dependencies and start script
├── frontend/               # Next.js frontend (Next 15, React 19)
├── services/
│   ├── author/             # Author microservice (TypeScript)
│   ├── blog/               # Blog microservice (TypeScript) with Redis caching
│   └── user/               # User microservice (TypeScript)
└── .devcontainer/          # Devcontainer and docker-compose for development
```

## Technology stack

- Runtime: Node.js (ES Modules)
- Language: TypeScript (backend services)
- Frontend: Next.js 15 + React 19
- Web framework: Express.js
- Message queue: RabbitMQ (AMQP)
- Cache: Redis
- Databases: Neon PostgreSQL (serverless) + MongoDB
- Storage: Cloudinary
- Auth: JWT
- AI: Google Generative AI

## Quick start

Prerequisites:
- Node.js 18+
- RabbitMQ server (can run locally or via Docker)
- Redis server/instance
- Neon PostgreSQL account (or local Postgres)
- MongoDB (local or Atlas)
- Cloudinary account (for uploads)
- Google API credentials if using AI features

1. Clone the repository

```bash
git clone https://github.com/GLab-cloud/Microservices-Redis-Cache-Rabbit-MQ-Next.js.git
cd Microservices-Redis-Cache-Rabbit-MQ-Next.js
```

2. Install root dependencies

```bash
npm install
```

3. Install frontend and service dependencies

```bash
cd frontend && npm install
cd ../services/author && npm install
cd ../blog && npm install
cd ../user && npm install
```

4. Environment variables

Create `.env` files for each service. The services now also expect `FRONTEND_URL` for CORS.

Root / top-level `.env` (used by `server.js` test script):

```env
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
```

services/author/.env

```env
PORT=5001
FRONTEND_URL=http://localhost:3000
Cloud_Name=<your_cloudinary_name>
Cloud_Api_Key=<your_cloudinary_api_key>
Cloud_Api_Secret=<your_cloudinary_api_secret>
DATABASE_URL=<your_neon_postgresql_url>
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
GOOGLE_API_KEY=<your_google_api_key>
```

services/blog/.env

```env
PORT=5002
FRONTEND_URL=http://localhost:3000
REDIS_REST_URL=<your_redis_url>
JWT_SECRET=<your_jwt_secret>
DATABASE_URL=<your_neon_postgresql_url>
MONGODB_URI=<your_mongodb_connection_string>
GOOGLE_API_KEY=<your_google_api_key>
```

services/user/.env

```env
PORT=5003
FRONTEND_URL=http://localhost:3000
DATABASE_URL=<your_neon_postgresql_url>
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

Notes:
- The top-level `server.js` reads `RABBITMQ_DEFAULT_USER` and `RABBITMQ_DEFAULT_PASS` when connecting to RabbitMQ. It sends a test message to a queue named `test_queue 8` (this is a simple connectivity/test script).
- The blog and author services call consumer functions on startup to subscribe to cache invalidation and other events (see `startCacheInvalidationConsumer()` and `connectToRabbitMQ()` in the service code).

## Running services (development)

Start RabbitMQ and Redis using your preferred method (local install, Docker, or the `.devcontainer/docker-compose.yaml` provided).

Start the root RabbitMQ test script (optional, just for testing connectivity):

```bash
npm start
```

Start the frontend:

```bash
cd frontend
npm run dev
# Next.js runs on http://localhost:3000 by default
```

Start Author service (development):

```bash
cd services/author
npm run dev
```

Start Blog service (development):

```bash
cd services/blog
npm run dev
```

Start User service (development):

```bash
cd services/user
npm run dev
```

Each service includes `build`, `start`, and `dev` scripts in its package.json. The `dev` script uses `concurrently` + `nodemon` + `tsc -w` to watch and restart compiled code.

## API endpoints

Author Service: mounted at `/api/v1` (configured in `services/author/src/server.ts`)

Blog Service: mounted at `/api/v1` (configured in `services/blog/src/server.ts`)
- Blog service uses Redis for caching and subscribes to a RabbitMQ queue to receive cache invalidation messages.

User Service: mounted at `/api/v1` (configured in `services/user/src/server.ts`)

Frontend: Next.js pages and API routes live in `frontend/src/app` and will call the backend services using configured environment variables / a proxy in production.

## Databases

- Neon PostgreSQL: relational tables for blogs, comments, saved blogs (Author service initializes tables on startup if missing).
- MongoDB: document store for flexible models (users, blogs as configured by service code).

## Development container

The `.devcontainer/` directory includes a `devcontainer.json` and a `docker-compose.yaml` to start Redis and RabbitMQ locally for development. Use GitHub Codespaces or VS Code Remote - Containers to open the repo in the provided development environment.

## Notes and tips

- The frontend is built with Next 15 and React 19; ensure your environment supports these versions.
- The blog service depends on `REDIS_REST_URL` — provide a valid Redis URL (or run Redis locally with default settings and set the correct URL).
- Check the service `dist/` folders for the compiled outputs if you prefer running the compiled JS directly (`npm run build` then `npm start`).

## Contributing

Contributions welcome — open an issue or submit a pull request. If you add features that change environment variable names or ports, please update this README to keep it in sync with the code.

## License

ISC — see `package.json` for details.

---

Repository: GLab-cloud/Microservices-Redis-Cache-Rabbit-MQ-Next.js
