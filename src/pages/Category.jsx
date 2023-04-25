import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { where } from "firebase/firestore";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { fetchListings } from "../helpers/utils";

const Category = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    fetchListings(where("type", "==", params.categoryName), 10)
      .then((data) => {
        setListings(data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [params.categoryName]);

  if (isLoading) return <Spinner />;

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          Places for {params.categoryName === "rent" ? "rent" : "sale"}
        </p>
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
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
};

export default Category;
