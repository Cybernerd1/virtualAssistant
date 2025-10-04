import React, { useState } from 'react'
import { useContext } from 'react';
import bg from '../../public/assets/authBg.png'
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from "react-router-dom"
import { userDataContext } from '../context/UserContext';
import Home from './Home';
import axios from "axios";
const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { serverUrl, userData, setUserData } = useContext(userDataContext)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result = await axios.post(`${serverUrl}/api/auth/login`, { email, password }, { withCredentials: true })
      setUserData(result.data);
      // console.log(result)
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      setUserData(null);
      setError(error.response.data.message);
      setLoading(false);
    }
  }
  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
      <form onSubmit={handleSignIn} className='w-[90%] h-[600px] max-w-[500px] bg-[#00000037] backdrop-blur-md shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-[20px] px-[20px]'>
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to <span className='text-blue-400'> Virtual Assistant</span> </h1>

        <input type='text' placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} value={email} className='w-full outline-none h-[60px] border-2 border-white bg-transparent text-white placeholder:-gray-300 px-[20px] rounded-full text-[18px]' />
        <div className='border-2 border-white bg-transparent w-full rounded-full text-[18px] relative'>
          <input type={showPassword ? "text" : "password"} onChange={(e) => { setPassword(e.target.value) }} value={password} placeholder='Enter Your Password' className='w-full outline-none rounded-full h-[60px] text-white placeholder:-gray-300 px-[20px] ' />
          {!showPassword && <Eye onClick={() => { setShowPassword(true) }} className='absolute top-[20px] right-[20px] text-white cursor-pointer' />}
          {showPassword && <EyeOff onClick={() => { setShowPassword(false) }} className='absolute top-[20px] right-[20px] text-white cursor-pointer' />}

        </div>
        {error.length > 0 && <p className='text-red-500 text-xl'>
          *{error} </p>}
        <button className='min-w-[150px] h-[60px] bg-white rounded-full font-semibold text-black mt-[30px]' disabled={loading}>{loading ? "signing in" : "Sign In"}</button>

        <p className='text-white text-[18px] '>Want to create a new account?<span onClick={() => navigate('/signup')} className='text-blue-400 cursor-pointer'>Sign Up</span></p>
      </form>
    </div>
  )
}

export default SignIn