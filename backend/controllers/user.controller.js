import User from '../models/user.model.js';



export const getCurrentUser = async (req,res)=>{
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const user= await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message:"User not found"});
        } 
    } catch (error) {
        return res.status(400).json({message:"get current user error"});
    }
}