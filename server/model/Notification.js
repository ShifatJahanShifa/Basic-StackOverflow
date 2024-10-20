const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'stackusers' },
    text: { type: String }, // New field for notification text
    userEmail: { type: String}, // New field for user's email
    snippetUrl: { type: String },
    view: { type: Boolean, default: false },  // Add this field
    createdAt: { type: Date, default: Date.now }
});

const notification= mongoose.model('notifications', notificationSchema);

module.exports=notification 