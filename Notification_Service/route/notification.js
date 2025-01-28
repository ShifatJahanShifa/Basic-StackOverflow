const express = require('express');
const router = express.Router();
const { createNotification, getNotifications, getSingleNotification, updateNotification } = require('../controllers/notificationController');
const validateSession = require('../middleware/auth');

router.post('/notification', validateSession, createNotification);
router.get('/notification',validateSession,getNotifications)
// router.get('/notification/:id',validateSession,getSingleNotification)
router.get('/notification/:id',validateSession,updateNotification)



module.exports = router;