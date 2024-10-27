import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './notifdetail.css'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const NotificationDetail = () => {
    const { notificationId } = useParams(); // Get the notification ID from the URL
    // console.log(notificationId)
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/notification/${notificationId}`, {
                    withCredentials: true
                });
                setDetails(response.data);
            } catch (error) {
                console.error('Error fetching notification details:', error);
                // alert('Error fetching notification details');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [notificationId]);

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }

    if (!details) {
        return <center><h1>Notification not found</h1></center>;
    }

    return (
        <div className="detail-container">
            <h2>Notification Details</h2>
            <div className="detail-box">
                <p><span>User Email:</span> {details.notification.userEmail}</p>
                <p><span>Text:</span> {details.notification.text}</p>
            </div>
            
            <h2>code</h2>
            <div className="detail-box">
                {details.post.fileContent && (
                    <pre className="code-block">
                        <SyntaxHighlighter language="javascript" style={docco} >
                            {typeof details.post.fileContent === 'object' 
                            ? JSON.stringify(details.post.fileContent, null, 2) 
                            : String(details.post.fileContent)} {/* Display code content */}
                        </SyntaxHighlighter>
                    </pre>
                )}
            </div>
        </div>
    );
};

export default NotificationDetail;
