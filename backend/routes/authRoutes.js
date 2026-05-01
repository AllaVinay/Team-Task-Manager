import express from 'express';
import { signupUser, loginUser, getUsers } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
// Placed users list here for simplicity, though it could be in a separate userRoutes
router.get('/users', protect, admin, getUsers);

export default router;
