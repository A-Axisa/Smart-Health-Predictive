import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../components/Navbar";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const PublicOnlyRoutes = ({ role }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/user/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  if (user === undefined) return null;

  if (user) {
    return <Navigate to="/landing" />;
  }

  // Check if the user should go to the routed page or login
  return <Outlet />;
};

export default PublicOnlyRoutes;
