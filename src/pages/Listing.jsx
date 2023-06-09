import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import AliceCarousel from "react-alice-carousel";
import { getDocument } from "../helpers/utils";
import { toast } from "react-toastify";

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sharedLinkCopied, setSharedLinkCopied] = useState(null);

  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    getDocument("listings", params.listingId)
      .then((data) => {
        if (data) {
          setListing(data);
          setIsLoading(false);
        } else toast.error("Could not get listing data");
      })
      .catch((err) => console.log(err));
  }, [params.listingId]);

  const handleShareIconClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setSharedLinkCopied(true);
    setTimeout(() => {
      setSharedLinkCopied(false);
    }, 2000);
  };

  if (isLoading) return <Spinner />;

  const handleDragStart = (e) => e.preventDefault();

  const imgItems = listing.imageUrls.map((url, id) => (
    <img
      key={id}
      src={listing.imageUrls[id]}
      style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
      onDragStart={handleDragStart}
      role="presentation"
      alt=""
    />
  ));

  return (
    <main>
      <AliceCarousel
        mouseTracking
        items={imgItems}
        disableButtonsControls
        disableDotsControls
        keyboardNavigation
      />
      <div className="shareIconDiv" onClick={handleShareIconClick}>
        <img src={shareIcon} alt="share icon" />
      </div>

      {sharedLinkCopied && <p className="linkCopied">Link Copied!</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.address}</p>
        <p className="listingType">
          For {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}

        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : "1 Bedroom"}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : "1 Bathroom"}
          </li>
          <li>{listing.parking && "Parking Spot"}</li>
          <li>{listing.furnished && "Furnished"}</li>
        </ul>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
