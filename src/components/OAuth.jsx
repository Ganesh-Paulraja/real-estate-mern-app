import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import {signInSucces} from '../redux/user/userSlice'
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)
      
      const result = await signInWithPopup(auth, provider)
      const res = await fetch (import.meta.env.VITE_BACKEND_API + '/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName, 
          email: result.user.email, 
          photo: result.user.photoURL})
      })
      const data = await res.json();
      if(data.email) {
        dispatch(signInSucces(data));
        navigate('/');
      }
    } catch (error) {
      console.log('could not sign in with google:', error);
    }
  }
  return (
    <div>
      <button onClick={handleGoogleClick} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-full' >
        Continue with google
      </button>
    </div>
  )
}
