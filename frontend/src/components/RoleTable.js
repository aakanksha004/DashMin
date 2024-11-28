import React, { useState } from "react";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";

const RolesTable = ({ roles, onEdit, onDelete }) => {
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editedRoleData, setEditedRoleData] = useState({
    name: "",
    permissions: "",
  });

  const handleEditClick = (role) => {
    if (!role) return;
    setEditingRoleId(role.id);
    setEditedRoleData({
      name: role.name || "",
      permissions: role.permissions ? role.permissions.join(", ") : "",
    });
  };

  const handleSave = (roleId) => {
    const updatedPermissions = editedRoleData.permissions
      ? editedRoleData.permissions.split(",").map((p) => p.trim())
      : [];
    onEdit(roleId, { ...editedRoleData, permissions: updatedPermissions });
    setEditingRoleId(null);
  };

  const handleCancel = () => {
    setEditingRoleId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRoleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="w-full overflow-x-hidden px-1 max-[400px]:px-0 sm:px-6 lg:px-8">
    <table className="min-w-full w-full border-collapse border border-gray-200 bg-white shadow-md rounded-md text-sm sm:text-base">
      <thead>
        <tr className="bg-teal-700 text-white">
          <th className="p-2  max-[300px]:p-1 sm:p-3 text-left w-1/3">Role Name</th>
          <th className="p-2 max-[300px]:p-1 sm:p-3 text-left w-1/3 max-[300px]:hidden ">Permissions</th>
          <th className="p-2 max-[300px]:p-1  sm:p-3 text-center w-1/3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => (
          <tr
            key={role.id}
            className="border-b hover:bg-gray-100 transition-colors"
          >
            <td className="p-2 sm:p-3">
              {editingRoleId === role.id ? (
                <input
                  type="text"
                  name="name"
                  value={editedRoleData.name}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              ) : (
                role.name
              )}
            </td>
            <td className="p-2 sm:p-3 max-[300px]:hidden ">
              {editingRoleId === role.id ? (
                <input
                  type="text"
                  name="permissions"
                  value={editedRoleData.permissions}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              ) : (
                role.permissions.join(", ")
              )}
            </td>
            <td className="p-2 sm:p-3 text-center">
              {editingRoleId === role.id ? (
                <div className="flex justify-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handleSave(role.id)}
                    className="bg-blue-600 p-1 sm:p-2 rounded text-xs sm:text-sm hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 p-1 sm:p-2 rounded text-xs sm:text-sm hover:bg-gray-600"
                  >
                    <Cancel className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handleEditClick(role)}
                    className="text-teal-600 p-1 sm:p-2 rounded text-xs sm:text-sm hover:bg-teal-100"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(role.id)}
                    className="text-red-600 p-1 sm:p-2 rounded text-xs sm:text-sm hover:bg-red-100"
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

export default RolesTable;


