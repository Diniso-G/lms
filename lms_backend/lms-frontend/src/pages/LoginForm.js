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

            if (res.data.role === 'student') navigate('/dashboard');
            else if (res.data.role === 'lecturer') navigate('/lecturer-dashboard');
            else if (res.data.role === 'admin') navigate('/admin-dashboard');
            else setMessage('Unknown role');

        } catch (err){
            setMessage(err.response.data.error || 'Login failed');
        }
    };
    return(
        <div className="form-card">
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