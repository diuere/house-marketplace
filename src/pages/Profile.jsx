import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc, where, deleteDoc } from "firebase/firestore";
import { db } from "../misc/firebase";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import { fetchListings } from "../helpers/utils";
import ListingItem from "../components/ListingItem";

const Profile = () => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [isDetailsChanging, setIsDetailsChanging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings(where("userRef", "==", auth.currentUser.uid), undefined)
      .then((data) => {
        setListings(data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [auth.currentUser.uid]);
  const handleLogout = (e) => {
    auth.signOut();
    navigate("/sign-in");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const userName = currentUser.name.trim();
      if (auth.currentUser.displayName !== userName) {
        // update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: currentUser.name,
        });
        // update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name: currentUser.name,
        });
        toast.success("Name updated successfully");
      }
    } catch (error) {
      toast.error("Couldn't update profile details");
    }
  };

  const handleListingDelete = async (listingId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (confirm) {
      await deleteDoc(doc(db, "listings", listingId));

      const updatedListing = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListing);

      toast.success("Listing was deleted successfully");
    }
  };

  const handleListingEdit = (listingId) =>
    navigate(`/edit-listing/${listingId}`);

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              isDetailsChanging && handleSubmit();
              setIsDetailsChanging((prevState) => !prevState);
            }}
          >
            {isDetailsChanging ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              className={
                isDetailsChanging ? "profileNameActive" : "profileName"
              }
              disabled={!isDetailsChanging}
              value={currentUser.name}
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              className={"profileEmail"}
              disabled={true}
              value={currentUser.email}
            />
          </form>
        </div>

        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home icon" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right icon" />
        </Link>

        {!isLoading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listing</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listingData={listing.data}
                  id={listing.id}
                  handleDelete={() => handleListingDelete(listing.id)}
                  handleEdit={() => handleListingEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
