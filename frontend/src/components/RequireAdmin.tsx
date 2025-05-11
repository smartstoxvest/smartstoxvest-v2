import React from "react";
import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  if (token !== "my-secret-token") {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default RequireAdmin;
