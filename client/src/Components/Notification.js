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
        // Remove the clicked notification from the notifications array
        // setNotifications(prevNotifications =>
        //     prevNotifications.filter(notification => notification._id !== notificationId)
        // );

        // console.log("Clicked notification ID:", notificationId);
        // setNotifications(prevNotifications => {
        //     const updatedNotifications = prevNotifications.filter(notification => notification._id !== notificationId);
        //     console.log("Updated notifications:", updatedNotifications);
        //     // return updatedNotifications;
        // });
        // // Navigate to the detail page for the clicked notification
        // navigate(`/notification/${notificationId}`); 

        // new 
        // setNotifications(prevNotifications => {
        //     const updatedNotifications = prevNotifications.filter(notification => notification._id !== notificationId);
        //     console.log("Updated notifications:", updatedNotifications);
    
        //     // Navigate only after the state has been updated
        //     navigate(`/notification/${notificationId}`);
      
        //     return updatedNotifications;
        // }); 

        // new 2
        // console.log("Clicked notification ID:", notificationId);

        // setNotifications(prevNotifications => {
        //     const updatedNotifications = prevNotifications.filter(notification => notification._id !== notificationId);
        //     console.log("Updated notifications:", updatedNotifications);
        //     return updatedNotifications; // return updated state
        // });

        // // Navigate after state update
        // setTimeout(() => {
        //     navigate(`/notification/${notificationId}`);
        // }, 0);



        /// again
        setClickedNotificationId(prevClickedNotificationId => [...prevClickedNotificationId, notificationId]);

        // Navigate to the detail page for the clicked notification
        navigate(`/notification/${notificationId}`);
    };  

    ///  whattttttttttttttttttttttttt
    // const handleNotificationClick = (notificationId) => {
    //     console.log("Clicked notification ID:", notificationId);

    //     // Remove the clicked notification from the notifications array
    //     setNotifications(prevNotifications => {
    //         const updatedNotifications = prevNotifications.filter(notification => notification._id !== notificationId);
    //         console.log("Updated notifications:", updatedNotifications);
    //         return updatedNotifications; // return updated state
    //     });

    //     // Set the clicked notification ID to trigger navigation
    //     setClickedNotificationId(notificationId);
    // };

    // // Effect for navigation
    // useEffect(() => {
    //     if (clickedNotificationId) {
    //         navigate(`/notification/${clickedNotificationId}`);
    //         setClickedNotificationId(null); // Reset after navigating
    //     }
    // }, [clickedNotificationId, navigate]);

    // useEffect(() => {
    //     console.log("Notification component mounted");
    //     return () => {
    //         console.log("Notification component unmounted");
    //     };
    // }, []);

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }

    console.log(notifications.length)
    return (
        // <div>
        //     <h2>Your Notifications</h2>
        //     <div className="notif-container">
        //         {notifications.length > 0 ? (
        //             notifications.map(notification => (
        //                 <div key={notification._id} 
        //                     onClick={()=> handleNotificationClick(notification._id)}
        //                 //     style={{
        //                 //     backgroundColor: "white",
        //                 //     padding: "10px", // Add padding for spacing inside the div
        //                 //     border: "1px solid #ccc", // Add a border around the div
        //                 //     borderRadius: "8px", // Make the corners rounded
        //                 //     marginBottom: "10px", // Add some space between divs
        //                 //     boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
        //                 //     // width: "80%"
        //                 // }}
        //                 >
        //                     {/* <p>{notification.userId}</p> */}
        //                     {/* <p>{notification.text}</p> */}
        //                     <p>New Notification from a user</p>
        //                     <p>{notification.userEmail}</p>
        //                 </div>
        //             ))
        //         ) : (
        //             <p>No notifications available</p>
        //         )}
        //     </div>
        // </div> 

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
