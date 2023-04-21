import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../misc/firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formController, setFormController] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormController((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      // registering the user 
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formController.email,
        formController.password
      );
      // getting user info for database
      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: formController.name,
      });

      navigate("/");

      // handling database user info creation

      // creating new user formData for the database
      const formData = {...formController};
      delete formData.password;
      formData.timestamp = serverTimestamp();

      // uploading user info to the database
      await setDoc(doc(db, "users", user.uid), formData);

      toast.success("You've been registered successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome back</p>
      </header>
      <main>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="name"
            id="name"
            value={formController.name}
            className="nameInput"
            placeholder="Name"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            name="email"
            id="email"
            value={formController.email}
            className="emailInput"
            placeholder="Email"
            onChange={(e) => handleChange(e)}
          />
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formController.password}
              className="passwordInput"
              placeholder="Password"
              onChange={(e) => handleChange(e)}
            />
            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>

          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        <Link to="/sign-in" className="registerLink">
          Sign In Instead
        </Link>
      </main>
    </div>
  );
};

export default SignUp;
