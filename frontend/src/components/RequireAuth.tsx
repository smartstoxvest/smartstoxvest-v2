import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth() as AuthContextType;

  if (loading) return <div className="text-center p-4">🔒 Checking auth...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

export default RequireAuth;
