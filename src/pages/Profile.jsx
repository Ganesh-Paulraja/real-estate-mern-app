import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {v4} from 'uuid'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData);
  
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
      (snampshot) => {
        const progress = (snampshot.bytesTransferred / snampshot.totalBytes) * 100
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

  return (
    <div className='w-full px-4 mx-auto md:w-96'>
      <h1 className='text-3xl font-bold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
          id='username'
        />
        <input
          type="text"
          placeholder='email'
          className='border p-3 rounded-lg outline-none'
          id='email'
        />
        <input
          type="text"
          placeholder='password'
          className='border p-3 rounded-lg outline-none'
          id='password'
        />
        <button className='bg-slate-700 text-white p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      {fileUploadError && (
        <p className="text-red-500 mt-2">Error uploading file. Please try again.</p>
      )}
    </div>
  );
}