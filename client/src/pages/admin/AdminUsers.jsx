import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const roleBadge = {
  admin: "bg-rose-100 text-rose-600",
  hotelOwner: "bg-blue-100 text-blue-600",
  user: "bg-gray-100 text-gray-600",
};

const AdminUsers = () => {
  const { axios, getToken } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change this user's role to "${newRole}"?`)) return;
    try {
      const { data } = await axios.patch(
        `/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success("Role updated");
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  if (loading) return null;

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-2xl font-playfair mb-6">All Users ({users.length})</h1>

      <div className="max-w-3xl border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Email</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Username</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Role</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-gray-100 hover:bg-gray-50/70 transition-colors">
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4 text-gray-500">{u.username || "—"}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleBadge[u.role] || roleBadge.user}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="user">user</option>
                    <option value="hotelOwner">hotelOwner</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;