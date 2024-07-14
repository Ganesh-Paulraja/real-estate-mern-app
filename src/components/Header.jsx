import React, {useEffect, useState} from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Header() {
  const {currentUser} = useSelector(state => state.user)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    console.log(searchTerm);
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [])
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-7xl mx-auto p-3'>
      <Link to={'/'}>
      <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
        <span className='text-slate-500'>Gg</span>
        <span className='text-slate-700'>Estate</span>
      </h1>
      </Link>
      <form onSubmit={(e) => handleSubmit(e)} className='bg-slate-100 p-3 rounded-lg flex item-center'>
        <input type="text" placeholder='Search...' className='bg-transparent
        focus:outline-none w-24 sm:w-64' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value) } 
        />
        <button><FaSearch className='text-slate-600' /></button>
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
