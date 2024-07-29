import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import ListingItem from '../components/ListingItem';

export default function Home() {
  SwiperCore.use([Navigation])
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  const Url = import.meta.env.VITE_BACKEND_API
  console.log(import.meta.env.VITE_BACKEND_API);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`${Url}/api/listing/getList?offer=true&limit=4&startIndex=5`);
        const data = await res.json()
        setOfferListings(data)
        fetchRentListing()
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListing = async () => {
      try {
        const res = await fetch('/api/listing/getList?type=rent&limit=4');
        const data = await res.json()
        setRentListings(data)
        fetchSaleListing()
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSaleListing = async () => {
      try {
        const res = await fetch('/api/listing/getList?type=sale&limit=4');
        const data = await res.json()
        setSaleListings(data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings()
  }, [])
  return (
    <div className='max-w-7xl mx-auto mb-12'>
    <div className='flex flex-col gap-4 py-12 lg:py-16 px-3 max-w-6xl mx-auto lg:pb-12'>
      <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
        Find Your Next <span className='text-slate-500'>Perfect</span> <br />
        Place With Ease
      </h1>
      <div className='text-slate-600'>
        GG Estate is the best place to find your next perfect place to live. <br />
        We have a wide range of properties for you to choose from.
      </div>
      <div className="">
      <Link to={'/search'} className='text-xl sm:text-xl text-blue-800 font bold hover:underline font-semibold'> Let's Start Now... </Link>
      </div>
    </div>
    {/* Swiper */}

    <Swiper navigation>
    {
      offerListings && offerListings.length > 0 && 
      offerListings.map((listings) => (
          <SwiperSlide key={listings._id}>
            <div className="h-[500px] " 
                style={{ 
                  backgroundImage: `url(${listings.imageUrls[0]})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', }}>
              </div>
            </SwiperSlide>
      ))
    }
      
    </Swiper>
    <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 home-swipe">
      {
        rentListings && rentListings.length > 0 && (
          <div className="mt-6">
            <div className="">
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Places For Rent</h2>
              <Link className='text-sm text-blue-800 hover:underline font-semibold' to={'/search?searchTerm=&type=rent&parking=false&furnished=false&offer=false&sort=createdAt&order=desc'}>
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mx-auto w-fit pt-2">
              {
                rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))
              }
            </div>
          </div>
        )
      }
     </div>
     <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 home-swipe">
      {
        saleListings && saleListings.length > 0 && (
          <div className="mt-6">
            <div className="">
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Places For Sale</h2>
              <Link className='text-sm text-blue-800 hover:underline font-semibold' to={'/search?searchTerm=&type=sale&parking=false&furnished=false&offer=false&sort=createdAt&order=desc'}>
              Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mx-auto w-fit pt-2">
              {
                saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))
              }
            </div>
          </div>
        )
      }
     </div>
     <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 home-swipe">
      {
        offerListings && offerListings.length > 0 && (
          <div className="mt-6">
            <div className="">
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline font-semibold' to={'/search?searchTerm=&type=all&parking=false&furnished=false&offer=true&sort=createdAt&order=desc'}>
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mx-auto w-fit pt-2">
              {
                offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))
              }
            </div>
          </div>
        )
      }
     </div>
    </div>
  )
}