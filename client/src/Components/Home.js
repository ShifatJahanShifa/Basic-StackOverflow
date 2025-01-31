import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './home.css';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state?.user);
    const [loading, setLoading] = useState(!user);
    const [posts, setPosts] = useState([]);

    // Function to fetch posts from the backend
    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:80/post',
                {
                    withCredentials: true 
                });
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Check for user session or redirect to login
    useEffect(() => {
        if (!user) {
            axios.get('http://localhost:80/auth/user', { withCredentials: true })
                .then(response => {
                    if (response.data.user) {
                        setUser(response.data.user);
                        fetchPosts(); 
                    } else {
                        navigate("/login");
                    }
                })
                .catch(() => navigate("/login"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
            fetchPosts(); 
        }
    }, [user, navigate]);

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }


    return (
        <div className="container">
            {posts.map(post => (
                <div key={post._id} className="post">
                    <h3>{post.email}</h3>
                    <p>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                    <p className="text">{post.text}</p>
                    {post.fileContent && (
                        <pre className="code-block">
                            <SyntaxHighlighter language="javascript" style={docco} >
                                {typeof post.fileContent === 'object'
                                    ? JSON.stringify(post.fileContent, null, 2) // Convert object to string
                                    : String(post.fileContent)} 
                            </SyntaxHighlighter>
                        </pre>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Home;
