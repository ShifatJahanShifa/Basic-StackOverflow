const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
// const UserModel = require("./model/User");
// const post=require('./model/Post');
const notification=require('./model/Notification')
const Minio=require('minio')
const multer = require('multer');
const router = express.Router();
const axios= require('axios');
const upload = multer({ storage: multer.memoryStorage() });
const route=require('./route/notification')

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:80',
        'http://post-service:4002','http://notification-service:4001'
    ], // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
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


    // app.use(session({
    //     secret: process.env.SESSION_SECRET,
    //     resave: false,     // no update
    //     saveUninitialized: true,    // store when created
    //     store: MongoStore.create({
    //         mongoUrl: process.env.MONGO_URL
    //     }),
    //     cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
    // })); 

    app.use('/',route)