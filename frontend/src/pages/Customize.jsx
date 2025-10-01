import React from "react";
import Card from "../component/Card";
import { useState, useRef, useContext } from "react";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image7 from "../assets/image7.jpeg";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
const Customize = () => {
  const navigate = useNavigate();
  const {
    serverUrl,
    userData,
    setUserData,
    selectedImage,
    setSelectedImage,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
  } = useContext(userDataContext);
  const inputImage = useRef(null);
  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFrontendImage(reader.result);
      setBackendImage(file);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#030353] flex justify-center items-center flex-col p-4 ">
      <h1 className="text-white mb-[30px] text-[30px]">
        Select your <span className="text-blue-200 ">Assistant Image</span>
      </h1>
      <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px] ">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image7} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <div
          className={`w-[80px] h-[160px]  lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950":null}`}
          onClick={() => {inputImage.current.click()
            setSelectedImage("input")
          }}
        >
          {!frontendImage && (
            <RiImageAddLine className="text-white w-[25px] h-[25px]" />
          )}
          {frontendImage && (
            <img
              src={frontendImage}
              alt="custom"
              className="w-full h-full object-cover rounded-2xl"
            />
          )}
          <input
            type="file"
            accept="image/*"
            hidden
            ref={inputImage}
            onChange={handleImage}
          />
        </div>
      </div>
      {selectedImage && <button className="cursor-pointer min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]  " onClick={()=>navigate("/customize2")}>
        Next
      </button>}
      
    </div>
  );
};

export default Customize;
