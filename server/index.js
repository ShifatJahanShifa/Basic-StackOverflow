const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./model/User");
const post=require('./model/Post');
const notification=require('./model/Notification')
const Minio=require('minio')
const multer = require('multer');
const router = express.Router();
const axios= require('axios');
const upload = multer({ storage: multer.memoryStorage() });
const route=require('./routes/route')

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true
}));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
   
// MinIO setup
const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'password'
});

    
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
    
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));


app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, email: user.email };
                // console.log(email);
                // console.log(user.name);
                res.json("Success");
            } else {
                res.status(401).json("Password doesn't match");
            }
        } else {
            res.status(404).json("No Records found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: "Failed to logout" });
            } else {
                res.clearCookie('connect.sid'); // Clears the session cookie
                res.status(200).json("Logout successful");
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
    // req.session.destroy((err) => {
    //     if (err) {
    //         return res.status(500).json({ error: 'Failed to logout' });
    //     }
    //     res.status(200).json({ message: 'Logged out successfully' });
    // });
});

app.get('/user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json("Not authenticated");
    }
});

app.use('/',route)

// app.post('/post', upload.single('codeSnippet'), async (req, res) => {
//     const { text } = req.body;  // Get the text from the request body
//     const userId = req.session.user.id;  // Get the logged-in user's ID from the session

//     try {
//         let snippetUrl = null;

//         if (req.file) {
//             const fileName = `${Date.now()}-${req.file.originalname}`;
//             await minioClient.putObject('codes', fileName, req.file.buffer);
//             snippetUrl = fileName; // Store the file name for accessing it later
//         }

//         // Create a new post
//         const postt = new post({ text, userId, snippetUrl });
//         await postt.save();

//         // Create notifications for all users except the poster
//         const users = await UserModel.find({ _id: { $ne: userId } });
//         for (const user of users) {
//             const notifications = new notification({
//                 postId: postt._id,
//                 userId: user._id,
//                 text: text,
//                 userEmail: req.session.user.email,
//                 snippetUrl: snippetUrl,
//                 view: false
//             });
//             await notifications.save();
//         }

//         res.status(201).json({ msg: 'Post created successfully', post: postt });
//     } catch (error) {
//         console.error('Error creating post:', error);
//         res.status(500).json({ error: 'Error creating post' });
//     }
// });

// new


// app.get('/post', async (req, res) => {
//     try {
//         const userId = req.session.user.id;  // Get the logged-in user's ID
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
//                 fileContent: fileContent, // Add the content of the file to the post
//             };
//         }));

//         res.json(updatedPosts);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: 'Failed to fetch posts' });
//     }
// });


// Helper function to convert stream to string
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

// app.post('/notification',)

// app.get('/notification', async (req, res) => {
//     const notifications = await notification.find({ userId: req.session.user.id, view: false }).sort({createdAt: -1}).populate('postId');
//     res.json(notifications);
// });

// app.get('/notification/:id', async (req, res) => {
//     const { id } = req.params;

//     await notification.findByIdAndUpdate(id, { view: true });
//     // Find the notification and populate the related post
//     const notificationDetails = await notification.findById(id).populate('postId');

//     if (!notificationDetails) {
//         return res.status(404).json({ msg: 'Notification not found' });
//     }
//     console.log(notificationDetails);

//     // Fetch the associated post
//     const postId = notificationDetails.postId._id; // Assuming postId is populated
//     const postDetails = await post.findById(postId).populate('userId', 'email');

//     // If you want to fetch the file content as well, similar to your `/post` route
//     let fileContent = null;

//     if (postDetails.snippetUrl) {
//         try {
//             const dataStream = await minioClient.getObject('codes', postDetails.snippetUrl);
//             fileContent = await streamToString(dataStream);
//         } catch (error) {
//             console.error('Error fetching file from MinIO:', error);
//         }
//     }

//     // Combine notification and post details
//     const combinedDetails = {
//         notification: notificationDetails,
//         post: {
//             ...postDetails.toObject(),
//             fileContent: fileContent, // Add the content of the file to the post
//         }
//     };

//     res.json(combinedDetails);
// });
