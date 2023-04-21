import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../misc/firebase";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";

const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      // handling user authentication
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // referencing the user on the database
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // verifying if user is not already authenticated
      if (!userSnap.exists()) {
        // signing user up
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp()
        });
      }

      navigate("/")
    } catch (error) {
      toast.error("Could not authorize with Google")
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/sign-up" ? "up" : "in"}</p>
      <button className="socialIconDiv" onClick={handleClick}>
        <img src={googleIcon} alt="google icon" className="socialIconImg" />
      </button>
    </div>
  );
};

export default OAuth;
