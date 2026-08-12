import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from 'axios';
import '../styles/app.css';

function AdminUsers(){
    const token = localStorage.getItem('token');

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showUsers, setShowUsers] = useState(false);
    
    useEffect(() => {
    axios.get("http://localhost:5000/api/admin/users", {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setUsers(res.data);
        setLoading(false);
    })
    .catch(err => {
        console.error('Error fetching courses:', err);
        setLoading(false);
    });
}, [token]);

const deleteUser = (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: {Authorization: `Bearer ${token}`},
    })
    .then(() => {
        alert('User deleted');
        setUsers(users.filter((user) => user.id !== userId));
    })
    .catch((err) => {
        alert(err.response?.data?.message || "Failed to delete user")
    });
};

const changeUserRole = (userId, newRole) => {
    axios.put(`http://localhost:5000/api/admin/users/${userId}/role`,{
        role: newRole},{ headers: {Authorization: `Bearer ${token}`}
    })
    .then(() => {
        setUsers(
            users.map((user) => (user.id ===userId ? {...user, role: newRole} : user))
        );
        alert(`User role changed to ${newRole}`);
    })
    .catch((err) => {
        alert(err.response?.data?.message || "Failed to change role")
    });
};

if (loading) return <p>Loading...</p>;

return (
    <div className="dashboard page-enter">
        <Link className="back-link" to="/admin-dashboard">&larr; Back to OverView RETURN HERE</Link>
        <h1>User Management</h1>

        <button className="btn btn-desc" onClick={() => setShowUsers(prev => !prev)}>
            {showUsers ? "Hide Users":"Show Users"}
        </button>
        { showUsers && ( <>
        {users.length === 0 ? (
            <p>No users yet</p>
        ) : (
            <ul className="user-list">
                {users.map(user => (
                    <li key = {user.id} className="user-item">
                        <div className="course-left">
                            <strong>{user.name}</strong><br/>
                            <small>{user.email}</small>
                        </div>
                        <div className="course-right">
                            {user.role !== 'admin' && (
                            <button className="btn btn-promote" onClick={() => changeUserRole(user.id, "admin")}>
                                Promote to Admin
                            </button>
                            )}
                            {user.role !== "Lecturer" && user.role !== "student" && (
                                <button className="btn btn-promote" onClick={() => changeUserRole(user.id, 'student')}>
                                    Demote to Student
                                </button>
                            )}
                            {user.role !== 'lecturer' && user.role !== 'admin' && (
                            <button className="btn btn-promote" onClick={() => changeUserRole(user.id, "lecturer")}>
                                Promote to Lecturer
                            </button>
                            )}
                            {user.role === "admin" && (
                                <button className="btn btn-promote" onClick={() => changeUserRole(user.id, 'lecturer')}>
                                    Demote to Lecturer
                                </button>
                            )}
                            <button className="btn btn-delete" onClick={() => deleteUser(user.id)}>
                                Delete User
                            </button>
                        </div>
                        <span>{user.role}</span>
                    </li>
                ))}
            </ul>
        )}
        </>
    )}
    </div>
);

}

export default AdminUsers;