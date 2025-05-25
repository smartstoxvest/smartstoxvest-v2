import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";

// 👤 User type — extend as needed
interface User {
  email: string;
  // add name, id, roles etc if available
}

// 🌐 Auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  isAdminVerified: boolean;
  setIsAdminVerified: (value: boolean) => void;
}

// ⛳ Default (safe fallback)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminVerified, setIsAdminVerifiedState] = useState<boolean>(
    () => sessionStorage.getItem("isAdminVerified") === "true"
  );

  // Sync sessionStorage on change
  const setIsAdminVerified = (value: boolean) => {
    sessionStorage.setItem("isAdminVerified", value ? "true" : "false");
    setIsAdminVerifiedState(value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, isAdminVerified, setIsAdminVerified }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
