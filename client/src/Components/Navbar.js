import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logout from './Logout';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

export const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const [notification, setNotification]=useState([]);

    const fetchNotificationCount = async () => {
        try {
            const response = await axios.get('http://localhost:3001/notification', {
                withCredentials: true // Ensure cookies are included for session management
            });
            // let count=response.length;
            setNotification(response.data); // Update count from the response
            // console.log(count);
        } catch (error) {
            console.error('Error fetching notification count:', error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchNotificationCount(); // Fetch immediately when the user is logged in

            const interval = setInterval(() => {
                fetchNotificationCount(); // Fetch notification count every 10 seconds
            }, 10000); // 10,000 ms = 10 seconds
            
            return () => clearInterval(interval); // Cleanup the interval on component unmount
        }
    }, [isLoggedIn]);
    
    const button={marginRight:'20px', fontSize:'1.2rem', fontWeight:'700', padding:'0.3rem 1.4rem'}

    return (
            <AppBar sx={{ bgcolor: '#777' }}>
                <Toolbar>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                        Basic Stack-Overflow
                    </Typography>
                    {!isLoggedIn ? (
                        <>
                            <Button variant="contained" style={button} color="error" component={Link} to="/login">
                                Login 
                            </Button>

                            <Button variant="contained" style={button} color="success" component={Link} to="/signup">
                                Signup
                            </Button>
                        </>
                    ) : (
        
                        <>
                         <Button variant="contained" style={button} color="info" component={Link} to="/home">
                            Home
                        </Button>
                        <Button variant="contained" style={button} color="info" component={Link} to="/post">
                            Post
                        </Button>
                        <Button variant="contained" style={button} color="info" component={Link} to="/notification">
                           
                        <FontAwesomeIcon icon={faBell} /> {/* Use FontAwesomeIcon for the bell icon */}
                        {notification.length >= 0 && (
                            <span style={{ 
                                marginLeft: '8px', 
                                backgroundColor: 'red', 
                                borderRadius: '12px', 
                                color: 'white', 
                                padding: '0 6px', 
                                // fontSize: '0.9rem' 
                            }}>
                                {notification.length}
                            </span>
                        )}
                        </Button>

                        <Logout setIsLoggedIn={setIsLoggedIn} />
                        </>
                    )}
                </Toolbar>
            </AppBar>
    );
};
