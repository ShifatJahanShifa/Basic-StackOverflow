import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import './notifdetail.css'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const NotificationDetail = () => {
    const { postId } = useParams(); // Get the notification ID from the URL
    // console.log(notificationId)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const notificationId = queryParams.get('notificationId');

    // console.log('Post ID:', postId);
    // console.log('Notification ID:', notificationId);

    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:80/post/${postId}`, 
                    {
                        // params: { notificationId: notificationId }, // Pass as query parameter
                        withCredentials: true
                    });
                setDetails(response.data);
                console.log("here",response.data);

            } catch (error) {
                console.error('Error fetching notification details:', error);
                // alert('Error fetching notification details');
            } finally {
                setLoading(false);
            }
            try {
                await axios.get(`http://localhost:80/notification/${notificationId}`,
                {
                    withCredentials: true
                });
                console.log("Notification updated:");
            } catch (error) {
                console.error('Error updating notification details:', error);
            }
        };

        fetchDetails();
    }, [postId,notificationId]);

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
                <p><span>User Email:</span> {details.email}</p>
                <p><span>Text:</span> {details.text}</p>
            </div>
            
            <h2>code</h2>
            <div className="detail-box">
                {details.fileContent && (
                    <pre className="code-block">
                        <SyntaxHighlighter language="javascript" style={docco} >
                            {typeof details.fileContent === 'object' 
                            ? JSON.stringify(details.fileContent, null, 2) 
                            : String(details.fileContent)} {/* Display code content */}
                        </SyntaxHighlighter>
                    </pre>
                )}
            </div>
        </div>
    );
};

export default NotificationDetail;
