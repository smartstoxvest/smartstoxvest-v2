import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expected = import.meta.env.VITE_ADMIN_TOKEN;
    setIsAdmin(token === expected);
    setIsChecking(false);
  }, []);

  if (isChecking) return null; // optional: show loader

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
