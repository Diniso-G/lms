# University/College Learning Management System (LMS)
A full-stack learning management system built as a portfolio project. The system allows students, lecturers and administrators to interact with courses through role-based access control.

This project demonstrates full-stack development, REST APIs, authentication, database relationships, and file uploads. This is an ongoing project currently at its Version 1.

## Features

### Student
- View all available courses in the system
- Enroll and uneroll from available courses
- View enrolled courses
- Access course documents uploaded by lecturer
- Secure access through JWT authentication
- View announcements posted by the lecturer
- View assignments for enrolled courses, submit/resubmit work and view grades and feedback once graded
- Get assignments and upload submission and view grading

### Lecturer
- Create, edit and delete their own courses
- Upload and view course documents
- Create Assignments, view student submissions and assign grades with feedback
- View the list of documents enrolled in their courses
- Post and delete anooucnements per course

### Administrator
- View all system users
- Promote, demote or change user's role user roles
- View all courses including which lecturers is assigned to each
- Assign or reassign a lecturer to a course
- Delete courses
- Delete/remove users
- View system-wide stats such as total users, total courses, total enrollments and total submissions

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
- annoucements

---

## Project structure

```
lms/
|-- lms_backend/
|   |-- config/
|   |   |-- database.js
|   |-- controllers/
|   |   |-- admin.controller.js 
|   |   |-- announcement.controller.js 
|   |   |-- assignment.controller.js 
|   |   |-- auth.controller.js 
|   |   |-- course.controller.js 
|   |-- lms-frontend/
|   |   |-- public/
|   |   |-- src/
|   |   |   |-- pages/
|   |   |   |   |-- AdminCourses.js
|   |   |   |   |-- AdminDashboard.js
|   |   |   |   |-- AdminUsers.js
|   |   |   |   |-- AnnoucementsLecturer.js
|   |   |   |   |-- AnnoucementsStudent.js
|   |   |   |   |-- AssignmentsLecturer.js
|   |   |   |   |-- AssignmentsStudents.js
|   |   |   |   |-- CourseDetailLecturer.js
|   |   |   |   |-- CourseDetailStudent.js
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
|   |   |-- Annoucement.js 
|   |   |-- Assignment.js 
|   |   |-- Course.js 
|   |   |-- Submission.js 
|   |   |-- User.js 
|   |   |-- index.js 
|   |-- routes/
|   |   |-- admin.routes.js 
|   |   |-- annoucement.routes.js 
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
```bash
git clone https://github.com/Diniso-G/lms-project.git
cd lms-project
```

### Backend setup
```bash
cd backend
npm install
npm run dev
```

Runs at `http://localhost:5000`

### Frontend set
```bash
cd frontend
npm install
npm start
```

Runs at `http://localhost:3000`

DINISO GWABENI
