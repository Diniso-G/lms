import React, { useState} from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

import '../styles/app.css';

function LoginForm(){
    const [form, setForm] = useState({ name: '', password: ''});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = e =>{
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:5000/api/auth/login', form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            window.dispatchEvent(new Event('storage'));

            if (res.data.role === 'student') navigate('/dashboard');
            else if (res.data.role === 'lecturer') navigate('/lecturer-dashboard');
            else if (res.data.role === 'admin') navigate('/admin-dashboard');
            else setMessage('Unknown role');

        } catch (err){
            console.log("Login Error:", err);

            const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed';
            setMessage(errorMessage);
        }
    };
    return(
        <div className="form-card page-enter">
            <h2>Login</h2>
            <form onSubmit = {handleSubmit} className="login-form">
            <div className="form-group">
                <input name="name" placeholder="Name" onChange={handleChange} value={form.name}/>
            </div>
            <div className="form-group">
                <input name="password" placeholder="Password" type="password" onChange={handleChange} value={form.password}/>
            </div>            
            <button type="submit">Login</button>
            <p>{message}</p>
        </form>
        </div>
    );
}
export default LoginForm;