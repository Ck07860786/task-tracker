# Task & Time Tracking App

A full-stack Task and Time Tracking application that allows users to create and manage tasks, track time spent on individual tasks using a real-time timer, and view daily productivity summaries.

Built as part of the Full Stack Engineer technical evaluation for Suntek.AI.

---

## 🚀 Live Demo

**Frontend:** https://task-tracker-rouge-nu.vercel.app

**Backend API:** https://task-tracker-je25.onrender.com/

### Local Development

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd task-tracker
   ```

2. Set up environment variables in `.env`:
   ```
   **client**
   VITE_API_URL=http://localhost:5000/api

   **server**
   PORT = 5000
   MONGO_URI = mongodburl
   JWT_SECRET = your_super_secret_key_change_this
   JWT_EXPIRES_IN = 7d



2. Run Client:
   ```bash
   cd client
   npm install
   npm run dev
   ```

2. Run Server:
   ```bash
   cd server
   npm install
   npm run dev
   ```

6. Open the app in your browser at the URL shown in the terminal.

### Build for Production
```bash
npm run build
```

## Test Credentials

For easy review, you can create a new account via the sign-up page, or use:
- **Email:** chotu@gmail.com
- **Password:** 123456

---

## ✨ Features

### Authentication
- User registration
- User login
- Secure JWT-based authentication
- Protected API routes
- User-specific task and time-log access

### Task Management
- Create tasks using natural language
- View all personal tasks
- Update task details
- Update task status
- Delete tasks
- Task statuses:
  - Pending
  - In Progress
  - Completed

### Time Tracking
- Start time tracking for a task
- Real-time elapsed timer
- Stop time tracking
- Store individual time-log sessions
- View time logs
- View total time spent on each task

### Daily Productivity Summary
- Tasks worked on today
- Total time tracked today
- Completed tasks
- Pending tasks
- In-progress tasks

### AI Task Enhancement
- Convert natural-language input into a clearer task title
- Generate a structured task description

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JavaScript
- REST API

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Tokens (JWT)
- Zod validation
- Password hashing with bcrypt

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---
