import React from 'react'
import {Link} from 'react-router-dom'
import { FaMapMarkerAlt } from 'react-icons/fa'
// install tailwind lineclamp for truncate description

export default function ListingItem({listing}) {
  return (
    <div className='list-item bg-white shadow-md hover:shadow-lg overflow-hidden rounded-lg w-full sm:w-[300px]'>
      <Link to={`/listing/${listing._id}`}>
        <div className="">
        <img src={listing.imageUrls[0]} alt="listing cover" 
        className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300' />
        </div>
        <div className="p-3 flex flex-col gap-2 w-full">
          <p  className='text-lg font-semibold text-slate-700'>{listing.name}</p>
        </div>
        <div className="flex item-center gap-1 px-3 pb-3">
        <FaMapMarkerAlt className="text-green-700  w-4 h-4" />
        <p className='text-sm text-gray-600 truncate'>{listing.address}</p>
        </div>
       <div className="px-3">
       <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
       </div>
       <p className='px-3 text-slate-500 my-2'>
       ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
       <span className='text-sm'>{listing.type === 'rent' && ' /month'}</span>
       </p>
       <div className="px-3 text-slate-700 flex gap-4 mb-4">
        <div className="font-bold text-xs">
          {listing.bedrooms > 1 ? `${listing.bedrooms} beds `: 
           `${listing.bedrooms} bed `} 
        </div>
        <div className="font-bold text-xs">
          {listing.bathrooms > 1 ? `${listing.bathrooms} baths `: 
           `${listing.bathrooms} bath `} 
        </div>
       </div>
      </Link>
    </div>
  )
}
