import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore from 'swiper'
import {useSelector} from 'react-redux'
import {Navigation} from 'swiper/modules'
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa'
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation])
  const params = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [contact, setContact] = useState(false)
  const currentUser = useSelector((state) => state.user.currentUser)
  console.log(listing);
  useEffect( () => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`)
        const data = await res.json();
        if(data.success === false) {
          setError(true)
          setLoading(false)
          return
        }
        setListing(data)
        setLoading(false)
        setError(false)
      } catch(error) {
        setError(true)
        setLoading(false)
      }
    }
    fetchListing()
  }, [])
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href) 
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 800)
  }
  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}
      {listing && !loading && !error &&
        <div className='max-w-7xl mx-auto relative'>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div className="" >
                  <img src={url} alt="" className='h-full w-full max-h-[550px]' />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute top-[30px] z-10 right-[20px] cursor-pointer border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100" onClick={handleShare}>
            <FaShare className='text-slate-500'/>
          </div>
          {copied && <p className='absolute top-[82px] right-[10px] z-10 rounded-md bg-slate-100 p-1 border'>Link copied!</p>}
          <div className=" flex flex-col max-w-4xl mx-auto p-3 mt-7 gap-4">
            <p className='text-2xl font-semibold'>{listing.name} - ${listing.offer.toLocaleString('en-US') ? listing.discountPrice.toLocaleString('en-US')
 : listing.regularPrice}
 {listing.type === 'rent' && '/month'}
 </p>
 <p className='flex items-center mt-2 gap-2 text-slate-600 my-2 text-sm'>
  <FaMapMarkerAlt className="text-green-700" />
  <span>{listing.address}</span>
 </p>
 <div className='flex gap-4 gap-y-0'>
  <p className='bg-red-900 w-full max-w-[160px] text-white text-center p-1 rounded-md'>
    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
  </p>
  {
    listing.offer && (
      <p className='bg-green-900 w-full max-w-[160px] text-white text-center p-1 rounded-md'>${+listing.regularPrice - +listing.discountPrice} OFF</p>
    )
  }
 
 </div>
 <p className='text-slate-800'><b className='text-black'>Description - </b> {listing.description} </p>
 <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
  <li className='flex items-center gap-1 whitespace-nowrap'>
    <FaBed className='text-lg'/>
    {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`} 
  </li>
  <li className='flex items-center gap-1 whitespace-nowrap'>
    <FaBath className='text-lg'/>
    {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`} 
  </li>
  <li className='flex items-center gap-1 whitespace-nowrap'>
    <FaParking className='text-lg'/>
    {listing.parking > 1 ? `Parking spot` : `No Parking`} 
  </li>
  <li className='flex items-center gap-1 whitespace-nowrap'>
    <FaChair className='text-lg'/>
    {listing.parking > 1 ? `Furnished` : `Unfurnished`} 
  </li>
 </ul>
 {currentUser && listing.userRef !== currentUser._id && !contact && (
   <div className="">
   <button onClick={() => setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 w-full'>Contact Landlord</button>
  </div>
 )}
 {contact && <Contact listing = {listing}/>}
 
          </div>

        </div>
      }
    </main>
  )
}
