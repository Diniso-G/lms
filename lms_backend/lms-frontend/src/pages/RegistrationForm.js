import React, { useState} from "react";
import axios from 'axios';
import '../styles/app.css';

function RegistrationForm(){
    const [form, setForm] = useState({ name: '', email: '',password: '', role: 'student'});
    const [message, setMessage] = useState('');

    const handleChange = e =>{
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:5000/api/auth/register', form);
            setMessage(res.data.message || "Registration successful");
        } catch (err){
            console.log("Register Error:", err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Registration failed';
            setMessage(errorMessage);
        }
    };
    return(
        <div className="form-card">
            <h2>Register</h2>
            <form onSubmit = {handleSubmit}>
            <div className="form-group">
                <input name="name" placeholder="Name" onChange={handleChange} value={form.name} required/>
            </div>
            <div className="form-group">
                <input name="email" placeholder="Email" onChange={handleChange} value={form.email} required/>
            </div>
            <div className="form-group">
                <input name="password" placeholder="Password" type="password" onChange={handleChange} value={form.password} required/>
            </div>
            <div className="form-group">
                <select name="role" onChange={handleChange} value={form.role}>
                <option value="student"> Student</option>
                <option value="lecturer"> Lecturer</option>
                <option value="admin"> Administrator</option>
            </select>
            </div>
            <button type="submit">Register</button>
            <p>{message}</p>
        </form>
        </div>
    );
}
export default RegistrationForm;
