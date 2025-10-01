import express from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';
import isAuth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.get("/current",isAuth, getCurrentUser)
userRouter.post("/update",isAuth,upload.single("AssistantImage"), updateAssistant)
export default userRouter;