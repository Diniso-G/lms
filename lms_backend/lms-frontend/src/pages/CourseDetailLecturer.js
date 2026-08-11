import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import '../styles/app.css';


function CourseDetailLecturer(){
    const {id} = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    //const [title, setTitle] = useState('');
    //const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState({});
    
    const [showEditForm, setShowEditForm] = useState(false);
    const [editInputs, setEditInputs] = useState({});
    const [showStudents, setShowStudents] = useState({});
    const [studentsByCourse, setStudentsByCourse] = useState({});
    
        
    useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
        })
        .then(res => {
            setCourse(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [id, token]);

    const handleFileChange = (courseId, file) => {
        setSelectedFile(prev => ({ ...prev, [courseId]: file}));
    };

    const uploadDocument = async (courseId) => {
        const file = selectedFile[courseId];
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
            /*setCourse(prevCourse => prevCourse.map(course => course.id === courseId
                ? { ...course, documentPath: res.data.file.filename}
                : course
            ));*/
            setCourse(prevCourse => ({
                ...prevCourse, documentPath: res.data.file.filename
            }));
        } catch (err){
            console.error(err);
            alert(err.response?.data?.message || 'Failed to upload document');
        }
    };

    const toggleEditForm = (courseId, course) => {
        const willShow = !showEditForm[courseId];
        setShowEditForm(prev => ({ ...prev, [courseId]: willShow}));
        if (willShow && !editInputs[courseId]) {
            setEditInputs(prev => ({ ...prev, [courseId]: {title: course.title, description: course.description }}));
        }
    };

    const handleEditInputChange = (courseId, field, value) => {
        setEditInputs(prev => ({
            ...prev, [courseId]: { ...prev[courseId], [field]: value}
        }));
    };

    const saveCourseEdit = async (courseId) => {
        const input = editInputs[courseId] || {};
        if (!input.title || !input.description){
            alert('Title and description arre required');
            return;
        }
        try {
            const res = await axios.post(
                `http://localhost:5000/api/courses/${courseId}`, 
                { title: input.title, description: input.description }, 
                {headers: {Authorization: `Bearer ${token}`} }
            );
    
            //setCourses(prev => prev.map(c => c.id === courseId ? res.data.course : c));
            setCourse(res.data.course);
            setShowEditForm(prev => ({ ...prev, [courseId]: false}));
            alert('Course updated');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to update course');
        }
    };

    const deleteCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')){
            return;
        }
        try {
            await axios.delete(
            `http://localhost:5000/api/courses/${courseId}`, 
                {headers: {Authorization: `Bearer ${token}`} }
            );

            //setCourses(prev => prev.filter(c => c.id !== courseId));
            alert('Course deleted');
            navigate('/lecturer-dashboard')
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to delete course');
        }
    };

    const toggleStudents = async (courseId) => {
        const willShow = !showStudents[courseId];
        setShowStudents(prev => ({ ...prev, [courseId]: willShow}));
        if (willShow && !studentsByCourse[courseId]) {
            try{
                const res = await axios.get(`http://localhost:5000/api/courses/${courseId}/students`,
                    {headers: {Authorization: `Bearer ${token}`} }
                );
                setStudentsByCourse(prev => ({ ...prev, [courseId]: res.data}));
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Failed to load students');
            }
        }
    };

    if (loading) return <p> Loading courses...</p>;
    if (!course) return <p> Course not found</p>;

    return (
        <div className="dashboard page-enter">
            <Link className="back-link" to="/lecturer-dashboard">&larr; Back to my Courses-COMEBACK TO THIS PLES</Link>
            <div className="detail-header">
                <div>
                    <span className="welcome-eyebrow">Manage course</span>
                    <h1>{course.title}</h1>
                </div>

                <div className="course-card-actions">
                    <Link className="link-btn link-btn-outline" to={`/lecturer/course/${id}/assignments`} state={{courseTitle: course.title}}>
                        Assignments
                    </Link>
                    <Link className="link-btn link-btn-outline" to={`/lecturer/course/${id}/announcements`} state={{courseTitle: course.title}}>
                        Announcements
                    </Link>
                </div>
            </div>

            <p>{course.description}</p>
            <h2>Course Document</h2>
            {course.documentPath && (
                <p><a href = 
                    {`http://localhost:5000/uploads/${course.documentPath}`} 
                    target='_blank' rel = 'noopener noreferrer'>
                    View current document
                </a></p>
            )}
            <input type='file' onChange={e => handleFileChange(course.id, e.target.files[0])}/>
            <button className="btn btn-upload" onClick={() =>uploadDocument(course.id)}>
                Upload Document
            </button>

            <h2>Edit or Delete Course</h2>
            <button className="btn btn-desc" onClick={() =>toggleEditForm(course.id, course)}>
                {showEditForm[course.id] ? "Cancel Edit" : "Edit Course"}
            </button>
            <button className="btn btn-delete" onClick={() =>deleteCourse(course.id)}>
                Delete Course
            </button>

            {showEditForm[course.id] && (
                <div className="form-card">
                    <div className="input-group">
                        <input type="text" value={editInputs[course.id]?.title || ''} onChange={e => handleEditInputChange(course.id, 'title', e.target.value)} />
                        <label>Course Title</label>
                    </div>
                    <div className="input-group">
                        <textarea value={editInputs[course.id]?.description || ''} onChange={e => handleEditInputChange(course.id, 'description', e.target.value)} />
                        <label>Course Description</label>
                    </div>
                    <button className="btn btn-enroll" onClick={() => saveCourseEdit(course.id)}>
                        Save Changes
                    </button>
                </div>
            )}

            <h2>Enrolled Students</h2>
            <button className=" btn btn-desc" onClick={() => toggleStudents(course.id)}>
                {showStudents[course.id] ? "Hide Students" : "View Enrolled Students"}
            </button>
            {showStudents[course.id] && (
                (studentsByCourse[course.id] || []).length === 0 ? (
                    <p>No students yet</p>
                ) : (
                    <ul className="user-list">
                        {studentsByCourse[course.id].map(st => (
                            <li key={st.id} className="user-item">
                                <strong>{st.name}</strong> - <small>{st.email}</small>
                           </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
}

export default CourseDetailLecturer;