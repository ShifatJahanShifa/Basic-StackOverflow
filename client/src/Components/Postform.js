// // // import React, { useState } from 'react';
// // // import axios from 'axios';

// // // const PostForm = () => {
// // //     const [text, setText] = useState('');
// // //     const [file, setFile] = useState(null);

// // //     const handleSubmit = async (e) => {
// // //         e.preventDefault();
// // //         const formData = new FormData();
// // //         formData.append('text', text);
// // //         if (file) {
// // //             formData.append('codeSnippet', file);
// // //         }

// // //         try {
// // //             const response = await axios.post('http://localhost:3001/post', formData, {
// // //                 headers: {
// // //                     'Content-Type': 'multipart/form-data',
// // //                     'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure the token is stored in localStorage after login
// // //                 }
// // //             });
// // //             alert(response.data.msg);
// // //         } catch (error) {
// // //             console.error(error);
// // //             alert('Error posting data');
// // //         }
// // //     };

// // //     return (
// // //         <form onSubmit={handleSubmit}>
// // //             <textarea
// // //                 value={text}
// // //                 onChange={(e) => setText(e.target.value)}
// // //                 placeholder="Enter your text here"
// // //                 required
// // //             />
// // //             <input type="file" onChange={(e) => setFile(e.target.files[0])} />
// // //             <button type="submit">Submit Post</button>
// // //         </form>
// // //     );
// // // };

// // // export default PostForm;

// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";

// // function PostForm() {
// //     const navigate = useNavigate();
// //     const [loading, setLoading] = useState(true);
// //     const [postText, setPostText] = useState('');
// //     const [user, setUser] = useState(null);

// //     // Check for user session or redirect to login
// //     useEffect(() => {
// //         axios.get('http://localhost:3001/user', { withCredentials: true })
// //             .then(response => {
// //                 if (response.data.user) {
// //                     setUser(response.data.user);
// //                 } else {
// //                     navigate("/login");
// //                 }
// //             })
// //             .catch(() => navigate("/login"))
// //             .finally(() => setLoading(false));
// //     }, [user,navigate]);

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         try {
// //             await axios.post('http://localhost:3001/post', { text: postText }, {
// //                 withCredentials: true // Ensure cookies are included if you're using sessions
// //             });
// //             // Clear the input field after successful post
// //             setPostText('');
// //             alert('Post submitted successfully!');
// //         } catch (error) {
// //             console.error('Error submitting post:', error);
// //             alert('Error submitting post');
// //         }
// //     };

// //     if (loading) {
// //         return <center><h1>Loading...</h1></center>;
// //     }

// //     return (
// //         <div>
// //             <h2>Post Your Snippet</h2>
// //             <form onSubmit={handleSubmit}>
// //                 <textarea
// //                     value={postText}
// //                     onChange={(e) => setPostText(e.target.value)}
// //                     placeholder="Write your post here..."
// //                     required
// //                     style={{ width: '100%', height: '100px' }} // Basic styling
// //                 />
// //                 <br />
// //                 <button type="submit">Submit Post</button>
// //             </form>
// //         </div>
// //     );
// // }

// // export default PostForm;


// /// new 

// import React, { useState } from 'react';
// import axios from 'axios';

// const PostForm = () => {
//     const [text, setText] = useState('');  // State for text input
//     const [file, setFile] = useState(null); // State for file input

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Create FormData to handle text and file upload
//         const formData = new FormData();
//         formData.append('text', text);  // Append text to form data
//         if (file) {
//             formData.append('codeSnippet', file);  // Append file to form data if it's selected
//         }

//         try {
//             // Make a POST request to the backend
//             const response = await axios.post('http://localhost:3001/post', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',  // Set the content type for file upload
//                     // 'Authorization': `Bearer ${localStorage.getItem('token')}`  // Include auth token if required
//                 },
//                 withCredentials: true  // Include credentials if using session-based auth
//             });

//             // Alert or update the UI based on the response
//             alert(response.data.msg);
//             setText('');  // Clear the text input
//             setFile(null);  // Clear the file input
//         } catch (error) {
//             console.error('Error posting data:', error);
//             alert('Error posting data');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <label>Text:</label>
//                 <textarea
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}  // Update text input
//                     placeholder="Enter your post text here..."
//                     required
//                     style={{ width: '100%', height: '100px' }}
//                 />
//             </div>
//             <div>
//                 <label>Upload Code Snippet:</label>
//                 <input
//                     type="file"
//                     onChange={(e) => setFile(e.target.files[0])}  // Update file input when file is selected
//                     accept=".js,.txt,.py,.html,.css"  // Accept common code file formats
//                 />
//             </div>
//             <button type="submit">Submit Post</button>
//         </form>
//     );
// };

