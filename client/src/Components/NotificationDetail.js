// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const NotificationDetail = () => {
//     const { notificationId } = useParams(); // Get the notification ID from the URL
//     const [notification, setNotification] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchNotification = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3001/notification/${notificationId}`, {
//                     withCredentials: true // Ensure cookies are included if you're using sessions
//                 });
//                 setNotification(response.data);
//             } catch (error) {
//                 console.error('Error fetching notification details:', error);
//                 alert('Error fetching notification details');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchNotification();
//     }, [notificationId]);

//     if (loading) {
//         return <center><h1>Loading...</h1></center>;
//     }

//     if (!notification) {
//         return <center><h1>Notification not found</h1></center>;
//     }

//     return (
//         <div>
//             <h2>Notification Details</h2>
//             <p>User ID: {notification.userId}</p>
//             <p>Text: {notification.text}</p>
//             <p>User Email: {notification.userEmail}</p>
//             {/* Add any other details you want to display */}
//             <p></p>
//         </div>
//     );
// };

// export default NotificationDetail;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './notifdetail.css'

const NotificationDetail = () => {
    const { notificationId } = useParams(); // Get the notification ID from the URL
    console.log(notificationId)
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/notification/${notificationId}`, {
                    withCredentials: true // Ensure cookies are included if you're using sessions
                });
                setDetails(response.data);
            } catch (error) {
                console.error('Error fetching notification details:', error);
                alert('Error fetching notification details');
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
            {/* <p>User ID: {details.notification.userId}</p>
            <p>Notification Text: {details.notification.text}</p>
            <p>User Email: {details.notification.userEmail}</p> */}
            <div className="detail-box">
                {/* <p><span>User ID:</span> {details.notification.userId}</p> */}
                <p><span>User Email:</span> {details.notification.userEmail}</p>
                <p><span>Text:</span> {details.notification.text}</p>
            </div>
            
            <h2>code</h2>
            <div className="detail-box">
                {/* <p><span>Post Text:</span> {details.post.text}</p> */}
                {details.post.fileContent && (
                    <pre className="code-block">
                        <code className="code">{details.post.fileContent}</code> 
                    </pre>
                )}
                {/* <p><span>Post Created By:</span> {details.post.userId.email}</p>  */}
            </div>
        </div>
    );
};

export default NotificationDetail;
