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
            const response = await axios.get('http://localhost:80/notification', {
                withCredentials: true 
            });
            setNotifications(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Redirect to login page
                window.location.href = '/login';
            } 
            else {
                alert('Error fetching notifications');
            }
        }
    };

    // Check for user session or redirect to login
    useEffect(() => {
        axios.get('http://localhost:80/auth/user', { withCredentials: true })
            .then(response => {
                if (response.data.user) {
                    setUser(response.data.user);
                    fetchNotifications(); 
                } else {
                    navigate("/login");
                }
            })
            .catch(() => navigate("/login"))
            .finally(() => setLoading(false));
    }, [user,navigate]);

    useEffect(() => {
        fetchNotifications();
    }, [navigate]);

    
    const handleNotificationClick = (notificationId,postId) => {
        console.log(notificationId);
        // expanding
        setClickedNotificationId(prevClickedNotificationId => [...prevClickedNotificationId, notificationId]);

        navigate(`/notification/${postId}?notificationId=${notificationId}`);
    };  

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }

    // console.log(notifications.length)
    return (
        <div>
            <h2>Your Notifications</h2>
            <div className="notif-container">
                {notifications.length > 0 ? (
                    notifications
                        .filter(notification => !clickedNotificationId.includes(notification._id)) // Filter out clicked notifications
                        .map(notification => (
                            <div className="notif" key={notification._id} onClick={() => handleNotificationClick(notification._id,notification.postId)}>
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
