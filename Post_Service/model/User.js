const mongoose = require("mongoose")

const authDbConnection = mongoose.createConnection('mongodb://mongodb_user:27017/auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UserModel = authDbConnection.model(
    'stackusers',
    new mongoose.Schema({
        email: { type: String, required: true },
        name: { type: String },
    })
);

module.exports = UserModel;