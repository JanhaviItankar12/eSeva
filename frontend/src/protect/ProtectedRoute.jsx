import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children,requiredRole }) => {
  const { token,user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Logged in but role does not match → redirect to unauthorized page or dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
