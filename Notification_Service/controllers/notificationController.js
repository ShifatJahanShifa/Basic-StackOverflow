const post=require('../model/Post')
const UserModel = require("../model/User");
const notification=require('../model/Notification')
const UserNotificationMapping=require('../model/UserNotification')
// const minioClient=require('../config/minioConfig').default
const { streamToString }=require('../helper/helper')
const Minio=require('minio')
const axios = require('axios')

const minioClient = new Minio.Client({
    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});


// final
const createNotification= async (req, res) => {

    const { postId, text, userId, userEmail, snippetUrl } = req.body;

    try {
        // // Find all users except the user who created the post  
        console.log('got call')

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

        // Find all users except the user who created the post; refactor
        // const users = await UserModel.find({ _id: { $ne: userId } });
        const response=await axios.get(`http://user-service:4003/auth/users/exclude/${userId}`,{
            withCredentials: true, // Ensure cookies are sent
                headers: {
                    'Cookie': req.headers.cookie // Pass the cookies from the incoming request
                }
        }) 
        users=response.data
        console.log('checccccckingggg',users.length)
        
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
        console.log('ddooooo')
    } catch (error) {
        console.error('Error creating notifications:', error);
        res.status(500).json({ error: 'Error creating notifications' });
    }
};


// new


// const getNotifications = async (req, res) => {
//     try {
//         // Fetch the UserNotificationMapping for the logged-in user
//         const userMapping = await UserNotificationMapping.findOne({ userId: req.user.id });

//         if (!userMapping || userMapping.notifications.length === 0) {
//             // If no mapping exists or there are no notifications, return an empty array
//             return res.json([]);
//         }

//         // Extract unread notification IDs
//         const unreadNotificationIds = userMapping.notifications
//             .filter(notif => !notif.view) // Filter unread notifications
//             .map(notif => notif.notificationId); // Map to notification IDs

//         if (unreadNotificationIds.length === 0) {
//             // If no unread notifications, return an empty array
//             return res.json([]);
//         }

//         // Fetch unread notifications from the `notifications` collection
//         const notifications = await notification
//             .find({ _id: { $in: unreadNotificationIds } })
//             .sort({ createdAt: -1 }) // Sort by creation date (most recent first)
//             .populate('postId'); // Populate post details if necessary

//         // Return the fetched notifications
//         res.json(notifications);
//     } catch (error) {
//         console.error('Error fetching notifications:', error);
//         res.status(500).json({ error: 'Failed to fetch notifications' });
//     }
// };





// const createNotification = async (req, res) => {
//     const { postId, text, userId, userEmail, snippetUrl } = req.body;

//     try {
//         // Create a notification object
//         const notif = new notification({
//             postId: postId,
//             userId: userId, // This is the user who created the post
//             text: text,
//             userEmail: userEmail,
//             snippetUrl: snippetUrl,
//             view: false // Mark as unread
//         });

//         await notif.save();

//         // Fetch all users except the poster from the User Service
//         const response = await axios.get(`${process.env.USER_SERVICE_URL}/users/exclude/${userId}`);
//         const users = response.data; // Assume this is an array of user IDs

//         // Process user notifications
//         for (const user of users) {
//             let userMapping = await UserNotificationMapping.findOne({ userId: user._id });

//             if (!userMapping) {
//                 // Create new user notification mapping if not exists
//                 userMapping = new UserNotificationMapping({
//                     userId: user._id,
//                     notifications: []
//                 });
//             }

//             // Add the new notification to the mapping
//             userMapping.notifications.push({
//                 notificationId: notif._id,
//                 view: false
//             });

//             await userMapping.save();
//         }

//         res.status(201).json({ msg: 'Notifications created successfully' });
//     } catch (error) {
//         console.error('Error creating notifications:', error);
//         res.status(500).json({ error: 'Error creating notifications' });
//     }
// };



// const getNotifications=async (req, res) => {

//     // if (!req.session.user) {
//     //     return res.status(401).json({ error: 'User not authenticated' });
//     // }
//     try {
//         // const notifications = await notification.find({
//         //     userId: req.session.user.id,
//         //     view: false
//         // }).sort({ createdAt: -1 }).populate('postId');
        
//         // res.json(notifications); 

