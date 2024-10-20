const express = require('express');
const router = express.Router();
const { createNotification, getNotifications, getSingleNotification } = require('../controllers/notificationController');

router.post('/notification', createNotification);
router.get('/notification',getNotifications)
router.get('/notification/:id',getSingleNotification)


module.exports = router;