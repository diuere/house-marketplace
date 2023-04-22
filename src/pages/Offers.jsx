import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../misc/firebase";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // get reference
        const listingsRef = collection(db, "listings");

        // creating a query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        // executing the query
        const querySnap = await getDocs(q);

        // organizing data
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setIsLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings");
        // console.log(error)
      }
    };

    fetchListings();
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
