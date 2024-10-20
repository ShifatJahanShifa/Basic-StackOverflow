const express=require('express')
const router=express.Router()

// Import the individual route files
const postRoutes = require('./post');
const notificationRoutes = require('./notification');
const authRoutes = require('./auth');

router.use('/',postRoutes)
router.use('/',notificationRoutes)
// router.use('/',authRoutes)

module.exports=router;