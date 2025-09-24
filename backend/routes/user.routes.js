import express from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';
import isAuth from '../middlewares/auth.js';


const userRouter = express.Router();

userRouter.get("/current",isAuth, getCurrentUser)
export default userRouter;