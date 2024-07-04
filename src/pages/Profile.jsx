import React, { useRef, useState, useEffect } from 'react';
import {v4} from 'uuid'
import { getDownloadURL, getStorage, list, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { deleteUserFailure, deleteUserSuccess, deleteUserStart, updateUserFailure, updateUserStart, updateUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom'

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [successful, setsuccessful] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [userlistings, setUserListings] = useState([])
  const dispatch = useDispatch();
  console.log(userlistings);
  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);
  const handleFileUpload = () => {
    setFileUploadError(false)
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

  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess())
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  } 
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess())
    } 
    catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if(data.success === false) {
        setShowListingError(true);
        return
      }
      setUserListings(data)
    } catch(error) {
      showListingError(true)
    }
  }
  const handleListDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete${listingId}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (error) {
      console.log(error.message); 
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
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign out</span>
      </div>
      {error && (
        <p className="text-red-700 mt-2">{error}</p>
      )}
      {successful && (
        <p className="text-green-700 mt-2">updated successfully</p>
      )}
      <button onClick={handleShowListings} className='text-green-700 mx-auto  mt-5 block '>Show Listing</button>
      {showListingError && (
        <p className="text-red-700 mt-2">Error showing listing</p>
      )}
      <div className='flex flex-col gap-4 mb-12'>
      {userlistings && userlistings.length > 0 && (
          <div className='flex flex-col gap-4'>
            <h1 className='text-center my-7 mb-4 text-2xl font-bold'>Your Listings</h1>
           {
            userlistings.map((listing) => (
              <div className='border rounded-lg p-3 flex justify-between items-center gap-4' key={listing._id}>
                <Link to={`/listing/${listing._id}`}>
                  <img src={listing.imageUrls[0]} alt={listing.name} className='h-16 w-16 object-contain' />
                </Link>
                <Link className='text-slate-700 font-semibold hover:underline truncate flex-1' to={`/listing/${listing._id}`}>
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col item-center">
                  <button className='text-red-700 uppercase' onClick={() => handleListDelete(listing._id)}> Delete</button>
                  <button className='text-green-700 uppercase'> Edit</button>
                </div>
              </div>
            ))
           }
          </div>
      )
        
      } 
      </div>
    </div>
  );
}