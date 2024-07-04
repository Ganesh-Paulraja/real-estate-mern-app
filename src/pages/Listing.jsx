import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'

export default function Listing() {
  SwiperCore.use([Navigation])
  const params = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
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
  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}
      {listing && !loading && !error &&
        <div className='max-w-7xl mx-auto'>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div className="" >
                  <img src={url} alt="" className='h-full w-full max-h-[550px]' />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      }
    </main>
  )
}
