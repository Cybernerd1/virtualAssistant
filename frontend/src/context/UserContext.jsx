import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';
export const userDataContext = createContext()
function UserContext({ children }) {
    const serverUrl = "http://localhost:3000"
    const [userData, setUserData] = useState(null);
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
   
    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
            console.log("Current user response:", result.data);
            setUserData(result.data || null);
           
        } catch (error) {
            console.error("Error fetching current user:", error);
            setUserData(null);
        }
    }

    useEffect(() => {
        handleCurrentUser();
    }, [])


    const value = {
        serverUrl, userData, setUserData,selectedImage, setSelectedImage,frontendImage, setFrontendImage,backendImage, setBackendImage
    }


    return (

        <userDataContext.Provider value={value}>{children}</userDataContext.Provider>


    )
}

export default UserContext