import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  })
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState([])
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    const typeFromUrl = urlParams.get('type')
    const parkingFromUrl = urlParams.get('parking')
    const furnishedFromUrl = urlParams.get('furnished')
    const offerFromUrl = urlParams.get('offer')
    const sortFromUrl = urlParams.get('sort')
    const orderFromUrl = urlParams.get('order') 

    if(searchTermFromUrl || 
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl 
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      })
    }
    const fetchListing = async () => {
      setLoading(true)
      const searchQuery = urlParams.toString()
      console.log(searchQuery);
      const res = await fetch(import.meta.env.VITE_BACKEND_API + `/api/listing/getList?${searchQuery}`)
      const data = await res.json();
      if(data.length > 7) {
        setShowMore(true);
      } else {
        setShowMore(false) // after refresh
      }
      setListing(data);
      setLoading(false)
    }
    fetchListing();
  }, [location.search])
  const handleChange = (e) => {
    const eventTarget = e.target.id;
    if(eventTarget === 'all'|| eventTarget === 'rent' || eventTarget === 'sale') {
      setSidebardata({...sidebardata, type: eventTarget})
    };

    if(eventTarget === 'searchTerm') {
      setSidebardata({...sidebardata, searchTerm: e.target.value})
    }

    if (eventTarget === 'parking' || eventTarget === 'furnished' || eventTarget === 'offer') {
        setSidebardata({...sidebardata, [e.target.id]: e.target.checked === true ? true : false,
      })
    }
    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({...sidebardata, sort, order});
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    urlParams.set('searchTerm', sidebardata.searchTerm)
    urlParams.set('type', sidebardata.type)
    urlParams.set('parking', sidebardata.parking)
    urlParams.set('furnished', sidebardata.furnished)
    urlParams.set('offer', sidebardata.offer)
    urlParams.set('sort', sidebardata.sort)
    urlParams.set('order', sidebardata.order)
    const SearchQuery = urlParams.toString()
    navigate(`/search?${SearchQuery}`)
  }

  const handleShwMore = async () => {
    const numberOfListings = listing.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    const searchQuery = urlParams.toString();
    console.log(searchQuery);
    const res = await fetch(import.meta.env.VITE_BACKEND_API + `/api/listing/getList?${searchQuery}`)
    const data = await res.json();
    if (data.length < 8) {
      setShowMore(false);
    }
    setListing([...listing, ...data])
  }
  return (
    <div className='mx-auto flex flex-col md:flex-row md:min-h-screen max-w-7xl'>
      <div className="p-7 border-b-2 sm:border-r-2">
<form className='flex flex-col gap-8' onSubmit={handleSubmit}>
<div className="flex items-center gap-2">
  <label className="font-semibold w-[165px]">
    Search Term:
  </label>
  <input type="text" id='searchTerm' placeholder='Search...' className='border rounded-lg p-3 w-full' 
 value={sidebardata.searchTerm} onChange={handleChange}
  />
</div>
<div className="flex gap-2 flex-wrap items-center">
  <label className="font-semibold">
    Type:
  </label>
  <div className="flex gap-2">
    <input type="checkbox" id='all' className='w-5'
    onChange={handleChange}
    
    checked={sidebardata.type === 'all'}
    />
    <span>Rent & Sale</span>
  </div>
  <div className="flex gap-2">
    <input type="checkbox" id='rent' className='w-5' 
    onChange={handleChange}
    checked={sidebardata.type === 'rent'}
    />
    <span>Rent</span>
  </div>
  <div className="flex gap-2">
    <input type="checkbox" id='sale' className='w-5' 
    onChange={handleChange}
    checked={sidebardata.type === 'sale'}
    />
    <span>Sale</span>
  </div>
  <div className="flex gap-2">
    <input type="checkbox" id='offer' className='w-5' 
    onChange={handleChange}
    checked={sidebardata.offer}
    />
    <span>Offer</span>
  </div>
</div>
<div className="flex gap-2 flex-wrap items-center">
  <label className="font-semibold">
    Amenities:
  </label>
  <div className="flex gap-2">
    <input type="checkbox" id='parking' className='w-5' 
    onChange={handleChange}
    checked={sidebardata.parking}
    />
    <span>Parking</span>
  </div>
  <div className="flex gap-2">
    <input type="checkbox" id='furnished' className='w-5' 
    onChange={handleChange}
    checked={sidebardata.furnished}
    />
    <span>Furnished</span>
  </div>
</div>
<div className="flex items-center gap-2">
  <label className="font-semibold">Sort:</label>
  <select name="price" id="sort_order" className='border rounded-lg p-3'
  onChange={handleChange}
  defaultValue={'create_at_desc'}  // descending order
  >
    <option value="regularPrice_desc">Price high to low</option>
    <option value="regularPrice_asc">Price low to high</option>
    <option value="createdAt_desc">Latest</option>
    <option value="createdAt_asc">Oldest</option>
  </select>
</div>
<button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 md:mt-5'>Listing results:</h1>
        <div className="p-7 flex flex-wrap gap-4 overflow-scroll overflow-x-hidden" style={{maxHeight: 'calc(100vh - 150px)'}}>
          {!loading && listing.length === 0 && (
            <p className='text-xl te-slate-700'>No listing found!</p>
          )}
          {loading && (
            <div className="text-xl text-slate-700 text-center w-full">Loading...</div>
          )}
          {!loading && listing.length > 0 && listing.map((listing) => (
            <ListingItem key={listing._id} listing={listing}/>
          ))}

        </div>
        <div className="">
        {showMore && (
            <button onClick={handleShwMore}  className='text-green-700 hover:underline p-7'>
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
