# COMP229 Assignment 3 — Full-stack portfolio

Zohaib Syed · 301536260

Built from Assignment 2, preserving the existing Next.js portfolio design. React forms use Material UI. Express APIs and MongoDB store projects, qualifications, contacts, and accounts.

## Run locally

Requires Node 22.13+ and MongoDB running locally (or an Atlas connection).

```sh
npm ci
npm --prefix client ci
cp .env.example .env
# Edit .env: configure JWT_SECRET, MongoDB, and admin credentials.
npm run seed
npm run dev
```

Open http://localhost:3001. Express runs on http://localhost:5002. The separate `PortfolioLab3` database preserves earlier assignment data. The seed command creates an admin directly in MongoDB and inserts the original portfolio content only when each content collection is empty. It preserves existing records and never resets an existing admin's password. Seeded project completion dates and the expected education completion date are editable defaults to review before submission.

On this workstation, `.env` is configured for MongoDB Atlas and the separate `PortfolioLab3` database has been seeded. Admin email/password are in that ignored file; do not commit or record its contents. Regular users register through `/signup`.

## Features and roles

- Signup, JWT signin, cookie-based session restoration, and signout with token invalidation.
- New accounts always have the `user` role. Public API calls cannot assign roles.
- Public project and education pages load current records from MongoDB.
- Admin dashboard: create, read, update, and delete projects, qualifications, and contacts.
- Regular-user dashboard: view-only portfolio links. The backend independently enforces admin permissions.
- Public contact form saves first/last name, email, optional phone, and message. Contact records and user records are private to admins.
- Controlled forms, required fields, email/password checks, loading/error/success states, and delete confirmation dialogs.

## Verification

```sh
npm run verify
```

Runs 12 API integration tests against an isolated in-memory MongoDB, frontend ESLint, TypeScript validation, and a production build. Browser checks additionally covered admin signin, project create/edit and public persistence, member signup/view-only account, contact submission, education loading, and signout.

## API

All routes are under `/api` (or `/backend-api` through the frontend).

| Resource | Public | Admin |
| --- | --- | --- |
| Projects, qualifications | GET collection / GET by ID | POST, PUT by ID, DELETE by ID, DELETE collection |
| Contacts | POST | GET collection / GET by ID, PUT, DELETE |
| Users | POST (signup, user role only) | GET, PUT, DELETE |
| Auth | POST `/auth/signin` | — |

Any signed-in user may GET `/auth/profile` and POST `/auth/signout`; the assignment's GET `/auth/signout` alias is also supported. Authentication accepts the HTTP-only cookie or a bearer token. Cross-origin mutations are rejected. Signing out revokes all currently issued tokens for that account.

## Production hosting

The frontend and API can run together as one Node service, keeping cookies and requests on the same origin:

```sh
npm --prefix client run build
npm run start:production
```

Set `NODE_ENV=production`, `PORT`, an Atlas `MONGODB_URI`, `MONGODB_DB=PortfolioLab3`, a random `JWT_SECRET`, and `CLIENT_ORIGIN` equal to the exact HTTPS site origin. The Atlas database is already seeded. Admin credentials are only needed when running the seed script; they are not required as runtime environment variables. On Render, the service origin defaults to its provided `RENDER_EXTERNAL_URL`.

A Dockerfile and Render blueprint (`render.yaml`) are included. Hosting has not been deployed yet. Atlas credentials, network access, and the chosen hosting account must be configured first. The earlier Vercel frontend does not automatically contain these LAB 3 changes.

## Submission

See `docs/SUBMISSION_CHECKLIST.md`. Local evidence is in `docs/evidence/`: native 3568 × 2038 PNG captures of the real Brave window with the address bar visible and no pointer. The bookmarks bar is hidden and only the top window-controls strip is cropped. A capture manifest records each file’s dimensions and SHA-256 hash. Hosting and the walkthrough recording remain outstanding.
