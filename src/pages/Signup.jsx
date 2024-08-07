import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function Signout() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData( {
      ...formData,
      [e.target.id] : e.target.value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_API + '/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        const data = await res.json();
        if(data.success === false) {
          setError(data.message);
          setLoading(false);
          return
        }
        setLoading(false);
        setError(null);
        console.log('work');
        navigate('/Signin')
    } catch(error) {
      setLoading(false);
      setError(error.message);
    }
  }
  console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1  className='text-3xl text-center font-semibold my-7'>
      Sign Up
      </h1>
      <form onSubmit={handleSubmit}  className='flex flex-col gap-4 mb-3'>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} />
        <input type="text" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="text" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled = {loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{ loading ? 'Loading...':'Sign Up'} </button>
      </form>
      <OAuth/>
      <div className="flex gap-2 mt-3">
        <p>Have an account?</p>
        <Link to={"/Signin"}>
         <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p> }
    </div>
  )
}
