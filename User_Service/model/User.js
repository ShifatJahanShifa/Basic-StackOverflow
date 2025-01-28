const mongoose = require("mongoose");
require('dotenv').config(); 


const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Create the User model
const UserModel = mongoose.model("stackusers", UserSchema);

module.exports = UserModel;
