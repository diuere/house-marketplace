import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { fetchListings } from "../helpers/utils";

const Slider = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings(null, 5).then((data) => {
      setListings(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <Spinner />;

  if (listings.length > 0) return <></>;

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
