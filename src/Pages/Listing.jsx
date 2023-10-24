import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_BASE_URL;
import { Swiper, SwiperSlide } from 'swiper/react';
import swiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
function Listing() {
    swiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing]
        = useState(null)
    const [loading, setLoading] = useState(false);
    const [error,setError]=useState(false)
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true)
                  const res = await fetch(
                    `${apiUrl}/api/listing/get/${params.id}`
                  );

                const data = await res.json();
                console.log(data)
                if (data.status == 200) {
                    setLoading(false)
                    setListing(data.listing)
                } else {
                    setLoading(false)
                    setError(true)
                }
                // setListing(data.listing)
            } catch (error) {

                setError(true)
                setLoading(false)
            }
            
      
        }
        
              fetchListing();
},[])

    console.log(listing)

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl"></p>}
      {error && <p className="text-center my-7 text-2xl"></p>}
      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
                  </Swiper>
                  

                  
        </>
      )}
    </main>
  );
}

export default Listing