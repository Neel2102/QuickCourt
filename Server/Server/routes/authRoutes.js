import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import {userAuth} from '../middlewares/userAuth.js';

const authRouter = express.Router();

// authRouter.get('/register', (req, res) => {
//     res.status(405).json({ success: false, message: 'GET method not supported on /register. Please use POST.' });
// });

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-email', userAuth, verifyEmail);
authRouter.post('/is-authenticated', isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;
