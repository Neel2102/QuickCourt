import express from 'express';
import { userAuth, protectRoute } from '../middlewares/userAuth.js';
import { getUserData, updateProfile } from '../controllers/userController.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js'; // Import the middleware

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.put('/update-profile', protectRoute, uploadMiddleware.single('profilePic'), updateProfile);

export default userRouter;