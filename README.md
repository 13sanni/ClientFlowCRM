# ClientFlow CRM

ClientFlow is a modern, lightweight, and performant Customer Relationship Management (CRM) application. It is built using a modern decoupled architecture, combining a React/Vite frontend with a Node.js/Express backend, all powered by a PostgreSQL database via Prisma ORM.

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Framer Motion (for animations)
- **State Management:** Zustand
- **Routing:** React Router v7
- **Date Handling:** date-fns

### Backend
- **Framework:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Architecture:** Domain-Driven Design (DDD)

## Project Structure

The repository is split into two primary environments:

- `/frontend`: Contains the React UI and presentation logic.
- `/backend`: Contains the REST API, Prisma schema, and business logic.

## Getting Started

### 1. Database Setup
Ensure you have a local instance of PostgreSQL running. Create a new database for the application (e.g., `clientflow_crm`).

### 2. Backend Setup
Navigate to the backend directory and configure your environment variables:
```bash
cd backend
cp .env.example .env
```
Open the `.env` file and set your `DATABASE_URL` and `JWT_SECRET`.

Install dependencies and run the Prisma migrations and seed script:
```bash
npm install
npm run prisma:migrate
npm run seed
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Logging In
Once both servers are running, you can log into the application using the default credentials created by the seed script:
- **Email:** `admin@clientflow.io`
- **Password:** `Password@123`

## Features
- **Client Management:** Track contacts, companies, and their details.
- **Deals Pipeline:** Interactive Kanban board to manage sales stages and pipeline value.
- **Task Management:** Stay on top of priorities with a centralized task queue.
- **Invoicing:** Monitor billing and outstanding receivables.
- **Dashboard:** A bird's-eye view of your metrics, recent activity, and priorities.
