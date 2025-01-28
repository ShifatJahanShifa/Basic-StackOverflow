// const mongoose = require('mongoose');

// const userNotificationMappingSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'stackusers', required: true, unique: true },
//     notifications: [
//         {
//             notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'notifications' },
//             view: { type: Boolean, default: false }
//         }
//     ]
// }, { timestamps: true });

// const UserNotificationMapping = mongoose.model('UserNotificationMappings', userNotificationMappingSchema);
// module.exports = UserNotificationMapping;


const mongoose = require('mongoose');

const userNotificationMappingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true }, // User ID from User Service
    notifications: [
        {
            notificationId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Notification ID
            view: { type: Boolean, default: false } // Indicates whether the notification has been viewed
        }
    ]
}, { timestamps: true });

const UserNotificationMapping = mongoose.model('UserNotificationMappings', userNotificationMappingSchema);

module.exports = UserNotificationMapping;
