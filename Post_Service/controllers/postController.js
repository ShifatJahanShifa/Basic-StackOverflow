const post=require('../model/Post')
const UserModel = require("../model/User");
// const notification=require('../model/Notification')
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo")
const Minio=require('minio')
const axios = require('axios')
// const minioClient=require('../config/minioConfig').default
const { streamToString }=require('../helper/helper')
const { v4: uuidv4 } = require('uuid')



const minioClient = new Minio.Client({
    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});



// const getPosts= async(req,res)=>{
//     try {
//         const userId = req.user.id;  // Get the logged-in user's ID, document id
//         const posts = await post.find({ userId: { $ne: userId } }).sort({createdAt: -1})
//             .populate('userId', 'email') // Populate userId with the email field
//             .exec();

//         // Fetch file content for each post
//         const updatedPosts = await Promise.all(posts.map(async (postt) => {
//             let fileContent = null;

//             if (postt.snippetUrl) {
//                 // Fetch the file content from MinIO
//                 try {
//                     const dataStream = await minioClient.getObject('codes', postt.snippetUrl);
//                     fileContent = await streamToString(dataStream);
//                 } catch (error) {
//                     console.error('Error fetching file from MinIO:', error);
//                 }
//             }

//             return {
//                 ...postt.toObject(),
//                 email: postt.userId.email,
//                 fileContent: fileContent, // Add the content of the file to the post
//             };
//         }));

//         res.json(updatedPosts);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: 'Failed to fetch posts' });
//     }
// }




const getPosts = async (req, res) => {
    try {
        const userId = req.user.id; // Logged-in user's ID from the request
        const posts = await post.find({ userId: { $ne: userId } })
            .sort({ createdAt: -1 })
            .lean(); // Fetch posts as plain JS objects

        // Fetch user details and file content for each post
        const updatedPosts = await Promise.all(
            posts.map(async (postt) => {
                let fileContent = null;
                let user = null;

                try {
                    const response=await axios.get(`http://user-service:4003/auth/users/${postt.userId}`, {
                        withCredentials: true, // Ensure cookies are sent
                        headers: {
                            'Cookie': req.headers.cookie // Pass the cookies from the incoming request
                        }
                    });
                    user=response.data;
                } catch (error) {
                    console.error('Error getting users details:', error);
                    // Continue even if the notification service fails
                }

                // Fetch the file content from MinIO
                if (postt.snippetUrl) {
                    try {
                        const dataStream = await minioClient.getObject('codes', postt.snippetUrl);
                        fileContent = await streamToString(dataStream); // Convert MinIO data stream to a string
                    } catch (error) {
                        console.error('Error fetching file from MinIO:', error);
                    }
                }

                return {
                    ...postt,
                    email: user ? user.email : null, // Include user's email
                    fileContent: fileContent,       // Include the content of the file
                };
            })
        );

        res.json(updatedPosts);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        res.status(500).json({ msg: 'Failed to fetch posts' });
    }
};



// const createPost= async(req,res)=>{
//     const { text } = req.body;  
//     const userId = req.user.id;  

//     try {
//         let snippetUrl = null;

//         if (req.file) {
//             const fileName = `${Date.now()}-${req.file.originalname}`;
//             await minioClient.putObject('codes', fileName, req.file.buffer);
//             snippetUrl = fileName; 
//         }

//         // Create a new post
//         const postt = new post({ text, userId, snippetUrl });
//         await postt.save();

//         // Create notifications for all users except the poster
//         await axios.post(`${process.env.BASE_URL}/notification`, {
//             postId: postt._id,
//             text: text,
//             userEmail: req.user.email,
//             snippetUrl: snippetUrl,
//             userId: userId
//         });
        
//         res.status(201).json({ msg: 'Post created successfully and notif sent'});
//     } catch (error) {
//         console.error('Error creating post:', error);
//         res.status(500).json({ error: 'Error creating post' });
//     }
// }



const createPost = async (req, res) => {
    const { text } = req.body; // Text content of the post
    const userId = req.user.id; // Authenticated user's ID from the request
    const userEmail = req.user.email; // Authenticated user's email from the request

    try {
        let snippetUrl = null;

        // Handle file upload to MinIO
        if (req.file) {
            const fileName = `${uuidv4()}-${req.file.originalname}`; // Generate a unique filename
            await minioClient.putObject('codes', fileName, req.file.buffer); // Upload file to MinIO
            snippetUrl = fileName; // Save the file name for the database
        }

        // Create a new post in the database
        const newPost = new post({
            text,
            userId,
            snippetUrl,
        });
        await newPost.save();

        // Send notifications to other users
        try {
            // POST request to the notifications service
            await axios.post('http://notification-service:4001/notification', {
                postId: newPost._id,  // ID of the new post
                text: text,           // Text content of the post
                userEmail: userEmail, // Email of the poster
                snippetUrl: snippetUrl, // URL to the file snippet (if any)
                userId: userId        // ID of the poster
            },{
                withCredentials: true, // Ensure cookies are sent
                headers: {
                    'Cookie': req.headers.cookie // Pass the cookies from the incoming request
                }
            });
        } catch (notifError) {
            console.error('Error sending notifications:', notifError.message);
            // Continue even if the notification service fails
        }

        res.status(201).json({ msg: 'Post created successfully and notification sent' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Error creating post' });
    }
};


const getSinglePost = async (req, res) => {
    try {
        const { id } = req.params;
        // let postDetails = null;
        let fileContent = null;
        let userDetails = null;

        let postt = await post.findById(id).lean();

        // const { notificationId } = req.body;
        ///   jkwnjhwrjfhjkwhfjwhfjhwjkfhwjehfjkh8888888888888888888
        // const { notificationId } = req.query;
        // console.log("notificationId in post  ",notificationId)
        // Fetch user details and file content for each post
        // postDetails = await Promise.all(
        //     posts.map(async (postt) => {
                // let fileContent = null;
                let user = null;
                console.log("postt in post  ",postt)
                // try{
                //     const ok=await axios.patch(`http://notification-service:4001/notification/${notificationId}`, 
                //         {
                //             // Fields to update
                //             "view": true,
    
                //         },
                //         {
                //             withCredentials: true, // Ensure cookies are sent
                //             headers: {
                //                 'Cookie': req.headers.cookie // Pass the cookies from the incoming request
                //             }
                //         });
                // }
                // catch (error) {
                //     console.error('Error updating posts details:', error);
                //     // Continue even if the notification service fails
                // }

                try {
                    const response=await axios.get(`http://user-service:4003/auth/users/${postt.userId}`, {
                        withCredentials: true, // Ensure cookies are sent
                        headers: {
                            'Cookie': req.headers.cookie // Pass the cookies from the incoming request
                        }
                    });
                    user=response.data;
                } catch (error) {
                    console.error('Error getting users details:', error);
                    // Continue even if the notification service fails
                }

                // Fetch the file content from MinIO
                if (postt.snippetUrl) {
                    try {
                        const dataStream = await minioClient.getObject('codes', postt.snippetUrl);
                        fileContent = await streamToString(dataStream); // Convert MinIO data stream to a string
                    } catch (error) {
                        console.error('Error fetching file from MinIO:', error);
                    }
                }

                const postDetails ={
                    ...postt,
                    email: user ? user.email : null, // Include user's email
                    fileContent: fileContent,       // Include the content of the file
                };
            
       
                console.log("postDetails in post  ",postDetails)
        res.json(postDetails);
    } catch (error) {
        console.error('Error fetching single post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};


module.exports={
    getPosts,
    createPost,
    getSinglePost
}