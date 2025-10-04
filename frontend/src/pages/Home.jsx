import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../../public/assets/ai.gif"
import userImg from "../../public/assets/user.gif"
import { IoMenu } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx"

const Home = () => {
  const {
    userData,
    serverUrl,
    setUserData,
    getGeminiResponse,
    loading,
    error,
  } = useContext(userDataContext);
  const navigate = useNavigate();

  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;
  const [ham, setHam] = useState(false);
  const isMountedRef = useRef(true);

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#030353] flex justify-center items-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#030353] flex justify-center items-center">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#030353] flex justify-center items-center">
        <p className="text-white text-xl">No user data available</p>
      </div>
    );
  }

  const startRecognition = () => {
    if (!recognitionRef.current || isRecognizingRef.current || isSpeakingRef.current) {
      return;
    }

    try {
      recognitionRef.current.start();
      isRecognizingRef.current = true;
      setListening(true);
      console.log("Recognition started");
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Error starting recognition:", error);
      }
      isRecognizingRef.current = false;
    }
  }

  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = "en-US";

    // Wait for voices to load
    const setVoice = () => {
      const voices = synth.getVoices();
      // You can choose Hindi voice if needed
      // const hindiVoice = voices.find(voice => voice.lang === "hi-IN");
      // if (hindiVoice) {
      //   utterence.voice = hindiVoice;
      //   utterence.lang = "hi-IN";
      // }
    };

    if (synth.getVoices().length > 0) {
      setVoice();
    } else {
      synth.onvoiceschanged = setVoice;
    }

    isSpeakingRef.current = true;

    utterence.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      console.log("Speech ended, restarting recognition");

      // Restart recognition after speech ends
      setTimeout(() => {
        if (isMountedRef.current) {
          startRecognition();
        }
      }, 800);
    };

    utterence.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      isSpeakingRef.current = false;
      setAiText("");
    };

    synth.cancel(); // Cancel any ongoing speech
    synth.speak(utterence);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "youtube_search") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }

    if (type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }

    if (type === "calculator_open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    }

    if (type === "instagram_open") {
      window.open("https://www.instagram.com", "_blank");
    }

    if (type === "facebook_open") {
      window.open("https://www.facebook.com", "_blank");
    }

    if (type === "weather-show") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;
    isMountedRef.current = true;

    // Initial start with delay
    const startTimeout = setTimeout(() => {
      if (isMountedRef.current && !isSpeakingRef.current && !isRecognizingRef.current) {
        startRecognition();
      }
    }, 1000);

    recognition.onstart = () => {
      console.log("Speech recognition started");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      isRecognizingRef.current = false;
      setListening(false);

      if (isMountedRef.current && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMountedRef.current && !isSpeakingRef.current) {
            startRecognition();
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        console.error("Permission to use microphone is denied.");
        return;
      }

      // Restart after error (except if aborted)
      if (event.error !== "aborted" && isMountedRef.current && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMountedRef.current && !isSpeakingRef.current) {
            startRecognition();
          }
        }, 2000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Recognized text:", transcript);
      setUserText(transcript);

      // Stop recognition to process the command
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);

      // Check if the transcript contains the assistant name
      if (transcript.toLowerCase().includes(userData?.user.assistantName.toLowerCase())) {
        try {
          setAiText("Processing...");
          const data = await getGeminiResponse(transcript);
          setUserText("");
          setAiText(data.response);
          console.log(data);
          speak(data.response);
          handleCommand(data);
        } catch (error) {
          console.error("Error getting Gemini response:", error);
          setAiText("");
          setUserText("");
          // Restart recognition after error
          setTimeout(() => {
            if (isMountedRef.current) {
              startRecognition();
            }
          }, 1000);
        }
      } else {
        // If assistant name not mentioned, clear text and restart
        setTimeout(() => {
          setUserText("");
          if (isMountedRef.current) {
            startRecognition();
          }
        }, 2000);
      }
    };

    // Fallback interval to ensure recognition is running
    const fallbackInterval = setInterval(() => {
      if (isMountedRef.current && !isRecognizingRef.current && !isSpeakingRef.current) {
        console.log("Fallback: Restarting recognition");
        startRecognition();
      }
    }, 10000);


    window.speechSynthesis.onvoiceschanged = () => {
      const greetng = new SpeechSynthesisUtterance(`Hello ${userData?.user.userName}, how can I help you today?`);
      greetng.lang = "hi-IN";
      greeting.onend = () => {
        startTimeout();
      }
      IoLogoWindows.speechSynthesis.speak(greetng);
    }



    // Cleanup
    return () => {
      isMountedRef.current = false;
      clearTimeout(startTimeout);
      clearInterval(fallbackInterval);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log("Error stopping recognition:", error);
        }
      }

      isRecognizingRef.current = false;
      setListening(false);
      synth.cancel();
    };
  }, [userData?.user.assistantName, getGeminiResponse]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#030353] flex justify-center items-center flex-col gap-[20px] relative overflow-hidden">
      <IoMenu
        className={`lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer z-50`}
        onClick={() => setHam(true)}
      />

      {/* Mobile Menu */}
      <div className={`absolute top-0 left-0 w-full h-full bg-[#00000053] backdrop-blur-lg ${ham ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 z-40 flex flex-col items-center justify-start pt-20 gap-5`}>
        <RxCross1
          className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer"
          onClick={() => setHam(false)}
        />

        <button
          className="min-w-auto cursor-pointer h-auto px-6 py-2 bg-white rounded-full font-semibold text-black"
          onClick={() => {
            setHam(false);
            navigate("/customize");
          }}
        >
          Customize
        </button>

        <button
          className="min-w-auto cursor-pointer h-auto px-6 py-2 bg-white rounded-full font-semibold text-black"
          onClick={handleLogout}
        >
          Log Out
        </button>

        <div className="w-[90%] max-h-[400px] overflow-y-auto bg-[#ffffff1a] rounded-lg p-4 mt-5">
          <h1 className="text-white font-semibold text-[19px] mb-3">History</h1>

          <div className="flex flex-col gap-2">
            {userData?.user.history && userData.user.history.length > 0 ? (
              userData.user.history.map((his, index) => (
                <span key={index} className="text-gray-200 text-[16px] truncate">
                  {his}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-[14px]">No history yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex flex-row gap-5 right-5 mt-[30px] top-[20px] absolute">
        <button
          className="min-w-auto cursor-pointer h-auto px-6 py-2 bg-white rounded-full font-semibold text-black"
          onClick={() => {
            navigate("/customize");
          }}
        >
          Customize
        </button>

        <button
          className="min-w-auto cursor-pointer h-auto px-6 py-2 bg-white rounded-full font-semibold text-black"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>

      {/* Assistant Image */}
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl">
        <img
          src={userData?.user.assistantImage}
          alt="Assistant Image"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(
              "Image failed to load:",
              userData?.user.assistantImage
            );
            e.target.src = "/placeholder-image.jpg";
            e.target.style.display = "none";
          }}
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">{`I'm ${userData?.user.assistantName}`}</h1>

      {/* Status Indicators - Show GIFs */}
      {!aiText && (
        <img className="max-h-[300px] h-[100px] w-[120px] max-w-[300px]" src={userImg} alt="User speaking" />
      )}
      {aiText && (
        <img className="max-h-[300px] h-[100px] w-[120px] max-w-[300px]" src={aiImg} alt="AI speaking" />
      )}

      {/* Text Display */}
      {(userText || aiText) && (
        <h1 className="text-white text-[18px] font-semibold text-wrap text-center max-w-[90%] px-4">
          {userText || aiText}
        </h1>
      )}

      {/* Listening Indicator */}
      <div className="absolute bottom-10">
        {listening ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-white text-sm">Listening...</p>
          </div>
        ) : isSpeakingRef.current ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-white text-sm">Speaking...</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <p className="text-gray-400 text-sm">Idle</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;