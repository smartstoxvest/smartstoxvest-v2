import { useEffect, useState } from "react";
import api from "@/lib/axios";

type User = {
  id: number;
  email: string;
  created_at?: string;
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
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
  }, []);

  if (loading) return <p className="text-center py-6">⏳ Loading users...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">👥 Registered Users</h2>
      {error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.id} className="border p-3 rounded bg-white shadow-sm text-sm">
              <div><strong>📧 Email:</strong> {u.email}</div>
              {u.created_at && (
                <div className="text-gray-500 text-xs">🗓️ Joined: {u.created_at.slice(0, 10)}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminUsers;
