import express from 'express';
import { getAllUsers, getLoggedInUser, loginUser, registerUser } from '../controllers/user.controller.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);
router.get('/current', authenticateUser, getLoggedInUser);
export default router;
