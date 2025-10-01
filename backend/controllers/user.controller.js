import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: "get current user error" });
  }
};


export const updateAssistant = async (req, res) => {
  try {
    const {assistantName,imageUrl}=req.body
    let assistantImage;

    if(req.files){
      assistantImage =await uploadOnCloudinary(req.files.path);
      
    }else{
      assistantImage=imageUrl;
    }

    const user= await User.findByIdAndUpdate(req.userId,{
      assistantName,
      assistantImage
    },{new:true}).select("-password")
    return res.status(200).json({success:true,user})
  } catch (error) {
    return res.status(400).json({ message: "update assistant error" });
  }
}
