const post=require('../model/Post')
const UserModel = require("../model/User");
const notification=require('../model/Notification')
const UserNotificationMapping=require('../model/UserNotification')
const minioClient=require('../config/minioConfig').default
const { streamToString }=require('../helper/helper')

const createNotification= async (req, res) => {
    const { postId, text, userId, userEmail, snippetUrl } = req.body;

    try {
        // // Find all users except the user who created the post
        // const users = await UserModel.find({ _id: { $ne: userId } });

        // for (const user of users) {
        //     const notif = new notification({
        //         postId: postId,
        //         userId: user._id,
        //         text: text,
        //         userEmail: userEmail,
        //         snippetUrl: snippetUrl,
        //         view: false  // Mark notification as unread
        //     });
        //     await notif.save(); 
        // }
        
        // Create the notification
        const notif = new notification({
            postId: postId,
            userId: userId,
            text: text,
            userEmail: userEmail,
            snippetUrl: snippetUrl,
            view: false  // Mark notification as unread
        });
        await notif.save(); 

        // Find all users except the user who created the post
        const users = await UserModel.find({ _id: { $ne: userId } });

        for (const user of users) {
            let userMapping = await UserNotificationMapping.findOne({ userId: user._id });

            if (!userMapping) {
                userMapping = new UserNotificationMapping({
                    userId: user._id,
                    notifications: []
                });
            }

            userMapping.notifications.push({
                notificationId: notif._id,
                view: false  
            });

            await userMapping.save(); 
        }

        res.status(201).json({ msg: 'Notifications created successfully' });
    } catch (error) {
        console.error('Error creating notifications:', error);
        res.status(500).json({ error: 'Error creating notifications' });
    }
};

const getNotifications=async (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    try {
        // const notifications = await notification.find({
        //     userId: req.session.user.id,
        //     view: false
        // }).sort({ createdAt: -1 }).populate('postId');
        
        // res.json(notifications); 

        const userMapping = await UserNotificationMapping.findOne({ userId: req.session.user.id });

        if (!userMapping) {
            return res.json([]); 
        }

        // Get the unread notifications from the mapping
        const unreadNotifications = userMapping.notifications.filter(notif => !notif.view).map(notif => notif.notificationId);

        const notifications = await notification.find({
            _id: { $in: unreadNotifications }
        }).sort({ createdAt: -1 }).populate('postId');
        
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getSingleNotification=async (req, res) => {
    const { id } = req.params;

    // await notification.findByIdAndUpdate(id, { view: true });

    await UserNotificationMapping.updateOne(
        { userId: req.session.user.id, 'notifications.notificationId': id },
        { $set: { 'notifications.$.view': true } } // Mark as viewed
    );
    
    const notificationDetails = await notification.findById(id).populate('postId');

    if (!notificationDetails) {
        return res.status(404).json({ msg: 'Notification not found' });
    }
    // console.log(notificationDetails);

    // Fetch the associated post
    const postId = notificationDetails.postId._id; // Assuming postId is populated
    const postDetails = await post.findById(postId).populate('userId', 'email');

    let fileContent = null;

    if (postDetails.snippetUrl) {
        try {
            const dataStream = await minioClient.getObject('codes', postDetails.snippetUrl);
            fileContent = await streamToString(dataStream);
        } catch (error) {
            console.error('Error fetching file from MinIO:', error);
        }
    }

    // Combine notification and post details
    const combinedDetails = {
        notification: notificationDetails,
        post: {
            ...postDetails.toObject(),
            fileContent: fileContent, 
        }
    };

    res.json(combinedDetails);
}


module.exports = {
    createNotification,
    getNotifications,
    getSingleNotification
}