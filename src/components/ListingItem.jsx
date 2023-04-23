import React from "react";
import { ReactComponent as DeleteIcon } from "../assets//svg/deleteIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
import { Link } from "react-router-dom";

const ListingItem = ({ listingData, id, handleDelete }) => {
  return (
    <ul className="categoryListing">
      <Link
        to={`/category/${listingData.type}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={listingData.imageUrls[0]}
          alt={listingData.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listingData.location}</p>
          <p className="categoryListingName">{listingData.name}</p>
          <p className="categoryListingPrice">
            {listingData.offer
              ? listingData.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listingData.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listingData.type === "rent" && " / Month"}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="bed" />
            <p className="categoryListingInfoText">
              {listingData.bedrooms > 1
                ? `${listingData.bedrooms} Bedrooms`
                : "1 Bedroom"}
            </p>
            <img src={bathtubIcon} alt="bathtub" />
            <p className="categoryListingInfoText">
              {listingData.bathrooms > 1
                ? `${listingData.bathrooms} Bathrooms`
                : "1 Bathroom"}
            </p>
          </div>
        </div>
      </Link>

      {handleDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231, 76, 60)"
          onClick={() => handleDelete(listingData.id, listingData.name)}
        />
      )}
    </ul>
  );
};

export default ListingItem;
