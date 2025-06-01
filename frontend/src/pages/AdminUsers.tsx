import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import TopNavigation from "@/components/TopNavigation";

type User = {
  id: number;
  email: string;
  created_at?: string;
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const adminEmails = ["smartstoxvest@gmail.com"];
  const userEmail = localStorage.getItem("userEmail");
  const isAdmin = userEmail && adminEmails.includes(userEmail);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) {
        setError("⛔ You are not authorized.");
        setLoading(false);
        setTimeout(() => {
          navigate("/app/admin/login");
        }, 1500);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setError("❌ Failed to fetch users or not authorized.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, navigate]);

  return (
    <>
      <TopNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">👥 Registered Users</h1>

        {loading ? (
          <p className="text-center text-gray-600">⏳ Checking access...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="border border-gray-200 rounded-xl p-4 bg-white shadow-md hover:shadow-lg transition"
              >
                <p className="font-medium text-sm">
                  📧 <span className="text-gray-800">{user.email}</span>
                </p>
                {user.created_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    🗓️ Joined on {new Date(user.created_at).toLocaleDateString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AdminUsers;
