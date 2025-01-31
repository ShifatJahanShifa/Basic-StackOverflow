const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const post=require('./model/Post');

const Minio=require('minio')
const multer = require('multer');
const router = express.Router();
const axios= require('axios');
const upload = multer({ storage: multer.memoryStorage() });
const route=require('./route/post')

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:80',
        'http://user-service:4003','http://notification-service:4001',
        'http://localhost:3000/'
    ], 
    credentials: true
}));
app.options('*', cors());


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


    app.use('/',route)