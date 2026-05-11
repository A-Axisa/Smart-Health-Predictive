import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../components/Navbar";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const ProtectedRoutes = ({ role }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetch(`${API_BASE}/user/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          setUser(null);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  // Prevent the user from getting routed to login if they are loading
  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if the user should go to the routed page or login
  return user.role === role ? (
    <>
      <NavBar role={user.role} />
      <Outlet />
    </>
  ) : (
    <Navigate to="/landing" />
  );
};

export default ProtectedRoutes;