// export default PostForm;


// two

import React, { useState } from 'react';
import axios from 'axios';
import './post.css';

const PostForm = () => {
    const [text, setText] = useState('');  // State for text input
    const [file, setFile] = useState(null); // State for file input
    const [codeSnippet, setCodeSnippet] = useState(''); // State for code snippet input
    const [fileExtension, setFileExtension] = useState(''); // State for file extension

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData();

        // Append the text to form data
        formData.append('text', text);

        // If the user provides a code snippet and selects an extension
        if (codeSnippet && fileExtension) {
            const blob = new Blob([codeSnippet], { type: 'text/plain' });
            const newFile = new File([blob], `snippet${fileExtension}`, { type: 'text/plain' });
            formData.append('codeSnippet', newFile);
        } else if (file) {
            // If the user uploads a file directly
            formData.append('codeSnippet', file);
        } else {
            alert('Please provide a code snippet or upload a file.');
            return;
        }

        try {
            // Make a POST request to the backend
            const response = await axios.post('http://localhost:3001/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // Set the content type for file upload
                },
                withCredentials: true  // Include credentials if using session-based auth
            });

            // Alert or update the UI based on the response
            alert(response.data.msg);
            setText('');  // Clear the text input
            setFile(null);  // Clear the file input
            setCodeSnippet(''); // Clear the code snippet input
            setFileExtension(''); // Clear the file extension input
        } catch (error) {
            console.error('Error posting data:', error);
            // alert('Error posting data');
        }
    };

    return (
        // <form onSubmit={handleSubmit}>
        //     <div>
        //         <label>Text:</label>
        //         <textarea
        //             value={text}
        //             onChange={(e) => setText(e.target.value)}  // Update text input
        //             placeholder="Enter your post text here..."
        //             required
        //             style={{ width: '100%', height: '100px' }}
        //         />
        //     </div>
        //     <div>
        //         <label>Code Snippet:</label>
        //         <textarea
        //             value={codeSnippet}
        //             onChange={(e) => setCodeSnippet(e.target.value)}  // Update code snippet input
        //             placeholder="Enter your code snippet here..."
        //             style={{ width: '100%', height: '100px' }}
        //         />
        //     </div>
        //     <div>
        //         <label>Select File Extension:</label>
        //         <select
        //             value={fileExtension}
        //             onChange={(e) => setFileExtension(e.target.value)} // Update file extension
        //         >
        //             <option value="">Select Extension</option>
        //             <option value=".js">.js</option>
        //             <option value=".txt">.txt</option>
        //             <option value=".py">.py</option>
        //             <option value=".html">.html</option>
        //             <option value=".css">.css</option>
        //         </select>
        //     </div>
        //     <div>
        //         <label>Upload Code Snippet:</label>
        //         <input
        //             type="file"
        //             onChange={(e) => setFile(e.target.files[0])}  // Update file input when file is selected
        //             accept=".js,.txt,.py,.html,.css"  // Accept common code file formats
        //         />
        //     </div>
        //     <button type="submit">Submit Post</button>
        // </form> 
        <div className="post-form-container">
        <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
                <label>Text:</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}  
                    placeholder="Enter your post text here..."
                    required
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Code Snippet:</label>
                <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}  
                    placeholder="Enter your code snippet here..."
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Select File Extension:</label>
                <select
                    value={fileExtension}
                    onChange={(e) => setFileExtension(e.target.value)} 
                    className="form-control"
                >
                    <option value="">Select Extension</option>
                    <option value=".js">.js</option>
                    <option value=".txt">.txt</option>
                    <option value=".py">.py</option>
                    <option value=".html">.html</option>
                    <option value=".css">.css</option>
                </select>
            </div>
            <div className="form-group">
                <label>Or upload Code File:</label>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}  
                    accept=".js,.txt,.py,.html,.css"  
                    className="form-control"
                />
            </div>
            <button type="submit" className="btn btn-primary">Submit Post</button>
        </form>
    </div>
    );
};

export default PostForm;

