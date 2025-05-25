import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // ✅ import context

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsAdminVerified } = useAuth(); // ✅ grab context

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const text = await response.text();
      console.log("📦 Raw response text:", text);

      if (!response.ok) {
        console.error("❌ Admin login failed with status:", response.status);
        setError("Invalid password");
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("❌ Failed to parse JSON:", err);
        setError("Invalid server response");
        return;
      }

      console.log("🪪 Parsed token:", data.access_token);

      if (!data.access_token) {
        setError("Access token not found in response");
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("loginTime", Date.now().toString());

      setIsAdminVerified(true); // ✅ Set context state
      navigate("/admin/new-post"); // ✅ Route to New Post

    } catch (err) {
      console.error("⚠️ Login request failed:", err);
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">🔐 Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Enter admin password"
          className="border px-4 py-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
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
  );
};

export default AdminLogin;
