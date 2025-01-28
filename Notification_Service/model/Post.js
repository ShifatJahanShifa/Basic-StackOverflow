const mongoose = require('mongoose');

const postDbConnection = mongoose.createConnection('mongodb://mongodb_post:27017/post', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
    text: { type: String , required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, required: true},
    snippetUrl: { type: String }
},{timestamps: true});

const post= postDbConnection.model('posts', postSchema);
module.exports=post 
