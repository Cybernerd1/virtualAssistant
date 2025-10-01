import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import express from "express";
const app = express();
app.use(cookieParser());

const isAuth=async (req,res,next)=>{
    try {
        const token = req.cookies?.token;
        console.log("Token from cookie:", req.cookies.token);

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        const verifyToken = jwt.verify(token,process.env.JWT_SECRET); 
        req.userId= verifyToken.userId;

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Authentication Error' });
    }
}

export default isAuth;