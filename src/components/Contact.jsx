import React, { useEffect, useState } from 'react'

export default function Contact({listing}) {
  const [landlord, setLandlord] = useState(null)
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        console.log(listing.userRef);
        const res = await fetch(`/api/user/getuser/${listing.userRef}`)
        const data = await res.json()
        setLandlord(data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchLandlord()
  }, [listing.useRef])
  return (
    <div>
      {landlord && (
        <div className="">
          <p>Contact <span>{landlord.username}</span></p>
        </div>
      )
      }
    </div>
  )
}
