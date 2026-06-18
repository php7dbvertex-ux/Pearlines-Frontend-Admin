import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  const adminEmail =
    localStorage.getItem("adminEmail");

  if (
    !isLoggedIn ||
    adminEmail !== "admin@gmail.com"
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;