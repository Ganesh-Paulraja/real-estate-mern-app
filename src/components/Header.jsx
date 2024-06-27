import React from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { current } from '@reduxjs/toolkit'

export default function Header() {
  const {currentUser} = useSelector(state => state.user)
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
      <Link to={'/'}>
      <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
        <span className='text-slate-500'>Gg</span>
        <span className='text-slate-700'>Estate</span>
      </h1>
      </Link>
      <form className='bg-slate-100 p-3 rounded-lg flex item-center'>
        <input type="text" placeholder='Search...' className='bg-transparent
        focus:outline-none w-24 sm:w-64'/>
        <FaSearch className='text-slate-600' />
      </form>
      <ul className='flex gap-4'> 
        <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>
          <Link to={'/'}>Home</Link>
        </li>
        <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>
          <Link to={'/About'}>About</Link>
        </li>

        <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>
          <Link to={currentUser ? '/Profile' : '/Signin'}>
            {currentUser ? (<img src={currentUser.avatar} alt="avatar" className='rounded-full h-7 w-7 object-cover' />) : ('Sign in')}
          </Link>
        </li>
      </ul>
      </div>
    </header>
  )
}
