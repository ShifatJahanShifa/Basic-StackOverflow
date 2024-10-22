const post=require('../model/Post')
const UserModel = require("../model/User");
const notification=require('../model/Notification')
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo")
const Minio=require('minio')
const axios = require('axios')
const minioClient=require('../config/minioConfig').default
const { streamToString }=require('../helper/helper')

// const minioClient = new Minio.Client({
//     endPoint: 'localhost',
//     port: 9000,
//     useSSL: false,
//     accessKey: 'admin',
//     secretKey: 'password'
// });

// const streamToString = (stream) => {
//     return new Promise((resolve, reject) => {
//         const chunks = [];
//         stream.on('data', (chunk) => {
//             chunks.push(chunk);
//         });
//         stream.on('end', () => {
//             resolve(Buffer.concat(chunks).toString('utf8'));
//         });
//         stream.on('error', reject);
//     });
// };

const getPosts= async(req,res)=>{
    try {
        const userId = req.session.user.id;  // Get the logged-in user's ID
        const posts = await post.find({ userId: { $ne: userId } }).sort({createdAt: -1})
            .populate('userId', 'email') // Populate userId with the email field
            .exec();

        // Fetch file content for each post
        const updatedPosts = await Promise.all(posts.map(async (postt) => {
            let fileContent = null;

            if (postt.snippetUrl) {
                // Fetch the file content from MinIO
                try {
                    const dataStream = await minioClient.getObject('codes', postt.snippetUrl);
                    fileContent = await streamToString(dataStream);
                } catch (error) {
                    console.error('Error fetching file from MinIO:', error);
                }
            }

            return {
                ...postt.toObject(),
                email: postt.userId.email,
                fileContent: fileContent, // Add the content of the file to the post
            };
        }));

        res.json(updatedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Failed to fetch posts' });
    }
}

const createPost= async(req,res)=>{
    const { text } = req.body;  // Get the text from the request body
    const userId = req.session.user.id;  // Get the logged-in user's ID from the session

    try {
        let snippetUrl = null;

        if (req.file) {
            const fileName = `${Date.now()}-${req.file.originalname}`;
            await minioClient.putObject('codes', fileName, req.file.buffer);
            snippetUrl = fileName; // Store the file name for accessing it later
        }

        // Create a new post
        const postt = new post({ text, userId, snippetUrl });
        await postt.save();

        // Create notifications for all users except the poster
        await axios.post(`${process.env.BASE_URL}/notification`, {
            postId: postt._id,
            text: text,
            userEmail: req.session.user.email,
            snippetUrl: snippetUrl,
            userId: userId
        });
        
        res.status(201).json({ msg: 'Post created successfully and notif sent'});
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Error creating post' });
    }
}

module.exports={
    getPosts,
    createPost
}