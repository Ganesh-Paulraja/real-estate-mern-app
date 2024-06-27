import React, { useRef, useState, useEffect } from 'react';
import {v4} from 'uuid'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [successful, setsuccessful] = useState(false)
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);
  const handleFileUpload = () => {
    const storage = getStorage(app)
    const fileName = v4() + file.name;
    const storageRef = ref(storage,'userImages/' + fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)
    
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            setFormData({...formData, avatar: downloadURL})
          }
        )
      }
    )
  }
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value});
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setsuccessful(false);
    try {
      console.log('work');
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data));
      setsuccessful(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  return (
    <div className='w-full px-4 mx-auto md:w-96'>
      <h1 className='text-3xl font-bold text-center my-7'>Profile</h1>
      <form onSubmit = {handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          hidden
          ref={fileRef}
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar }
          alt="profile"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-center'>
          {fileUploadError ? 
          (<span className='text-red-700'>please use image less then 2mb</span>) : 
          (filePerc > 0 && filePerc < 100)?
            (<span className='text-slate-700'>Uploading {filePerc}%</span>): 
          (filePerc === 100 )?
            (<span className='text-green-700'>Image successfully uploaded!</span>) :
          ('')  
          }
        </p>
        <input
          type="text"
          placeholder='username'
          className='border p-3 rounded-lg outline-none'
          defaultValue={currentUser.username}
          id='username'
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder='email'
          className='border p-3 rounded-lg outline-none'
          defaultValue={currentUser.email}
          id='email'
          onChange={handleChange}
        />
        {/* <input
          type="password"
          placeholder='password'
          defaultValue={currentUser.password}
          className='border p-3 rounded-lg outline-none'
          id='password'
          onChange={handleChange}
        /> */}
        <button disabled={loading} className='bg-slate-700 text-white p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading? "Loading..." : 'Update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      {fileUploadError && (
        <p className="text-red-700 mt-2">Error uploading file. Please try again.</p>
      )}
      {error && (
        <p className="text-red-700 mt-2">{error}</p>
      )}
      {successful && (
        <p className="text-green-700 mt-2">updated successfully</p>
      )}
    </div>
  );
}