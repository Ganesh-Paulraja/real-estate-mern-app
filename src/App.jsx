import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signout from './pages/Signup'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'

export default function App() {
  return (
    <div className='app-wrap'>
     <BrowserRouter>
     <Header/>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/Signin' element={<Signin/>}/>
      <Route path='/Signup' element={<Signout/>}/>
      <Route path='/About' element={<About/>}/>
      <Route path='/Profile' element={<Profile/>}/>
     </Routes>
     </BrowserRouter>
    </div>
  )
}
