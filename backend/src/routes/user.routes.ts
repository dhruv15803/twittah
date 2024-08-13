import express from 'express'
import { getAllUsers, getLoggedInUser, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';

const router = express.Router()


router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/users',getAllUsers);
router.get('/current',authenticateUser,getLoggedInUser);
router.get('/logout',authenticateUser,logoutUser);

export default router;
