const post=require('../model/Post')
const UserModel = require("../model/User");
const notification=require('../model/Notification')
const minioClient=require('../config/minioConfig').default
const { streamToString }=require('../helper/helper')

const createNotification= async (req, res) => {
    const { postId, text, userId, userEmail, snippetUrl } = req.body;

    try {
        // Find all users except the user who created the post
        const users = await UserModel.find({ _id: { $ne: userId } });

        for (const user of users) {
            const notif = new notification({
                postId: postId,
                userId: user._id,
                text: text,
                userEmail: userEmail,
                snippetUrl: snippetUrl,
                view: false  // Mark notification as unread
            });
            await notif.save(); // Save the notification for each user
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
        const notifications = await notification.find({
            userId: req.session.user.id,
            view: false
        }).sort({ createdAt: -1 }).populate('postId');
        
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    // const notifications = await notification.find({ userId: req.session.user.id, view: false }).sort({createdAt: -1}).populate('postId');
    // res.json(notifications);
}


const getSingleNotification=async (req, res) => {
    const { id } = req.params;

    await notification.findByIdAndUpdate(id, { view: true });
    // Find the notification and populate the related post
    const notificationDetails = await notification.findById(id).populate('postId');

    if (!notificationDetails) {
        return res.status(404).json({ msg: 'Notification not found' });
    }
    console.log(notificationDetails);

    // Fetch the associated post
    const postId = notificationDetails.postId._id; // Assuming postId is populated
    const postDetails = await post.findById(postId).populate('userId', 'email');

    // If you want to fetch the file content as well, similar to your `/post` route
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
            fileContent: fileContent, // Add the content of the file to the post
        }
    };

    res.json(combinedDetails);
}


const getNotificationsCount= async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.session.user.id; // Assuming session or token-based authentication

    // notification.countDocuments({ userId: userId, viewed: false }, (err, count) => {
    //     if (err) {
    //         return res.status(500).json({ error: 'Error fetching notification count' });
    //     }
    //     res.json({ count });
    // });
    try{
        const notifications = await notification.find({
            userId: req.session.user.id,
            view: false
        }).populate('postId');
        console.log(notifications.length);
        res.json({ count: notifications.length });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
} 

module.exports = {
    createNotification,
    getNotifications,
    getSingleNotification,
    // getNotificationsCount
}