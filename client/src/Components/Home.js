import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './home.css';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state?.user);
    const [loading, setLoading] = useState(!user);
    const [posts, setPosts] = useState([]);

    // Function to fetch posts from the backend
    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/post', 
                {
                    withCredentials: true // Ensure cookies are included if you're using sessions
                });
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            // alert('Error fetching posts');
        }
    };

    // Check for user session or redirect to login
    useEffect(() => {
        if (!user) {
            axios.get('http://localhost:3001/user', { withCredentials: true })
                .then(response => {
                    if (response.data.user) {
                        setUser(response.data.user);
                        fetchPosts(); // Fetch posts after user is authenticated
                    } else {
                        navigate("/login");
                    }
                })
                .catch(() => navigate("/login"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
            fetchPosts(); // Fetch posts if user is already set
        }
    }, [user, navigate]);

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }


// Rendering posts with content
return (
    <div className="container">
        {posts.map(post => (
            <div key={post._id} className="post">
                {/* <h3>{post.email}</h3> */}
                <p>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true})}</p>
                <p className="text">{post.text}</p>
                {post.fileContent && (
                    <pre className="code-block">
                        <code className="code">{post.fileContent}</code> {/* Display code content */}
                    </pre>
                )}
            </div>
        ))}
    </div>
    );


    // return (
    //     <div>
    //         <h2>Recent Posts</h2>
    //         <div>
    //             {posts.length > 0 ? (
    //                 posts.map(post => (
    //                     <div key={post._id}>
    //                         <p>{post.text}</p>
    //                         {post.snippetUrl && (
    //                             <a href={post.snippetUrl} target="_blank" rel="noopener noreferrer">Download Code Snippet</a>
    //                         )}
    //                     </div>
    //                 ))
    //             ) : (
    //                 <p>No posts available</p>
    //             )}
    //         </div>
    //     </div>
        
    // );
}

export default Home;
