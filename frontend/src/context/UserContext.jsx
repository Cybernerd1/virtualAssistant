import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';
export const userDataContext = createContext()
function UserContext({children}){
    const serverUrl = "http://localhost:3000"
    const [userData,setUserData]=useState(null);

    const handleCurrentUser=async()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true});
            setUserData(result.data);
            console.log(result.data);
        } catch (error) {
            console.error("Error fetching current user:",error);
        }
    }

    useEffect(()=>{
        handleCurrentUser();
    },[])


    const value = {
        serverUrl
    }


    return (
        <div>
            <userDataContext.Provider value={value}>{children}</userDataContext.Provider>
            
        </div>
    )
}

export default UserContext