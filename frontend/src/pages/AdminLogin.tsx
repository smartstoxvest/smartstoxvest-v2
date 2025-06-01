import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import TopNavigation from "@/components/TopNavigation";

const AdminLogin = () => {
  const [email, setEmail] = useState(""); // ✅ NEW
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsAdminVerified } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // ✅ INCLUDE EMAIL
      });

      const text = await response.text();
      console.log("📦 Raw response text:", text);

      if (!response.ok) {
        console.error("❌ Admin login failed with status:", response.status);
        setError("Invalid credentials");
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
        const base64Url = data.access_token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = JSON.parse(atob(base64));
        console.log("✅ Decoded token:", decodedPayload);
        localStorage.setItem("userEmail", decodedPayload.sub); // ✅
      } catch (err) {
        console.error("❌ Failed to parse JSON:", err);
        setError("Invalid server response");
        return;
      }

      if (!data.access_token) {
        setError("Access token not found in response");
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("loginTime", Date.now().toString());

      setIsAdminVerified(true);
      navigate("/app/admin/new");
    } catch (err) {
      console.error("⚠️ Login request failed:", err);
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <>
      <TopNavigation />
      <div className="max-w-md mx-auto mt-20 p-6 border border-gray-200 rounded-2xl shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center">🔐 Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 px-4 py-2 w-full rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 px-4 py-2 w-full rounded-lg"
            required
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 w-full rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </a>
        </p>
      </div>
    </>
  );
};

export default AdminLogin;
