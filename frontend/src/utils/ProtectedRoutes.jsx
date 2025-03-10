import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const tokenString = localStorage.getItem(
    "sb-vakmfwtcbdeaigysjgch-auth-token",
  );
  return tokenString ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
