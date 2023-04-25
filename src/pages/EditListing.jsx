import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../misc/firebase";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { getDocument } from "../helpers/utils";

const EditListing = () => {
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
  });
  const navigate = useNavigate();
  const params = useParams();

  // set user ref to logged in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setFormData({ ...formData, userRef: user.uid });
      else navigate("/sign-in");
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle redirect if listing is not user's
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You're not allowed to edit this listing");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  // fetch listing to edit
  useEffect(() => {
    setIsLoading(true);
    getDocument("listings", params.listingId).then((data) => {
      if (data) {
        setListing(data);
        setFormData({ ...data });
        setIsLoading(false);
      } else {
        navigate("/");
        setIsLoading(false);
        toast.error("Listing not found");
      }
    });
  }, [params.listingId, navigate]);

  const onMutate = (e) => {
    const { value, files, id } = e.target;
    let boolean = null;

    if (value === "true") boolean = true;
    if (value === "false") boolean = false;

    // files state change
    if (files) {
      setFormData((prevState) => ({
        ...prevState,
        images: files,
      }));
    }

    // text/booleans/numbers state change
    if (!files) {
      setFormData((prevState) => ({
        ...prevState,
        [id]: boolean ?? value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.discountedPrice >= FormData.regularPrice) {
      setIsLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }

    if (formData.images > 6) {
      setIsLoading(false);
      toast.error("You can only upload less than 6 images");
      return;
    }

    // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();

        // creating reference in storage
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            if (snapshot.state === "paused") console.log("Upload is paused");
            else if (snapshot.state === "running")
              console.log("Upload is running");
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...formData.images].map((image) => storeImage(image))
    ).catch(() => {
      setIsLoading(false);
      toast.error("Image not uploaded");
      return;
    });

    // organizing data
    const formDataCopy = {
      ...formData,
      imageUrls,
      timestamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    // updating listing to firebase
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);

    setIsLoading(false);
    toast.success("Listing saved");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Edit Listing</p>
      </header>
      <main>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label className="formLabel"></label>
          <div className="formButtons">
            <button
              type="button"
              className={
                formData.type === "sale" ? "formButtonActive" : "formButton"
              }
              id="type"
              value={"sale"}
              onClick={onMutate}
            >
              Sale
            </button>
            <button
              type="button"
              className={
                formData.type === "rent" ? "formButtonActive" : "formButton"
              }
              id="type"
              value={"rent"}
              onClick={onMutate}
            >
              Rent
            </button>
          </div>
          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={formData.name}
            onChange={onMutate}
            maxLength="32"
            minLength="10"
            required
          />

          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                value={formData.bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                value={formData.bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <label className="formLabel">Parking spot</label>
          <div className="formButtons">
            <button
              className={formData.parking ? "formButtonActive" : "formButton"}
              type="button"
              id="parking"
              value={true}
              onClick={onMutate}
              min="1"
              max="50"
            >
              Yes
            </button>
            <button
              className={
                !formData.parking && formData.parking !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="parking"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              className={formData.furnished ? "formButtonActive" : "formButton"}
              type="button"
              id="furnished"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !formData.furnished && formData.furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="furnished"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={formData.address}
            onChange={onMutate}
            required
          />

          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={formData.offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !formData.offer && formData.offer !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={formData.regularPrice}
              onChange={onMutate}
              min="50"
              max="750000000"
              required
            />
            {formData.type === "rent" && (
              <p className="formPriceText">$ / Month</p>
            )}
          </div>

          {formData.offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={formData.discountedPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required={formData.offer}
              />
            </>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Edit Listing
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditListing;
