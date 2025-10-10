# 🧠 Virtual Assistant

An AI-powered full-stack virtual assistant that listens, understands, and responds to your voice commands.  
Built with **React (Vite)** and **Node.js**, this assistant uses **Google Gemini** for natural language understanding, enabling tasks like voice-based web searches, time/date queries, and smart interactions.

---

## ✨ Features

- 🎙️ **Voice Interaction:** Talk to your assistant using speech-to-text and receive spoken replies (text-to-speech).  
- 🤖 **AI Command Parsing:** Gemini (`gemini-2.5-flash`) intelligently interprets commands like “What’s the time?” or “Search YouTube for lo-fi music.”  
- 🔐 **User Authentication:** Secure login and signup with JWT, bcryptjs, and cookies.  
- 🧑‍🎨 **Customizable Assistant:** Upload your own image and set a name for your virtual assistant.  
- ☁️ **Cloud Storage:** Assistant avatars are uploaded and stored using Cloudinary.  
- ⏰ **Automated Actions:** Get the time, date, and more using moment.js; open YouTube, Google, Instagram, or Facebook directly.  
- 🧾 **Command History:** Your previous commands are stored in MongoDB for easy tracking.

---

## 💻 Tech Stack

| Layer | Technology |
| :-- | :-- |
| **Frontend** | React (Vite), Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB / Mongoose |
| **AI Engine** | Gemini API (`@google/genai`) |
| **Auth** | JWT, bcryptjs, cookie-parser |
| **Storage** | Cloudinary, multer |
| **Utilities** | moment.js, Web Speech API |


## Deployed link : https://virtualassistant-2-qwhp.onrender.com/
