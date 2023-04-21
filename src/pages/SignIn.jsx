import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formController, setFormController] = useState({
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formController.email,
        formController.password
      );
      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error('Incorrect user credentials');
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

          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        <OAuth />

        <Link to="/sign-up" className="registerLink">
          Sign Up Instead
        </Link>
      </main>
    </div>
  );
};

export default SignIn;
