# Role-Based Store Rating System 🚀

A full-stack, high-performance web application featuring a futuristic "tech-terminal" aesthetic. This system enables users to rate stores, owners to monitor performance analytics, and administrators to manage the global registry of users and entities.

## ✨ Features

- **Role-Based Access Control (RBAC)**: Secure multi-role architecture for `ADMIN`, `OWNER`, and `USER`.
- **Futuristic UI/UX**: Premium dark-mode design with neon accents, dynamic grid backgrounds, and smooth micro-animations.
- **Analytics Dashboard**: Real-time performance metrics and charts for store owners.
- **Performance Optimized**: Database indexing for efficient sorting and filtering across thousands of records.
- **Strict Validation**: comprehensive input validation on both frontend and backend (e.g., specific name length and complex password protocols).
- **Accessibility**: Screen-reader optimized with full ARIA support and title attributes.

## 🛠 Tech Stack

### Frontend

- **React (Vite)**: Lightning-fast development and build pipeline.
- **TypeScript**: Full type safety across components and API interactions.
- **Tailwind CSS**: Custom design system with utility-first neon styling.
- **Lucide React**: High-quality SVG icons for a technical aesthetic.
- **Recharts**: Interactive data visualization for performance metrics.
- **React Hook Form**: Optimized form management with built-in validation.

### Backend

- **NestJS**: Enterprise-grade Node.js framework.
- **PostgreSQL**: Robust relational data storage.
- **Prisma (ORM)**: Type-safe database client and migration tool.
- **JWT (Passport)**: Stateless secure authentication flow.
- **Bcrypt**: Industrial-strength password hashing.
- **Class Validator**: Data sanitization and DTO validation.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: Running instance

### 1. Database Configuration

1. Create a PostgreSQL database (e.g., `intern_challenge`).
2. Update the `backend/.env` file with your connection details:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/intern_challenge"
   JWT_SECRET="f3a2b1c0d9e8f7g6... (your secret key)"
   ```

### 2. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev  # Apply database schema
npx prisma db seed      # Initialize with Admin, Owner, and 20+ test users/stores
npm run start:dev       # Launch server at http://localhost:3000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev             # Launch dev server at http://localhost:5173
```

#### Frontend Environment

Create `frontend/.env` (or set it in your hosting provider) to point the UI to your backend:

```env
VITE_API_URL="http://localhost:3000"
```

In production, set `VITE_API_URL` to your public backend URL before running the frontend build.

---

## 🔐 Default Access Protocols (Seeded)

| Sector | Identifier (Email) | Access Key (Password) |
| :--- | :--- | :--- |
| **System Admin** | `admin@admin.com` | `Password@123` |
| **Store Owner** | `owner@store.com` | `Password@123` |
| **Regular User** | `user@user.com` | `Password@123` |

---

## 📁 System Architecture

- `backend/`: NestJS application logic, database migrations (Prisma), and seed scripts.
- `frontend/`: React source code, Tailwind design system, and state management.
- `start.ps1`: Automated PowerShell script for concurrent service initialization.

---

## 🛠 Development Toolbox

- **Force Rebuild**: `npm run build` (frontend/backend)
- **Database Explorer**: `npx prisma studio` (runs on backend)
- **Git Repository**: [View Source on GitHub](https://github.com/kumarmukul70946-cmyk/role-based-rating-system)

---
*Created for the FullStack Intern Coding Challenge.*

## 🚢 Non-Vercel Deployment (Simple)

**Backend**
1. `cd backend`
2. `npm install`
3. `npm run build`
4. `npm run start:prod` (serves API on port 3000 by default)

**Frontend**
1. `cd frontend`
2. Set `VITE_API_URL` to your backend URL
3. `npm install`
4. `npm run build`
5. Host `frontend/dist` with any static file server (Nginx, Apache, Netlify, S3, etc.)
