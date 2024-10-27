const mongoose = require('mongoose');

const userNotificationMappingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'stackusers', required: true, unique: true },
    notifications: [
        {
            notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'notifications' },
            view: { type: Boolean, default: false }
        }
    ]
}, { timestamps: true });

const UserNotificationMapping = mongoose.model('UserNotificationMappings', userNotificationMappingSchema);
module.exports = UserNotificationMapping;
