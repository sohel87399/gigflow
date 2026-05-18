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

## Quick Start (Docker)

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
