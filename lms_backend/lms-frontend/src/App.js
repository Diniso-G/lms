
import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route, NavLink} from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/LoginForm';
import DashboardPg from './pages/DashboardPg';
import LecturerDashboard from './pages/LecturerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseDetailLecturer from './pages/CourseDetailLecturer';
import AssignmentsLecturer from './pages/AssignmentsLecturer';
import AnnouncementsLecturer from './pages/AnnouncementsLecturer';
import CourseDetailStudent from './pages/CourseDetailStudent';
import AssignmentsStudent from './pages/AssignmentsStudent';
import AnnouncementsStudent from './pages/AnnouncementsStudent';
import AdminCourses from './pages/AdminCourses';
import AdminUsers from './pages/AdminUsers';


import './styles/app.css';

function WelcomePage(){
  return (

    <div className='welcome-section page-enter'>
      <span className='welcome-eyebrow'>Learning Management System</span>
      <h1 className='welcome-title'> Knowledge, <br /> <strong>delivered clearly.</strong>
      </h1>
      <p className='welcome-subtitle'>
        A modern platform for students, lecturers, and administrators to manage courses, track progress, and collaborate.
      </p>
      <div className='welcome-actions'>
        <a href="/register" className='btn btn-primary'>Get started</a>
        <a href="/login" className='btn btn-ghost'>Sign in</a>
      </div>
    </div>
  )
}

function Navbar(){
  const [role, setRole] = useState(localStorage.getItem('role'));
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const dashboardPath = role === 'admin' ? '/admin-dashboard' :
  role === 'lecturer' ? '/lecturer-dashboard' : '/dashboard';

  return (
    <nav className='navbar'>
      <NavLink to='/' className="brand">Edify</NavLink>
      <NavLink to='/'   end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
      {/*
      <NavLink to='/register'    className={({isActive}) => isActive ? 'active' : ''}>Register</NavLink>
      <NavLink to='/login'   className={({isActive}) => isActive ? 'active' : ''}>Login</NavLink>
      */}
      <NavLink to={dashboardPath} className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>

    </nav>
  );
}

function App(){
  //const token = localStorage.getItem('token');
    return ( 
    <Router>
      <video autoPlay muted loop playsInline className='background-video'>
        <source src='/videos/welcome-bg.mp4' type='video/mp4'/>
      </video>
      <div className='video-overlay'></div>
      <Navbar />

      {/*PAGE CONTENT*/}
      <div className='container'>
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path='/register' element={<RegistrationForm/>}/>
          <Route path='/login' element={<LoginForm/>}/>
          <Route path='/dashboard' element={<DashboardPg/>}/>
          <Route path='/student/course/:id' element={<CourseDetailStudent/>}/>
          <Route path='/student/course/:id/assignments' element={<AssignmentsStudent/>}/>
          <Route path='/student/course/:id/announcements' element={<AnnouncementsStudent/>}/>
          
          <Route path='/lecturer-dashboard' element={<LecturerDashboard/>}/>
          <Route path='/lecturer/course/:id' element={<CourseDetailLecturer/>}/>
          <Route path='/lecturer/course/:id/assignments' element={<AssignmentsLecturer/>}/>
          <Route path='/lecturer/course/:id/announcements' element={<AnnouncementsLecturer/>}/>

          <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
          <Route path='/admin/courses' element={<AdminCourses/>}/>
          <Route path='/admin/users' element={<AdminUsers/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

