import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

// --------------------- FORGOT PASSWORD ---------------------
export const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/request-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("📩 Reset link sent to your email. Please check your inbox or spam folder.");
      } else {
        toast.error(data.detail || "Something went wrong");
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "message" in err) {
        toast.error((err as { message: string }).message);
      } else {
        toast.error("Server error");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🔑 Forgot Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Your email"
          className="w-full p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

// --------------------- RESET PASSWORD ---------------------
export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("✅ Password reset successful");
        navigate("/app/admin/login");
      } else {
        toast.error(data.detail || "Reset failed");
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "message" in err) {
        toast.error((err as { message: string }).message);
      } else {
        toast.error("Server error");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🔐 Reset Your Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          className="w-full p-2 border"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};
