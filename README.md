# FitAIX — Full-Stack Elite AI Fitness Application Workspace

This repository contains the production-ready project foundation for **FitAIX**, structured strictly according to the clean modular clean-architecture guidelines.

## Tech Stack Overview

### Frontend (`frontend/web` & `frontend/app`)
- **React 19 & TypeScript**
- **Vite** (bundler)
- **Tailwind CSS & PostCSS** (styling design system)
- **TanStack Query** (React Query)
- **Zustand** (global state store)
- **React Router DOM** (navigation & layouts)
- **React Hook Form & Zod** (validated forms)
- **Axios** (REST requests)
- **Framer Motion & Recharts** (animations & data visuals)

### Backend (`backend/`)
- **Python / FastAPI** (REST API endpoints & CORS security)
- **Prisma client for python** (PostgreSQL database ORM client)
- **redis** (caching and events queues connection)
- **pyjwt & bcrypt** (JWT access token lifecycle & password encryption)
- **secure** (Helmet-equivalent security headers)
- **cloudinary** (media uploads storage)

---

## Directory Structure

```
fitaix/
├── backend/                  # FastAPI Backend API Server
│   ├── services/             # Clean Architecture Modular Services
│   │   ├── 01_adaptive_planning_engine/
│   │   ├── 02_workout_version_control/
│   │   ├── ... (18 engines & components)
│   │   └── authentication/
│   ├── jobs/                 # Cron/Background job scripts
│   ├── core/                 # Settings, Pool, Security, and Exceptions middlewares
│   └── prisma/               # Database ORM connection client mapping schema
├── frontend/
│   ├── web/                  # Next-gen React Web Frontend
│   └── app/                  # Mobile-ready React Web Client
└── docker-compose.yml        # Orchestration configurations
```

---

## Quick Start Development

### 1. Running via Docker Compose
To start the entire environment (database, caching engine, API services, and Nginx-based frontend servers):
```bash
docker-compose up --build
```
- **Backend API Docs (Swagger)**: http://localhost:8000/api/v1/docs
- **Frontend Web**: http://localhost:3000
- **Frontend App**: http://localhost:3001

### 2. Manual Local Development

#### Backend Setup:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or `.venv\\Scripts\\activate` on Windows
pip install -r requirements.txt
prisma generate --schema=prisma/schema.prisma
uvicorn main:app --reload --port 8000
```

#### Frontend Setup (App or Web):
```bash
cd frontend/web
npm install
npm run dev
```
