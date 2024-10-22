import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './notif.css'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

function Notification() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [clickedNotificationId, setClickedNotificationId] = useState([]);

    // Function to fetch notifications from the backend
    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:3001/notification', {
                withCredentials: true // Ensure cookies are included if you're using sessions
            });
            setNotifications(response.data);
        } catch (error) {
            
            if (error.response && error.response.status === 401) {
                // Redirect to login page
                window.location.href = '/login';
            } else {
                alert('Error fetching notifications');
            }
        }
    };

    // Check for user session or redirect to login
    useEffect(() => {
        axios.get('http://localhost:3001/user', { withCredentials: true })
            .then(response => {
                if (response.data.user) {
                    setUser(response.data.user);
                    fetchNotifications(); // Fetch notifications after user is authenticated
                } else {
                    navigate("/login");
                }
            })
            .catch(() => navigate("/login"))
            .finally(() => setLoading(false));
    }, [user,navigate]);

    // console.log("notif fetched");
    const handleNotificationClick = (notificationId) => {
        console.log(notificationId);
        /// again
        setClickedNotificationId(prevClickedNotificationId => [...prevClickedNotificationId, notificationId]);

        // Navigate to the detail page for the clicked notification
        navigate(`/notification/${notificationId}`);
    };  

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }

    console.log(notifications.length)
    return (
        
        <div>
            <h2>Your Notifications</h2>
            <div className="notif-container">
                {notifications.length > 0 ? (
                    notifications
                        .filter(notification => !clickedNotificationId.includes(notification._id)) // Filter out clicked notifications
                        .map(notification => (
                            <div className="notif" key={notification._id} onClick={() => handleNotificationClick(notification._id)}>
                                <p>New Notification from a user</p>
                                <p>{notification.userEmail}</p>
                                <p>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true})}</p>
                            </div>
                        ))
                ) : (
                    <p>No notifications available</p>
                )}
            </div>
        </div>
    );
}

export default Notification;
