import React, { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import Home from './pages/Home'

import Customize2 from './pages/Customize2'
import { userDataContext } from './context/UserContext'


const App = () => {
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  console.log(userData?.user)
  if (userData === undefined) {
    return <div>Loading...</div>;
  }

  return (

    <Routes>
      <Route path="/" element={(userData?.user.assistantImage && userData?.user.assistantName) ? <Home /> : <Navigate to={"/customize"} replace />} />

      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to={"/"} replace />} />

      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to={"/"} replace />} />

      <Route path="/customize" element={!userData ? <Navigate to={"/signin"} replace /> : <Customize />} />

      <Route path="/customize2" element={!userData ? <Navigate to={"/signin"} replace /> : <Customize2 />} />

    </Routes>
  )
}

export default App