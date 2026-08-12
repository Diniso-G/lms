import React, {useEffect, useState, useCallback} from "react";
import {useLocation, useParams, Link} from "react-router-dom";
import axios from 'axios';
import '../styles/app.css';

function AssignmentsStudent(){
    const {id: courseId} = useParams();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const courseTitle = location.state?.courseTitle || 'Course';

    const [loading, setLoading] = useState(true);
    //const [assignmentTitle, setAssignmentTitle] = useState({});
    
    const [selectedFiles, setSelectedFiles] = useState({});
    const [showAssignments, setShowAssignments] = useState({});
    const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
    const [mySubmission, setMySubmission] = useState({});
    //const [submissionsByAssignment, setSubmissionsByAssignment] = useState({});

    const fetchMySubmission= useCallback(async (assignmentId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/assignments/${assignmentId}/my-submission`, {headers: {Authorization: `Bearer ${token}`}});
            setMySubmission(prev => ({ ...prev, [assignmentId]: res.data}));
        } catch (err) {
        /*
        console.error(err);
        alert(err.response?.data?.message || 'Failed to load submissions');*/
        }
    }, [token]);

    useEffect(() => {
    axios.get(`http://localhost:5000/api/assignments/course/${courseId}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setAssignmentsByCourse({[courseId]: res.data});
        setLoading(false);
        res.data.forEach(a => fetchMySubmission(a.id));
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
}, [courseId, token, fetchMySubmission]);

const toggleAssignments = async (courseId) => {
    const willShow = !showAssignments[courseId];
    setShowAssignments(prev => ({ ...prev, [courseId]: willShow }));

    if (willShow && !assignmentsByCourse[courseId]) {
        try{
            const res = await axios.get(`http://localhost:5000/api/assignments/course/${courseId}`, { headers: {Authorization: `Bearer ${token}`}}
            );
            setAssignmentsByCourse(prev => ({ ...prev, [courseId]: res.data}));
            res.data.forEach(a => fetchMySubmission(a.id));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to load assignments');
        }
    }

};

const handleAssignmentFileChange = (assignmentId, file) => {
    setSelectedFiles(prev => ({
        ...prev, [assignmentId]: file
    }));
};

const submitAssignment = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (!file) {
        alert('Select a file first');
        return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
        await axios.post(`http://localhost:5000/api/assignments/${assignmentId}/submit`,
            formData, {headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data'}}
        );
        alert('Assignment submitted');
        fetchMySubmission(assignmentId);
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to submit assignment');
    }
};

if (loading) return <p> Loading assignments...</p>;

return (
    <div className="dashboard page-enter">
        <Link className="back-link" to={`/student/course/${courseId}`}>&larr; Back to {courseTitle}-COMEBACK TO THIS PLES</Link>
        <div className="detail-header">
            <div>
                <span className="welcome-eyebrow">Assignments</span>
                <h1>{courseTitle}</h1>
            </div>
        </div>

        <h2> Assignments</h2>
        <div className="assignment-section">

            <button className="btn btn-desc" onClick={() => toggleAssignments(courseId)}>
                {showAssignments[courseId] ? "Hide Assignments" : "Show Assignments"}
            </button>
            {showAssignments[courseId] && (
                (assignmentsByCourse[courseId] || []).length === 0 ? (
                    <p>No assignments yet</p>
                ) : (
                    <ul className="assignment-list">
                        {assignmentsByCourse[courseId].map(assignment => {
                            const submission = mySubmission[assignment.id];
                            return (
                                <li key={assignment.id} className="assignment-item">
                                <strong>{assignment.title}</strong>
                                <p>{assignment.description}</p>
                                <small>Due: {new Date(assignment.dueDate).toLocaleDateString()}</small>

                                {submission ? (
                                    <div>
                                        <p>Submitted {new Date(submission.submittedAt).toLocaleDateString()}</p>
                                        {submission.grade !== null ? (
                                            <p>Grade: {submission.grade} - {submission.feedback || 'No feedback'}</p>
                                        ) : (
                                            <p>Not graded yet</p>
                                        )}
                                        <input type="file" onChange={e => handleAssignmentFileChange(assignment.id, e.target.files[0])} />
                                        <button className="btn btn-upload" onClick={() => submitAssignment(assignment.id)}>
                                            Resubmit
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <input type="file" onChange={e => handleAssignmentFileChange(assignment.id, e.target.files[0])} />
                                        <button className="btn btn-upload" onClick={() => submitAssignment(assignment.id)}>
                                            Submit
                                        </button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>         
            )
        )} 
        </div>       
    </div>
);

}
export default AssignmentsStudent;
