import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  if (token !== "my-secret-token") {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default RequireAdmin;
