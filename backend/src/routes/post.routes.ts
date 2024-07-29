import express from 'express'
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { createOrDeleteLike, createPost, getAllPosts, getPost, getPostsByParent } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create',authenticateUser,createPost);
router.get('/posts',authenticateUser,getAllPosts);
router.get('/:post_id',authenticateUser,getPost);
router.get('/posts/:parent_id',authenticateUser,getPostsByParent);
router.post('/like',authenticateUser,createOrDeleteLike);

export default router;
