import React, { useState } from 'react'
import bg from '../assets/authBg.png'
import { Eye,EyeOff  } from 'lucide-react';

const SignUp = () => {
  const [showPassword,setShowPassword]=useState(false)
  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
      <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000037] backdrop-blur-md shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-[20px] px-[20px]'>
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to <span className='text-blue-400'> Virtual Assistant</span> </h1>
        <input type='text' placeholder='Enter Your Name' className='w-full outline-none h-[60px] border-2 border-white bg-transparent text-white placeholder:-gray-300 px-[20px] rounded-full text-[18px]' />
        <input type='text' placeholder='Enter Your Email' className='w-full outline-none h-[60px] border-2 border-white bg-transparent text-white placeholder:-gray-300 px-[20px] rounded-full text-[18px]' />
        <div className='border-2 border-white bg-transparent w-full rounded-full text-[18px] relative'>
          <input type={showPassword?"text":"password"} placeholder='Enter Your Password' className='w-full outline-none h-[60px] text-white placeholder:-gray-300 px-[20px] ' />
          <Eye onClick={()=>{setShowPassword()}} className='absolute top-[20px] right-[20px] text-white '/>

        </div>

      </form>
    </div>
  )
}

export default SignUp