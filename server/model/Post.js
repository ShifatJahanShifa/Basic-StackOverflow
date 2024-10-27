const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    text: { type: String , required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'stackusers' , required: true},
    snippetUrl: { type: String }
},{timestamps: true});

const post= mongoose.model('posts', postSchema);
module.exports=post 