//         const userMapping = await UserNotificationMapping.findOne({ userId: req.user.id });

//         if (!userMapping) {
//             return res.json([]); 
//         }

//         // Get the unread notifications from the mapping
//         const unreadNotifications = userMapping.notifications.filter(notif => !notif.view).map(notif => notif.notificationId);

//         const notifications = await notification.find({
//             _id: { $in: unreadNotifications }
//         }).sort({ createdAt: -1 }).populate('postId');
        
//         res.json(notifications);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }





// new



// const getSingleNotification=async (req, res) => {
//     const { id } = req.params;

//     // await notification.findByIdAndUpdate(id, { view: true });

//     await UserNotificationMapping.updateOne(
//         { userId: req.user.id, 'notifications.notificationId': id },
//         { $set: { 'notifications.$.view': true } } // Mark as viewed
//     );
    
//     const notificationDetails = await notification.findById(id).populate('postId');

//     if (!notificationDetails) {
//         return res.status(404).json({ msg: 'Notification not found' });
//     }
//     // console.log(notificationDetails);

//     // Fetch the associated post
//     const postId = notificationDetails.postId._id; // Assuming postId is populated
//     const postDetails = await post.findById(postId).populate('userId', 'email');

//     let fileContent = null;

//     if (postDetails.snippetUrl) {
//         try {
//             const dataStream = await minioClient.getObject('codes', postDetails.snippetUrl);
//             fileContent = await streamToString(dataStream);
//         } catch (error) {
//             console.error('Error fetching file from MinIO:', error);
//         }
//     }

//     // Combine notification and post details
//     const combinedDetails = {
//         notification: notificationDetails,
//         post: {
//             ...postDetails.toObject(),
//             fileContent: fileContent, 
//         }
//     };

//     res.json(combinedDetails);
// }


