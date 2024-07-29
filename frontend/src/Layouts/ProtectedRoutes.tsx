import { AppContext } from "@/context/AppContext";
import { AppContextType } from "@/types";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  if (loggedInUser !== null) {
    return <Outlet/>;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
