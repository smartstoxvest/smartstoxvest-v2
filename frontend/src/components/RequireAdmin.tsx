import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
}

const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth() as AuthContextType;
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  if (!user || user.email !== adminEmail) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
