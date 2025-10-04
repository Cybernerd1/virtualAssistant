import React, { useState, useContext } from 'react'
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md"
import { useNavigate } from 'react-router-dom';


const Customize2 = () => {

    let { userData, backendImage, selectedImage, setUserData, serverUrl } = useContext(userDataContext);
    const navigate = useNavigate()

    const [assistantName, setAssistantName] = useState(userData.assistantName || "");

    const [loading, setLoading] = useState(false);
    const handleUpdateAssistant = async () => {
        setLoading(true);
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName);
            if (backendImage) {
                formData.append("assistantImage", backendImage);
            } else {
                formData.append("imageUrl", selectedImage);
            }
            console.log("handle update assistant called");
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
            setLoading(false);
            console.log(result.data);
            setUserData(result.data);
            navigate("/")
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }


    return (
        <div className="w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#030353] flex justify-center items-center flex-col p-4 text-white relative">
            <MdKeyboardBackspace className='text-white w-[30px] h-[30px] cursor-pointer absolute top-[20px] left-[20px]' onClick={() => window.history.back()} />
            <h1 className="text-white mb-[30px] text-[30px]"> Enter your <span className="text-blue-200 ">Assistant Name</span></h1>

            <input type='text' required onChange={(e) => setAssistantName(e.target.value)} value={assistantName} placeholder='Enter Assistant Name' className='max-w-[600px] w-full outline-none h-[60px] border-2 border-white bg-transparent text-white placeholder:-gray-300 px-[20px] rounded-full text-[18px]' />

            {assistantName.length > 0 && <button className="cursor-pointer min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]  " disabled={loading} onClick={() => {
                setLoading(true);
                handleUpdateAssistant()
               
            }}>
                {!loading ? "Get Started" : "Updating..."}
            </button>}

        </div>
    )
}

export default Customize2