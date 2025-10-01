import React, { useState, useContext } from 'react'
import { userDataContext } from '../context/UserContext';
const Customize2 = () => {
    const { userData,backendImage,selectedImage } = useContext(userDataContext);

    const [assistantName, setAssistantName] = useState(userData.assistantName || "");



    return (
        <div className="w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#030353] flex justify-center items-center flex-col p-4 text-white ">
            <h1 className="text-white mb-[30px] text-[30px]"> Enter your <span className="text-blue-200 ">Assistant Name</span></h1>

            <input type='text' required onChange={(e) => setAssistantName(e.target.value)} value={assistantName} placeholder='Enter Assistant Name' className='max-w-[600px] w-full outline-none h-[60px] border-2 border-white bg-transparent text-white placeholder:-gray-300 px-[20px] rounded-full text-[18px]' />

            {assistantName.length > 0 && <button className="cursor-pointer min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]  " onClick={() => navigate("/customize2")}>
                Get Started
            </button>}

        </div>
    )
}

export default Customize2