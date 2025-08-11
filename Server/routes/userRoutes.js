import express from 'express';
import { userAuth, protectRoute } from '../middlewares/userAuth.js';
import { getUserData, updateProfile, getProfile, updateProfileSimple, uploadProfilePic } from '../controllers/userController.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js'; // Import the middleware

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.put('/update-profile', protectRoute, uploadMiddleware.single('profilePic'), updateProfile);
// Added endpoints aligned with frontend services
userRouter.get('/profile', protectRoute, getProfile);
userRouter.put('/profile', protectRoute, updateProfileSimple);
userRouter.post('/upload-picture', protectRoute, uploadMiddleware.single('profilePic'), uploadProfilePic);

export default userRouter;