import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuthStatus = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setIsUserLoggedIn(true);
      setIsCheckingStatus(false);
    });
    return () => unsubscribe();
  }, []);

  return { isUserLoggedIn, isCheckingStatus };
};
