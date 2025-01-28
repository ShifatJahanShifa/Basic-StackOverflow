// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema({
//     postId: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'stackusers' },
//     text: { type: String }, 
//     userEmail: { type: String}, 
//     snippetUrl: { type: String },
//     view: { type: Boolean, default: false },  
//     createdAt: { type: Date, default: Date.now }
// });

// const notification= mongoose.model('notifications', notificationSchema);

// module.exports=notification 


const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Post ID from Post Service
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // User ID from User Service
    text: { type: String }, 
    userEmail: { type: String }, // Email of the user
    snippetUrl: { type: String }, // Snippet URL from MinIO
    view: { type: Boolean, default: false },  
    createdAt: { type: Date, default: Date.now }
});

const notification = mongoose.model('notifications', notificationSchema);

module.exports = notification;
