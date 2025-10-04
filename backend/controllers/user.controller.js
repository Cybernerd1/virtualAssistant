import User from "../models/user.model.js";
import moment from "moment/moment.js";

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
        assistantImage: user.assistantImage,
        assistantName: user.assistantName,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: "get current user error" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.files) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(400).json({ message: "update assistant error" });
  }
};

export const askAssistant = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;

    const { command } = req.body;
    user.history.push(command);
    await user.save();
    let result = await geminiResponse(command, assistantName, userName);
    // res.json(result)
    if (typeof result !== "string") {
      return res.status(400).json({ message: "Invalid response from AI" });
    }
    const jsonMatch = result.match(/{[\s\s]*}/);

    if (!jsonMatch) {
      return res.status(400).json({
        message: "Sorry, I couldn't process your request. Please try again.",
      });
    }

    const gemResult = JSON.parse(jsonMatch[0]);

    const type = gemResult.type;
    switch (type) {
      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });
        break;

      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("DD-MM-YYYY")}`,
        });
        break;

      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
        break;

      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current month is ${moment().format("MMMM")}`,
        });
        break;
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res.status(500).json({
          // type: "general",
          // userInput: gemResult.userInput,
          response: "Sorry, I couldn't process your request. Please try again.",
        });
        break;
    }

    // return res.status(200).json({ success: true, gemResult });
  } catch (error) {
    return res.status(400).json({ message: "ask assistant error" });
  }
};
