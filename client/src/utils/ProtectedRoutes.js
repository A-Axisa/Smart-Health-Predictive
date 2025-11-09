import { Outlet, Navigate } from "react-router-dom"
import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';


const ProtectedRoutes = ({role}) => {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_BASE}/user/me`, {
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

  // Check if the user should go to the routed page or login
  return (user.role === role) ? <Outlet /> : <Navigate to="/landing" />;
};

export default ProtectedRoutes;