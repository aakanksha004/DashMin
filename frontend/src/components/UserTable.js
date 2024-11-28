import React, { useState } from "react";
import {
  Edit,
  Delete,
  Save,
  Cancel,
} from "@mui/icons-material"; // Import MUI icons

const UserTable = ({
  users,
  setUsers,
  onEdit, // Edit handler passed from parent
  onDelete,
  currentUser,
  currentPage,
  usersPerPage,
  onSortByStatus,
  sortDirectionStatus,
  onSortByRole,
  sortDirectionRole,
}) => {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({
    name: "",
    role: "",
    permissions: "",
  });

  // Handle editing user data
  const handleEditClick = (user) => {
    if (!user) return;
    setEditingUserId(user.id);
    setEditedUserData({
      name: user.name || "",
      role: user.role || "No Role",
      permissions: user.permissions ? user.permissions.join(", ") : "",
    });
  };

  // Handle saving the edited user data
  const handleSave = (userId) => {
    const updatedPermissions = editedUserData.permissions
      ? editedUserData.permissions.split(",").map((p) => p.trim())
      : [];
    onEdit(userId, { ...editedUserData, permissions: updatedPermissions });
    setEditingUserId(null);
  };

  // Handle canceling the edit
  const handleCancel = () => {
    setEditingUserId(null);
  };

  // Handle changes in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle user status toggle (active/inactive)
  const handleStatusToggle = async (userId) => {
    try {
      const response = await fetch(`https://dashmin.onrender.com/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to toggle user status');
      
      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: updatedUser.status } : user
      ));
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  return (
    <div className="w-full overflow-x-hidden px-1 max-[400px]:px-0 sm:px-0 lg:px-8">
      <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg text-sm sm:text-base">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="p-2 sm:p-3 text-left w-1/12 hidden md:table-cell">Id No.</th>
            <th className="p-2 sm:p-3 text-left w-3/12">Name</th>
            <th className="p-2 sm:p-3 text-left w-3/12">Role</th>
            <th className="p-2 sm:p-3 text-left w-3/12 hidden lg:table-cell">Permissions</th>
            <th className="p-2 sm:p-3 text-center w-2/12 max-[300px]:hidden">Status</th>
            <th className="p-2 sm:p-3 text-center w-2/12">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="border-b hover:bg-gray-100 transition-colors">
              {/* Id No. */}
              <td className="p-2 sm:p-3 hidden md:table-cell">
                {(currentPage - 1) * usersPerPage + index + 1}
              </td>
              {/* Name */}
              <td className="p-2 sm:p-3">
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editedUserData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  user.name
                )}
              </td>
              {/* Role */}
              <td className="p-2 sm:p-3">
                {editingUserId === user.id ? (
                  <select
                    name="role"
                    value={editedUserData.role}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Editor">Editor</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              {/* Permissions */}
              <td className="p-2 sm:p-3 hidden lg:table-cell">
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    name="permissions"
                    value={editedUserData.permissions}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  user.permissions.join(", ")
                )}
              </td>
              {/* Status */}
              <td className="p-2 sm:p-3 text-center max-[300px]:hidden">
                <button
                  onClick={() => handleStatusToggle(user.id)}
                  className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm text-white rounded ${user.status ? "bg-teal-400" : "bg-red-400"} hover:opacity-70`}
                >
                  {user.status ? "Active" : "Inactive"}
                </button>
              </td>
              {/* Actions */}
              <td className="p-2 sm:p-3 text-center">
                {editingUserId === user.id ? (
                  <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-2">
                    <button
                      onClick={() => handleSave(user.id)}
                      className="text-blue-500 p-1 sm:p-2 rounded hover:bg-blue-100"
                    >
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-500 p-1 sm:p-2 rounded hover:bg-gray-200"
                    >
                      <Cancel className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-2">
                    {currentUser.role === "Admin" && (
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-teal-500 p-1 sm:p-2 rounded hover:bg-green-200"
                      >
                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(user.id)}
                      className="text-red-500 p-1 sm:p-2 rounded hover:bg-red-100"
                    >
                      <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
