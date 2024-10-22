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
        if(codeSnippet && file) 
        {
            alert('select only one method: file upload or code snippet upload with extension')
            return
        }
        if (codeSnippet) {
            if (!fileExtension) {
                alert('Please select a file extension for the code snippet.');
                return;
            }
    
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
                    <option value=".c">.c</option>
                    <option value=".cpp">.cpp</option>
                    <option value=".java">.java</option>
                    <option value=".sh">.sh</option>
                    <option value=".jsx">.jsx</option>
                </select>
            </div>
            <div className="form-group">
                <label>Or upload Code File:</label>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}  
                    accept=".js,.txt,.py,.html,.css,.c,.cpp,.java"  
                    className="form-control"
                />
            </div>
            <button type="submit" className="btn btn-primary">Submit Post</button>
        </form>
    </div>
    );
};

export default PostForm;

