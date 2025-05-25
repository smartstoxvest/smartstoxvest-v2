import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface User {
  email: string;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // ✅ fix

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("❌ No token found");
      setLoading(false);
      return;
    }

    api
      .get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Auth check failed:", err);
        setError("Invalid token");
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
};

export default useAuth;
