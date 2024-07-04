//npm install @reduxjs/toolkit react-redux

import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'

export default function App() {
  return (
    <div className='app-wrap'>
     <BrowserRouter>
     <Header/>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/Signin' element={<Signin/>}/>
      <Route path='/Signup' element={<Signup/>}/>
      <Route path='/About' element={<About/>}/>
      <Route path='/listing/:listingId' element={<Listing/>}/>
      <Route  element={<PrivateRoute/>}>
        <Route path='/Profile' element={<Profile/>}/>
        <Route path='/create-listing' element={<CreateListing/>}/>
        <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>
      </Route>
     </Routes>
     </BrowserRouter>
    </div>
  )
}
