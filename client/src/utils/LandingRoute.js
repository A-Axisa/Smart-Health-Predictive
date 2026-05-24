import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Reroutes a user to the landing page that corresponds to their role.
 *
 * @returns {react-router-dom.Navigate}
 */
const LandingRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_BASE}/user/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((user) => {
        setUser(user);
        setLoading(false);
      });
  }, []);

  // Prevent the user from getting routed to login if they are loading
  if (loading) return;

  if (!user) return <Navigate to="/login" />;

  if (user.role === "standard_user") return <Navigate to="/user-landing" />;

  if (user.role === "merchant") return <Navigate to="/merchant-landing" />;

  if (user.role === "admin") return <Navigate to="/admin-dashboard" />;

  // Return to login if the users role is not one of the above
  return <Navigate to="/login" />;
};

export default LandingRoute;
