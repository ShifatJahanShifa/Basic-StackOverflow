const express=require('express')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })
const validateSession = require('../middleware/auth')

const {
    getPosts,
    createPost,
    getSinglePost
} =require('../controllers/postController')
const router=express.Router()

router.get('/post',validateSession,getPosts)

router.post('/post',validateSession,upload.single('codeSnippet'),createPost)

router.get('/post/:id',validateSession,getSinglePost)

module.exports=router