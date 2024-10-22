const express = require('express');
const router = express.Router();
const { createNotification, getNotifications, getSingleNotification } = require('../controllers/notificationController');

router.post('/notification', createNotification);
router.get('/notification',getNotifications)
router.get('/notification/:id',getSingleNotification)
// router.get('/notification/count',getNotificationsCount)


module.exports = router;