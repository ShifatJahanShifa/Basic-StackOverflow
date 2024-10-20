import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostsList = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/post', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Use the token for authorization
                }
            });
            setPosts(response.data);
        } catch (error) {
            console.error(error);
            alert('Error fetching posts');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div>
            {posts.map(post => (
                <div key={post._id}>
                    <p>{post.text}</p>
                    {post.snippetUrl && (
                        <a href={post.snippetUrl} target="_blank" rel="noopener noreferrer">Download Code Snippet</a>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PostsList;
