import express from 'express';
import {userAuth,protectRoute} from '../middlewares/userAuth.js';
import {getUserData, updateProfile}  from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.put('/update-profile',protectRoute,updateProfile);

export default userRouter;