//could be useless
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import '../styles/app.css';

function LecturerDashboard(){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState({});

    useEffect(() => {
    axios.get("http://localhost:5000/api/courses", {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setCourses(res.data);
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
}, [token]);

const createCourse = async () => {
    if (!title || !description){
        alert('Title and description required');
        return;
    }
    try{
        const res = await axios.post(`http://localhost:5000/api/courses`, { title, description}, {
            headers: {Authorization: `Bearer ${token}`}
    });

    console.log('Axios response:', res);
    if(!res || !res.data) {
        alert('No response from server');
        return;
    }
    alert("Course Created");
    setCourses([...courses, res.data.course]);
    setTitle('');
    setDescription('');
    } catch(err) {
        console.error('Error creating course', err)
        alert(err.response?.data?.message || "Failed to create course");
    }
};
const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
};

const handleFileChange = (courseId, file) => {
    setSelectedFiles(prev => ({ ...prev, [courseId]: file}));
};

const uploadDocument = async (courseId) => {
    const file = selectedFiles[courseId];
    if (!file) {
        alert("Please select a file first");
        return;
    }

    const formData = new FormData();
    formData.append('document', file);

    try{
        const res = await axios.post(
            `http://localhost:5000/api/courses/${courseId}/upload`,
            formData, {headers:{Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',},}
        );
        alert("Document uploaded successfully");
        alert(res.data.message);
        setCourses(prevCourses => prevCourses.map(course => course.id === courseId
            ? { ...course, documentPath: res.data.file.filename}
            : course
        ));
    } catch (err){
        console.error(err);
        alert(err.response?.data?.message || 'Failed to upload document');
    }
};
if (!token) return <p>Please Login First</p>;

if (loading) return <p> Loading courses...</p>;

return (
    <div className="dashboard">
        <h1>Lecturer Dashboard</h1>

        <button className="btn btn-logout" onClick={logout}>Logout</button>
        <h2>Create new Courses</h2>
        <div className="form-card"> 
            <div className="input-group">
                <input type="text"
                    placeholder=""
                    value={title}
                    onChange={e => setTitle(e.target.value)}/>
                <label>Course Title</label>
            </div>

            <br />
            <div className="input-group">
                <textarea placeholder="" value={description}
                    onChange={e => setDescription(e.target.value)}/>
                <label>Course Description</label> 
            </div>

            <br />
            <button className="btn btn-enroll" onClick={createCourse}>Create Course</button>
        </div>
        <h2>All Courses</h2>
        {courses.length === 0 ? 
            <p>No courses yet</p> : (
            <ul className="course-list">
                {courses.map(course => (
                    <li key = {course.id} className="course-items">
                        <div className="course-left">
                            <strong>{course.title}</strong> -{course.description}
                        </div>
                        <div className="course-right">
                            <input type='file' onChange={e => 
                            handleFileChange(course.id, e.target.files[0])}/>
                            <button className="btn btn-upload" onClick={() =>uploadDocument(course.id)}>
                                Upload Document
                            </button>
                        </div>
                        <div>
                            {course.documentPath && (
                            <a href = {`http://localhost:5000/uploads/${course.documentPath}`} 
                            target='_blank' rel = 'noopener noreferrer'>
                            View Document</a>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
);
    

}
export default LecturerDashboard;
