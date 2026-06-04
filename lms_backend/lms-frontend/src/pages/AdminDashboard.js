import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import '../styles/app.css';

function AdminDashboard(){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [showUsers, setShowUsers] = useState(false);

    const [visibleCourses, setVisibleCourses] = useState({});
    
    useEffect(() => {
    axios.get("http://localhost:5000/api/admin/users", {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setUsers(res.data);
        setLoadingUser(false);
    })
    .catch(err => {
        console.error('Error fetching errr:', err);
        setLoadingUser(false);
    });
}, [token]);

useEffect(() => {
    axios.get("http://localhost:5000/api/admin/courses", {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setCourses(res.data);
        setLoadingCourses(false);
    })
    .catch(err => {
        console.error('Error fetching courses:', err);
        setLoadingCourses(false);
    });
}, [token]);

const deleteCourse = (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    axios.delete(`http://localhost:5000/api/admin/courses/${courseId}`, {
        headers: {Authorization: `Bearer ${token}`},
    })
    .then(() => {
        alert('Course deleted successfully');
        setCourses(courses.filter((course) => course.id !== courseId));

    })
    .catch((err) => {
        alert(err.response?.data?.message || 'Failed to delete course');
    });
};

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
const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
};
const toggleCourseDescription = (courseId) => {
    setVisibleCourses((prev) => ({
        ...prev, [courseId]: !prev[courseId],
    }));
};

if (!token)
    return <p>Please Login First</p>;

return (
    <div className="dashboard page-enter">
        <h1>Administrator Dashboard</h1>

        <button className="btn-logout" onClick={logout}>Logout</button>
        <h2>All Courses</h2>
        {loadingCourses ? <p> Loading courses...</p> :
            courses.length === 0 ? 
            <p>No courses yet</p>
         : (
            <ul className="course-list">
                {courses.map(course => (
                    <li key = {course.id} className="course-items">
                        <div className="course-left">
                            <strong>{course.title}</strong> 
                        </div>
                        <div className="course-right">
                            <button className= "btn btn-desc" onClick={() => toggleCourseDescription(course.id)}>
                                {visibleCourses[course.id] ? "Hide" : "Show"}
                            </button>
                            <button className="btn btn-delete" onClick={() => deleteCourse(course.id)}>
                                Delete
                            </button>
                        </div> 
                        {visibleCourses[course.id] && (<p>{course.description}</p>)}
                        
                    </li>
                ))}
            </ul>
        )}

        <h2>User Management</h2>
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
                                Promote
                            </button>
                            )}
                            {user.role === "Lecturer" && (
                                <button className="btn btn-promote" onClick={() => changeUserRole(user.id, 'student')}>
                                    Demote
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
export default AdminDashboard;

