import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logout from './Logout';
// import PostForm from './Postform';
// import Notification from './Notification';

export const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
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
                            Notification
                            {/* <i class="fa-solid fa-bell"></i> */}
                        </Button>

                        <Logout setIsLoggedIn={setIsLoggedIn} />
                        </>
                    )}
                </Toolbar>
            </AppBar>
    );
};
