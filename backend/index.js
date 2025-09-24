import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
dotenv.config()
console.log(process.env.MONGO_URI);
connectDB();


const app = express();
app.use(express.json());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.listen(PORT, () => {
    
    console.log(`Server is running on port:${PORT}`);
});