import { useEffect, useState } from "react";
import { where } from "firebase/firestore";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { fetchListings } from "../helpers/utils";

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchListings(where("offer", "==", true), 10)
      .then((data) => {
        setListings(data);
        setIsLoading(false);
      })
      .catch((err) => toast.error("Could not fetch listings, error: " + err));
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {listings && listings.length > 0 ? (
        <main>
          <ul className="categoryListings">
            {listings.map((listing) => (
              <ListingItem
                key={listing.id}
                listingData={listing.data}
                id={listing.id}
              />
            ))}
          </ul>
        </main>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
};

export default Offers;
