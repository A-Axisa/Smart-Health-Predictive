import { Outlet, Navigate } from "react-router-dom"
import React, { useEffect, useState } from 'react';


const LandingRoute = () => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`http://localhost:8000/user/me`, {
      method: "GET",
      credentials: "include"
    })
      .then(response => response.json())
      .then(user => {
        setUser(user);
        setLoading(false);
      })
  }, []);

  // Prevent the user from getting routed to login if they are loading
  if (loading) return;

  if (!user) return <Navigate to="/login" />;

  if (user.role === "standard_user") return <Navigate to="/user-landing" />

  if (user.role === "merchant") return <Navigate to="/merchant-landing" />

  if (user.role === "admin") return <Navigate to="/admin-dashboard" />

  return <Navigate to="/login"/>
};

export default LandingRoute;