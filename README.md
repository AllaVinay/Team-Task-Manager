# Team Task Manager (Full-Stack Web Application)

##  Overview

The Team Task Manager is a full-stack web application that allows users to create projects, assign tasks, and track progress efficiently. It supports role-based access (Admin and Member) to manage team workflows.

---

##  Features

### Authentication

* User Signup & Login
* Secure authentication system

### Role-Based Access

* Admin: Manage projects and assign tasks
* Member: View and update assigned tasks

###  Project Management

* Create and manage multiple projects
* Add team members to projects

###  Task Management

* Create tasks within projects
* Assign tasks to users
* Update task status (Pending, In Progress, Completed)

### Dashboard

* View all tasks
* Track progress
* Monitor task status and updates

---

##  Tech Stack

### Frontend

* React (Vite)

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Deployment

* Railway (Frontend + Backend)

---

##  Live Application

👉 Frontend (Main App):
https://team-manager-production-a4d6.up.railway.app

👉 Backend (API):
https://team-manager-task-production.up.railway.app

---

##  GitHub Repository

👉 https://github.com/AllaVinay/Team-Task-Manager

---

## ⚙️ Installation & Setup

### 1. Clone the repository

git clone https://github.com/AllaVinay/Team-Task-Manager.git

---

### 2. Backend Setup

cd backend
npm install

Create a `.env` file and add:
MONGO_URI=your_mongodb_connection_string

Run backend:
npm start

---

### 3. Frontend Setup

cd frontend
npm install
npm run dev

---

## 📡 API Endpoints (Sample)

* POST /api/auth/register → Register user
* POST /api/auth/login → Login user
* GET /api/projects → Get projects
* POST /api/tasks → Create task
* PUT /api/tasks/:id → Update task

---

##  Notes

* Ensure MongoDB Atlas is properly configured
* Backend uses environment variables for security
* Frontend communicates with backend via REST APIs

---

## Conclusion

This project demonstrates full-stack development including authentication, role-based access, REST APIs, and deployment using Railway.