const getNotifications = async (req, res) => {
    try {
        // Fetch the UserNotificationMapping for the logged-in user
        const userMapping = await UserNotificationMapping.findOne({ userId: req.user.id });
        // console.log("seee",userMapping.notifications.length)
        // if (!userMapping || userMapping.notifications.length === 0) {
        //     // If no mapping exists or there are no notifications, return an empty array
        //     return res.json([]);
        // }

        if (!userMapping) {
            console.log('No UserNotificationMapping found for user:', req.user.id);
            return res.json([]); // Return an empty array if no mapping exists
        }

        if (!userMapping.notifications || userMapping.notifications.length === 0) {
            console.log('No notifications for user:', req.user.id);
            return res.json([]); // No notifications
        }


        // Extract unread notification IDs
        const unreadNotificationIds = userMapping.notifications
            .filter(notif => !notif.view) // Filter unread notifications
            .map(notif => notif.notificationId); // Map to notification IDs

        if (unreadNotificationIds.length === 0) {
            // If no unread notifications, return an empty array
            return res.json([]);
        }

        // Fetch unread notifications from the `notifications` collection
        const notifications = await notification
            .find({ _id: { $in: unreadNotificationIds } })
            .sort({ createdAt: -1 }) // Sort by creation date (most recent first)
            .lean(); // Fetch as plain JS objects

        // Fetch associated user and post data
        const updatedNotifications = await Promise.all(
            notifications.map(async (notif) => {
                let user = null;
                let post = null;

                // Fetch user details
                if (notif.userId) {
                    try {
                        const response=await axios.get(`http://user-service:4003/auth/users/${notif.userId}`, {
                            withCredentials: true, // Ensure cookies are sent
                            headers: {
                                'Cookie': req.headers.cookie // Pass the cookies from the incoming request
                            }
                        });
                        user=response.data;
                    } catch (error) {
                        console.error('Error fetching user details:', error);
                    }
                }

                // Fetch post details
                // if (notif.postId) {
                //     try {
                //         post = await post.findById(notif.postId).lean();
                //     } catch (error) {
                //         console.error('Error fetching post details:', error);
                //     }
                // }

                return {
                    ...notif,
                    user: user ? { id: user._id, email: user.email } : null, // Include user details
                    // post: post ? { id: post._id } : null, // Include post details
                //  text: { type: String , required: true},
                //     userId: { type: mongoose.Schema.Types.ObjectId, required: true},
                //     snippetUrl: { type: String }
                };
            })
        );

        // Return the merged notifications
        res.json(updatedNotifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};




// const getSingleNotification = async (req, res) => {
//     const { id } = req.params; // Notification ID from request parameters

//     try {
//         // Mark the notification as viewed in the UserNotificationMapping
//         const updateResult = await UserNotificationMapping.updateOne(
//             { userId: req.user.id, 'notifications.notificationId': id },
//             { $set: { 'notifications.$.view': true } } // Update the specific notification's view status
//         );

//         if (updateResult.modifiedCount === 0) {
//             return res.status(404).json({ msg: 'Notification not found or already viewed' });
//         }

//         // Fetch notification details
//         const notificationDetails = await notification.findById(id).populate('postId');
//         if (!notificationDetails) {
//             return res.status(404).json({ msg: 'Notification not found' });
//         }

//         // Fetch the associated post details
//         const postDetails = await post.findById(notificationDetails.postId._id).populate('userId', 'email');
//         if (!postDetails) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }

//         let fileContent = null;

//         // Fetch code snippet content from MinIO if available
//         if (postDetails.snippetUrl) {
//             try {
//                 const dataStream = await minioClient.getObject('codes', postDetails.snippetUrl);
//                 fileContent = await streamToString(dataStream); // Convert stream to string
//             } catch (error) {
//                 console.error('Error fetching file from MinIO:', error);
//             }
//         }

//         // Combine notification and post details
//         const combinedDetails = {
//             notification: notificationDetails,
//             post: {
//                 ...postDetails.toObject(),
//                 fileContent: fileContent, // Include file content if available
//             }
//         };

//         // Respond with the combined data
//         res.json(combinedDetails);
//     } catch (error) {
//         console.error('Error fetching single notification:', error);
//         res.status(500).json({ error: 'Failed to fetch notification details' });
//     }
// };


const getSingleNotification = async (req, res) => {
    try {
        const { id } = req.params;

        // Update the notification view status for the logged-in user
        await UserNotificationMapping.updateOne(
            { userId: req.user.id, 'notifications.notificationId': id },
            { $set: { 'notifications.$.view': true } } // Mark as viewed
        );

        // Fetch the notification details
        const notificationDetails = await notification.findById(id).lean();

        if (!notificationDetails) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        let postDetails = null;
        let fileContent = null;
        let userDetails = null;

        console.log('Notification Details:', notificationDetails);


        // Fetch the associated post details
       // if (notificationDetails.postId) {
           // try {
                // postDetails = await post.findById(notificationDetails.postId).lean();  refactored
                // postDetails=await notificationDetails.text;

                // // Fetch the associated user details (from the post)
                // if (postDetails?.userId) {
                //     userDetails = await UserModel.findById(postDetails.userId).lean();
                // }

                // Fetch file content from MinIO
                //if (notificationDetails?.snippetUrl) {
                    try {
                        const dataStream = await minioClient.getObject('codes', notificationDetails.snippetUrl);
                        fileContent = await streamToString(dataStream);
                    } catch (error) {
                        console.error('Error fetching file from MinIO:', error);
                    }
            //     }
            // } catch (error) {
            //     console.error('Error fetching post or user details:', error);
            // }
        //}

        // Combine notification, post, and user details
        const combinedDetails = {
            notification: notificationDetails,
            // post: postDetails
            //     ? {
            //           ...postDetails,
            //           user: userDetails ? { id: userDetails._id, email: userDetails.email } : null,
            //           fileContent: fileContent,
            //       }
            //     : null,
            post: fileContent,
        };

        res.json(combinedDetails);
    } catch (error) {
        console.error('Error fetching single notification:', error);
        res.status(500).json({ error: 'Failed to fetch notification' });
    }
};

const updateNotification=async (req, res) => {
    const { id } = req.params;

    try {
        await UserNotificationMapping.updateOne(
            { userId: req.user.id, 'notifications.notificationId': id },
            { $set: { 'notifications.$.view': true } } // Mark as viewed
        );
    }
    catch(error)
    {
        console.error('Error updating notification:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
}

module.exports = {
    createNotification,
    getNotifications,
    getSingleNotification,
    updateNotification
}