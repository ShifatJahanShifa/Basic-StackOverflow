const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./model/User");
const Minio=require('minio')
const multer = require('multer');
const router = express.Router();
const axios= require('axios');
const upload = multer({ storage: multer.memoryStorage() });


dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:80',
        'http://post-service:4002','http://notification-service:4001'
    ], // Replace with your frontend's URL
    credentials: true
}));


// db connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => 
        {
            app.listen(process.env.PORT, () => {
                console.log(`Server is running on port ${process.env.PORT}`);
            });
            
            console.log('Connected to MongoDB')
        })
    .catch(err => console.error('Failed to connect to MongoDB', err)); 


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,     // no update
    saveUninitialized: true,    // store when created
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));


app.post("/auth/signup", async (req, res) => {
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

app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, email: user.email };
                res.json("Success");
            } else {
                res.status(401).json("Password doesn't match. Unauthorized user");
            }
        } else {
            res.status(404).json("No Records found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/auth/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: "Failed to logout" });
            } else {
                res.clearCookie('connect.sid'); // Clears the session cookie
                // res.status(200).json("Logout successful");
                setTimeout(() => {
                    res.status(200).json("Logout successful");
                }, 100);
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
});

app.get('/auth/user', (req, res) => {
    // console.log('got called User:', req.session.user);
    if (req.session.user) {
        // console.log('got called User:', req.session.user);
        res.json({ user: req.session.user });
    } else {
        // console.log('got called User:', req.session.user);
        res.status(401).json("Not authenticated");
    }
});


// new api endpoint
app.get('/auth/users/exclude/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const users = await UserModel.find({ _id: { $ne: userId } }).select('_id');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

app.get('/auth/users/:userId', async(req,res)=>{
    const { userId } = req.params;
    try{
        const user = await UserModel.findById(userId).lean(); // Query the database for the user
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Handle case where user doesn't exist
        }
        res.status(200).json({
            id: user._id, // Return only necessary fields
            email: user.email,
        });
    }
    catch(error)
    {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user\'s details' });
    }
})