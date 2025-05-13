import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  console.log("💣 ENV:", import.meta.env)
  const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
  const adminToken = import.meta.env.VITE_ADMIN_TOKEN;
  if (!adminToken) {
    console.error("❌ Missing VITE_ADMIN_TOKEN in env.");
  }
  
  console.log("🧪 ENV TOKEN:", import.meta.env.VITE_ADMIN_TOKEN);
  console.log("🧪 LocalStorage TOKEN:", localStorage.getItem("token"));
  
  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();

  console.log("🔐 Attempted login with:", password);
  console.log("✅ Expected password:", expectedPassword);
  console.log("🎯 Setting token:", adminToken);

  if (password.trim() === expectedPassword) {
    localStorage.setItem("token", adminToken);
    localStorage.setItem("loginTime", Date.now().toString());

    // 🚀 Redirect to /app/admin/new-post
    const basePath = "/app/";  // <-- hardcoded safe fallback
    window.location.href = `${basePath}admin/new-post`;
  } else {
    setError("Invalid password");
  }
};

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">🔐 Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
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
    </div>
  );
};

export default AdminLogin;
