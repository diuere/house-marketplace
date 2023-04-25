import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../misc/firebase";

export const fetchListings = async (whereFunc, limitVal) => {
  try {
    const listingsRef = collection(db, "listings");

    const q = query(
      listingsRef,
      whereFunc,
      orderBy("timestamp", "desc"),
      limit(limitVal)
    );
    const querySnap = await getDocs(q);

    const modListing = [];

    querySnap.forEach((doc) => {
      modListing.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    return modListing;
  } catch (error) {
    throw new Error(error);
  }
};

export const getDocument = async (type, path) => {
  try {
    const docRef = doc(db, type, path);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
};
