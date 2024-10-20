const mongoose = require("mongoose");
require('dotenv').config(); 

// Define the User schema
const UserSchema = new mongoose.Schema({
    // name: String, // Uncomment if you want to include name
    email: String,
    password: String
});

// Create the User model
const UserModel = mongoose.model("stackusers", UserSchema);

// Export the model
module.exports = UserModel;
