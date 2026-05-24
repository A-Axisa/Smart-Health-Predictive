import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Only grants access to child components when a user is not logged in
 * the website.
 *
 * @returns {react-router-dom.Navigate | react-router-dom.Outlet}
 */
const PublicOnlyRoutes = () => {
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
