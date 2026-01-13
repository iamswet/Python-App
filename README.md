# Job Portal (Node) — scaffold

This branch adds a Node + Express backend and a minimal React client for a job portal MVP.

Quick start (server):

1. Copy `.env.example` to `server/.env` and set DATABASE_URL and JWT_SECRET.
2. Install deps and run Prisma migrations:
   - cd server
   - npm install
   - npx prisma generate
   - npx prisma migrate dev --name init
   - npm run dev

Client:

1. cd client
2. npm install
3. npm run dev

Notes:
- The server stores file uploads in the directory specified by UPLOAD_DIR (default `./uploads`).
- This is an initial scaffold — complete production hardening (CORS, input validation, rate limiting, HTTPS, cloud storage, etc.) is not included.
