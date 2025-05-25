import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error("Missing token in URL");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        new_password: newPassword,
      });

      if (res.status === 200) {
        toast.success("✅ Password reset successful!");
        navigate("/auth"); // or "/login"
      } else {
        toast.error("❌ Something went wrong");
      }
    } catch (err: unknown) {
      const axiosErr = err as any;
      toast.error(axiosErr?.response?.data?.detail || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleReset} className="bg-white shadow-md rounded p-6 w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-center">🔐 Reset Your Password</h2>

        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
