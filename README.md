# University/College Learning Management System (LMS)
A full-stack learning management system built as a portfolio project. The system allows students, lecturers and administrators to interact with courses through role-based access control.

This project demonstrates full-stack development, REST APIs, authentication, database relationships, and file uploads. This is an ongoing project currently at its Version 1.

## Features

### Student
- View all available courses in the system
- Enroll in available courses
- View enrolled courses
- Access course documents uploaded by lecturer
- Secure access through JWT authentication
- Get assignments and upload submission and view grading

### Lecturer
- Create new courses
- Upload course documents
- View uploaded documents per course
- Send Assignments and assigng grading

### Administrator
- View all system users
- Promote or demote user roles
- View all courses
- Delete courses
- Delete/remove users

---

## System Architecture

The system follows a three-tier architecture:
- Frontend: React
- Backend: Node.js + Express
- Database: MySQL + Sequelize

Authentication is handled using JSON Web Tokens (JWT).

---

## Tech Stack

### Frontend
- React
- Axios
- React Router
- CSS

### Backend
- Node.js
- Express.js
- Sequelize
- MySQL
- Multer (file uploads)
- JWT Authentication
- bcrypt (password hashing)

## Tools
- XAMPP
- Visual Studio Code
- Git and GitHub

---

## Authentication and Roles

- JWT-based authentication
- Role-based access control:'student', 'lecturer', 'admin'
- Protected API routes using middleware

---

## File Uploads
- Lecturers upload course documents
- Files stored on the server ('/uploads')
- Students can view documents for enrolled courses
- Allows uploading assignments in specific documents

---

## Database Overview

Main entities:
- users
- courses
- usercourses
- assignments
- submissions

---

## Project structure

```
lms/
|-- lms_backend/
|   |-- config/
|   |   |-- database.js
|   |-- controllers/
|   |   |-- admin.controller.js 
|   |   |-- assignment.controller.js 
|   |   |-- auth.controller.js 
|   |   |-- course.controller.js 
|   |-- lms-frontend/
|   |   |-- public/
|   |   |-- src/
|   |   |   |-- pages/
|   |   |   |   |-- AdminDashboard.js
|   |   |   |   |-- DashboardPg.js
|   |   |   |   |-- LecturerDashboard.js
|   |   |   |   |-- LoginForm.js
|   |   |   |   |-- RefistrationForm.js
|   |   |   |-- styles/
|   |   |   |   |-- app.css
|   |   |   |-- App.css
|   |   |   |-- App.js
|   |   |   |-- App.test.js
|   |   |   |-- index.css
|   |   |   |-- index.js
|   |   |   |-- logo.svg
|   |   |   |-- reportWebVitals.js
|   |   |   |-- setupTest.js
|   |   |-- Applic.js 
|   |   |-- package-lock.json
|   |   |-- package.json 
|   |-- middleware/
|   |   |-- auth.middleware.js 
|   |   |-- upload.middleware.js 
|   |-- models/
|   |   |-- Assignment.js 
|   |   |-- Course.js 
|   |   |-- Submission.js 
|   |   |-- User.js 
|   |   |-- index.js 
|   |-- routes/
|   |   |-- admin.routes.js 
|   |   |-- assignment.routes.js 
|   |   |-- auth.routes.js 
|   |   |-- course.routes.js  
|   |-- uploads/
|   |   |-- courses/
|   |   |-- submissions/
|   |-- api_test.http 
|   |-- index.js
|   |-- package-lock.json
|   |-- package.json
|   |-- test-db.js  
|   |-- .env  
|-- README.md
```
---

## Installation and Setup

### Clone the repository
'''bash
git clone https://github.com/Diniso-G/lms-project.git
cd lms-project

### Backend setup
cd backend
npm install
npm run dev

http://localhost:5000

### Frontend set
cd frontend
npm install
nmp start

http://localhost:3000
