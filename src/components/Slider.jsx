import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { useNavigate } from "react-router-dom";
import { db } from "../misc/firebase";
import Spinner from "./Spinner";

const Slider = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");

      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      const modListing = [];

      querySnap.forEach((doc) => {
        modListing.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(modListing);
      setIsLoading(false);
    };

    fetchListings();
  }, []);

  if (isLoading) return <Spinner />;

  const handleDragStart = (e) => e.preventDefault();

  const imgItems = listings.map((listing, id) => (
    <div key={id}>
      <img
        key={id}
        src={listing.data.imageUrls[id]}
        style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
        onDragStart={handleDragStart}
        role="presentation"
        alt=""
      />
      <p
        className="swiperSlideText"
        onClick={() => navigate(`/category/${listing.data.type}/${listing.id}`)}
        style={{ cursor: "pointer" }}
      >
        {listing.data.name}
      </p>
      <p className="swiperSlidePrice">
        {listing.data.discountedPrice ?? listing.data.regularPrice}
        {listing.data.type === "rent" && "/ month"}
      </p>
    </div>
  ));

  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>
        <AliceCarousel
          mouseTracking
          items={imgItems}
          autoPlay
          disableButtonsControls
          disableDotsControls
          keyboardNavigation
        />
      </>
    )
  );
};

export default Slider;
