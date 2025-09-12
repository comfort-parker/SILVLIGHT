import React, { useEffect, useState } from "react";
import {
  getUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "../Api";
import "./AdminUser.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ filter states
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
    verified: "",
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle role update
  const handleRoleChange = async (id, role) => {
    try {
      await updateUserByAdmin(id, { role });
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserByAdmin(id);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // ✅ Filter logic
  const filteredUsers = users.filter((u) => {
    const nameMatch =
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(filters.name.toLowerCase());

    const emailMatch = u.email
      .toLowerCase()
      .includes(filters.email.toLowerCase());

    const roleMatch =
      filters.role === "" ||
      u.role.toLowerCase() === filters.role.toLowerCase();

    const verifiedMatch =
      filters.verified === "" ||
      (filters.verified === "true" && u.isVerified) ||
      (filters.verified === "false" && !u.isVerified);

    return nameMatch && emailMatch && roleMatch && verifiedMatch;
  });

  return (
    <div className="admin-users-container">
      <h1 className="admin-users-title">Manage Users</h1>

      {/* ✅ Filters */}
      <div className="admin-users-filters">
        <input
          type="text"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Role (user/admin)"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Verified (true/false)"
          value={filters.verified}
          onChange={(e) => setFilters({ ...filters, verified: e.target.value })}
        />
      </div>

      {loading ? (
        <p className="admin-users-loading">Loading users...</p>
      ) : (
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value)
                    }
                    className="admin-users-role-select"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{user.isVerified ? "✅" : "❌"}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="admin-users-delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="admin-users-no-data">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
