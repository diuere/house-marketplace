import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../helpers/custom-hooks";
import Spinner from "./Spinner";

const PrivateRoute = () => {
  const { isUserLoggedIn, isCheckingStatus } = useAuthStatus();

  if (isCheckingStatus) return <Spinner />;

  return isUserLoggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
