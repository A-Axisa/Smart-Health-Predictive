import { Outlet, Navigate } from "react-router-dom"
import React, { useEffect, useState } from 'react';


const ProtectedRoutes = ({role}) => {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`http://localhost:8000/user/me`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(user => {
        setUser(user);
        setLoading(false);
      })
  }, []);

  // Prevent the user from getting routed to login if they are loading
  if (loading) return;

  if (!user) return <Navigate to="/login" />;

  // Check if the user should go to the routed page or login
  return (user.role === role) ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;