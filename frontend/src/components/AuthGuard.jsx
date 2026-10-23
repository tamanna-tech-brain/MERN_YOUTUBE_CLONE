import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthGuard = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default AuthGuard;