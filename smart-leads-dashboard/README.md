# Smart Leads Dashboard

A production-grade CRM leads management application built with the MERN stack and TypeScript end-to-end.

> **Screenshots placeholder** — add screenshots to `/docs/screenshots/` and reference them here.

---

## Tech Stack

| Layer       | Technology                                                                 |
|-------------|----------------------------------------------------------------------------|
| Frontend    | React 18, TypeScript, TailwindCSS, React Query, Zustand, React Hook Form, Zod |
| Backend     | Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, bcryptjs          |
| Dev Tools   | Docker, Docker Compose, ESLint, Prettier                                   |
| Docs        | README.md, .env.example, inline JSDoc                                      |

---

## Features

- **JWT Authentication** — register, login, token-based sessions (7-day expiry)
- **RBAC** — `admin` and `sales_user` roles with enforced route-level permissions
- **Full Lead CRUD** — create, read, update, delete leads
- **Advanced Filtering** — filter by status, source, free-text search (debounced 300ms)
- **Sorting & Pagination** — latest/oldest sort, server-side pagination with metadata
- **CSV Export** — admin-only export respecting active filters
- **Dark Mode** — toggle with localStorage persistence
- **Skeleton Loaders** — animated loading states on all data-fetching UI
- **Empty & Error States** — helpful messages with retry actions
- **Form Validation** — React Hook Form + Zod with inline error messages
- **Toast Notifications** — success/error feedback via react-hot-toast
- **Responsive Layout** — mobile, tablet, and desktop support; collapsible sidebar
- **Docker Compose** — one-command startup for all three services
- **Seed Script** — pre-populates demo users and 25 sample leads

---

## Folder Structure

```
smart-leads-dashboard/
├── docker-compose.yml
├── .env.example
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── app.ts
│       ├── config/db.ts
│       ├── types/
│       ├── models/
│       ├── middleware/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── schemas/
│       ├── utils/
│       └── scripts/seed.ts
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── types/
        ├── store/
        ├── api/
        ├── hooks/
        ├── components/
        │   ├── ui/
        │   ├── layout/
        │   └── leads/
        ├── pages/
        └── utils/
```

---

## Deploy to Production (Vercel + Railway)

