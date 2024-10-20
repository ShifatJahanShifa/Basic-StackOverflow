const express=require('express')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

const {
    getPosts,
    createPost
} =require('../controllers/postController')
const router=express.Router()

router.get('/post',getPosts)

router.post('/post',upload.single('codeSnippet'),createPost)

module.exports=router