
import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/LoginForm';
import DashboardPg from './pages/DashboardPg';
import LecturerDashboard from './pages/LecturerDashboard';
import AdminDashboard from './pages/AdminDashboard';

import './styles/app.css';

function App(){
  const token = localStorage.getItem('token');
    return ( 
    <Router>
      {/*NAVBAR*/}
      <nav className='navbar'>
        <Link to="/">Home</Link> 
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      {/*PAGE CONTENT*/}
      <div className='container'>
        <Routes>
          <Route path='/' element={<h1 className='welcome'>Welcome to LMS Frontend</h1>}/>
          <Route path='/register' element={<RegistrationForm/>}/>
          <Route path='/login' element={<LoginForm/>}/>
          <Route path='/dashboard' element={<DashboardPg/>}/>
          <Route path='/lecturer-dashboard' element={<LecturerDashboard/>}/>
          <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