### Architecture
- **Frontend** → [Vercel](https://vercel.com) (free, global CDN, perfect for Vite/React)
- **Backend** → [Railway](https://railway.app) (free tier, runs Express natively)
- **Database** → [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free M0 cluster — already configured)

---

### Step 1 — Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select `sohel87399/gigflow` → set **Root Directory** to `smart-leads-dashboard/backend`
3. Railway auto-detects `railway.json` and runs `npm install && npm run build` then `npm start`
4. Set these environment variables in Railway dashboard:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb+srv://239x1a3365_db_user:PMRbyKrsghTeDyxS@cluster0.onkwujn.mongodb.net/smartleads?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | *(generate a strong random string)* |
| `JWT_EXPIRES_IN` | `7d` |
| `BCRYPT_SALT_ROUNDS` | `12` |
| `CORS_ORIGIN` | *(your Vercel frontend URL — set after Step 2)* |

5. Copy your Railway backend URL e.g. `https://smartleads-backend.up.railway.app`

---

### Step 2 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import `sohel87399/gigflow`
2. Set **Root Directory** to `smart-leads-dashboard/frontend`
3. Vercel auto-detects `vercel.json` (Vite framework, `dist` output, SPA rewrites)
4. Add this environment variable before deploying:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://your-backend.up.railway.app/api` |

5. Click **Deploy** — your frontend URL will be e.g. `https://smartleads-frontend.vercel.app`

---

### Step 3 — Wire CORS

Go back to Railway → backend service → update `CORS_ORIGIN` to your Vercel URL:
```
CORS_ORIGIN=https://smartleads-frontend.vercel.app
```
Railway will auto-redeploy.

---

### Step 4 — Seed demo data (optional)

Railway dashboard → backend service → **Shell** tab:
```bash
npm run seed
```

Demo credentials:
- **Admin:** `admin@demo.com` / `Admin@123`
- **Sales:** `sales@demo.com` / `Sales@123`

---

## Deploy to Render

### Prerequisites
- A [Render](https://render.com) account
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster (M0)

### Steps

**1. Set up MongoDB Atlas**
- Create a free M0 cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
- Create a database user (username + password)
- Under **Network Access**, add `0.0.0.0/0` to allow connections from Render
- Copy your connection string: `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/smartleads`

**2. Push to GitHub**
```bash
git add .
git commit -m "chore: add render deployment config"
git push
```

**3. Deploy on Render**
- Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
- Connect your GitHub repo — Render will detect `render.yaml` automatically
- It will create two services: `smartleads-backend` and `smartleads-frontend`

**4. Set environment variables**

For **smartleads-backend**, set these in the Render dashboard:
| Variable | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `CORS_ORIGIN` | Your frontend URL e.g. `https://smartleads-frontend.onrender.com` |

For **smartleads-frontend**, set:
| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | Your backend URL e.g. `https://smartleads-backend.onrender.com/api` |

> **Note:** `VITE_API_BASE_URL` is a Vite build-time variable. After setting it, trigger a manual redeploy of the frontend service so it gets baked into the bundle.

**5. Seed demo data (optional)**
In the Render dashboard → `smartleads-backend` → **Shell**:
```bash
npm run seed
```

---

## Quick Start (Local — Docker)

The fastest way to run locally. Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
# 1. Clone the repo
git clone https://github.com/sohel87399/gigflow.git
cd gigflow/smart-leads-dashboard

# 2. Create backend env file
copy .env.example backend\.env
# Edit backend/.env — the defaults work as-is for local Docker

# 3. Create frontend env file
copy frontend\.env.example frontend\.env
# VITE_API_BASE_URL=http://localhost:5000/api  ← already set correctly

# 4. Start everything
docker compose up --build

# 5. Seed demo data (first time only)
docker compose exec backend npm run seed
```

Services:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **MongoDB:** localhost:27017

Demo login:
- Admin: `admin@demo.com` / `Admin@123`
- Sales: `sales@demo.com` / `Sales@123`

---

## Quick Start (Local — Manual, no Docker)

Requires Node.js 20+ and a running MongoDB instance (local or Atlas).

### Backend

```bash
cd smart-leads-dashboard/backend

# Install dependencies
npm install

# Create env file
copy .env.example .env
# Edit .env — set MONGO_URI to your MongoDB connection string

# Run in dev mode (hot reload)
npm run dev

# Seed demo data (optional)
npm run seed
```

Backend runs at: http://localhost:5000

### Frontend

```bash
cd smart-leads-dashboard/frontend

# Install dependencies
npm install

# Create env file
copy .env.example .env
# VITE_API_BASE_URL=http://localhost:5000/api  ← already correct

# Run dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

**Prerequisites:** Docker and Docker Compose installed.

```bash
# 1. Clone the repository
git clone <repo-url>
cd smart-leads-dashboard

# 2. Copy and configure environment files
cp .env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env — set JWT_SECRET to a strong random string

# 3. Start all services
docker compose up --build

# 4. (Optional) Seed demo data
docker compose exec backend npm run seed
```

Services will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **MongoDB:** localhost:27017

---

## Manual Setup

### Backend

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env — set MONGO_URI, JWT_SECRET, etc.

# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Seed demo data
npm run seed
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env — set VITE_API_BASE_URL

# Development server
npm run dev

# Production build
npm run build
npm run preview
```

---

## Environment Variables

### `backend/.env`

| Variable            | Default                              | Description                          |
|---------------------|--------------------------------------|--------------------------------------|
| `PORT`              | `5000`                               | Express server port                  |
| `MONGO_URI`         | `mongodb://localhost:27017/smartleads` | MongoDB connection string           |
| `JWT_SECRET`        | *(required)*                         | Secret key for signing JWTs          |
| `JWT_EXPIRES_IN`    | `7d`                                 | JWT expiry duration                  |
| `BCRYPT_SALT_ROUNDS`| `12`                                 | bcrypt hashing rounds                |
| `NODE_ENV`          | `development`                        | Node environment                     |
| `CORS_ORIGIN`       | `http://localhost:3000`              | Allowed CORS origin                  |

### `frontend/.env`

| Variable             | Default                        | Description              |
|----------------------|--------------------------------|--------------------------|
| `VITE_API_BASE_URL`  | `http://localhost:5000/api`    | Backend API base URL     |

---

## API Documentation

All responses follow the `ApiResponse<T>` wrapper:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... }
}
```

### Auth Endpoints

#### `POST /api/auth/register`

Register a new user.

**Request body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePass@123",
  "role": "sales_user"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "_id": "664abc...",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "sales_user",
      "createdAt": "2024-06-15T10:00:00.000Z"
    },
    "token": "eyJhbGci..."
  }
}
```

---

#### `POST /api/auth/login`

Authenticate and receive a JWT.

**Request body:**
```json
{
  "email": "admin@demo.com",
  "password": "Admin@123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "_id": "...", "name": "Admin User", "email": "admin@demo.com", "role": "admin" },
    "token": "eyJhbGci..."
  }
}
```

---

### Lead Endpoints

All lead endpoints require: `Authorization: Bearer <token>`

---

#### `GET /api/leads`

Get a paginated, filtered list of leads.

**Query parameters:**

| Param    | Type                                    | Default  | Description              |
|----------|-----------------------------------------|----------|--------------------------|
| `page`   | number                                  | `1`      | Page number              |
| `limit`  | number (max 100)                        | `10`     | Items per page           |
| `status` | `New\|Contacted\|Qualified\|Lost`       | —        | Filter by status         |
| `source` | `Website\|Instagram\|Referral`          | —        | Filter by source         |
| `search` | string                                  | —        | Search name or email     |
| `sort`   | `latest\|oldest`                        | `latest` | Sort by createdAt        |

**Response `200`:**
```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "data": [ { "_id": "...", "name": "Alice Johnson", "email": "alice@example.com", "status": "New", "source": "Website", "createdAt": "..." } ],
  "pagination": { "total": 47, "page": 1, "limit": 10, "totalPages": 5 }
}
```

---

#### `POST /api/leads`

Create a new lead.

**Request body:**
```json
{
  "name": "Bob Martinez",
  "email": "bob@example.com",
  "status": "New",
  "source": "Instagram"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { "_id": "...", "name": "Bob Martinez", "email": "bob@example.com", "status": "New", "source": "Instagram", "createdBy": "...", "createdAt": "..." }
}
```

---

#### `GET /api/leads/:id`

Get a single lead by ID.

**Response `200`:**
```json
{
  "success": true,
  "message": "Lead retrieved successfully",
  "data": { "_id": "...", "name": "Bob Martinez", ... }
}
```

---

#### `PUT /api/leads/:id`

Update a lead (partial update supported).

**Request body:**
```json
{
  "status": "Qualified",
  "source": "Referral"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": { "_id": "...", "status": "Qualified", ... }
}
```

---

#### `DELETE /api/leads/:id` *(admin only)*

Delete a lead.

**Response `200`:**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

#### `GET /api/leads/export/csv` *(admin only)*

Export leads as a CSV file download. Accepts the same `status`, `source`, and `search` query params as the list endpoint (no pagination).

**Response:** `text/csv` file download with `Content-Disposition: attachment; filename="leads.csv"`

---

## RBAC Roles

| Action              | `admin` | `sales_user` |
|---------------------|:-------:|:------------:|
| View leads          | ✅      | ✅           |
| Create leads        | ✅      | ✅           |
| Update leads        | ✅      | ✅           |
| Delete leads        | ✅      | ❌           |
| Export CSV          | ✅      | ❌           |

---

## Git Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix       | When to use                                      |
|--------------|--------------------------------------------------|
| `feat:`      | New feature                                      |
| `fix:`       | Bug fix                                          |
| `chore:`     | Build process, tooling, dependency updates       |
| `refactor:`  | Code change that neither fixes a bug nor adds a feature |
| `docs:`      | Documentation only changes                       |
| `style:`     | Formatting, missing semicolons, etc.             |
| `test:`      | Adding or updating tests                         |

**Examples:**
```
feat: add CSV export endpoint for admin users
fix: resolve JWT expiry not returning 401
chore: upgrade mongoose to v8
docs: add API documentation to README
```
