import React, { useState, useEffect } from "react";
import RolesTable from "../components/RoleTable";
import { Add } from "@mui/icons-material"; // Importing Add icon from MUI
import { IconButton } from "@mui/material"; // Importing IconButton from MUI
import "../styles/RolesPage.css";
import Modal from "../components/Modal.js";
const RolesPage = () => {
  const loadRolesFromStorage = () => {
    const savedRoles = JSON.parse(localStorage.getItem("roles"));
    if (savedRoles) {
      return savedRoles;
    } else {
      return [
        { id: 1, name: "Admin", permissions: ["Read", "Write", "Delete"] },
        { id: 2, name: "Editor", permissions: ["Read", "Write"] },
        { id: 3, name: "Viewer", permissions: ["Read"] },
      ];
    }
  };

  const [roles, setRoles] = useState(loadRolesFromStorage());
  const [modalOpen, setModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    permissions: "",
  });

  useEffect(() => {
    localStorage.setItem("roles", JSON.stringify(roles));
  }, [roles]);

  const handleEdit = (roleId, updatedData) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => (role.id === roleId ? { ...role, ...updatedData } : role))
    );
  };

  const handleDelete = (roleId) => {
    setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleId));
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    const newPermissions = newRole.permissions
      ? newRole.permissions.split(",").map((p) => p.trim())
      : [];

    const newRoleData = {
      id: Date.now(),
      name: newRole.name,
      permissions: newPermissions,
    };

    setRoles([...roles, newRoleData]);
    setModalOpen(false);
    setNewRole({ name: "", permissions: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-center bg-gray-100 p-2 h-full">
      {/* Main container with responsive design */}
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-6">
          Role Management
        </h2>
        {/* Add Role Button */}
      {/* Add Role Button */}
<div className="flex justify-center w-full mb-6">
  <button
    onClick={() => setModalOpen(true)}
    className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
  >
    <Add />
    <span>Add Role</span>
  </button>
</div>
        
        {/* Role Table */}
        <RolesTable
          roles={roles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        {/* Modal for Adding Role */}
        {modalOpen && (
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <h3 className="text-lg font-bold mb-4">
              Add Role
            </h3>
            <form onSubmit={handleAddRole} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                value={newRole.name}
                onChange={handleInputChange}
                placeholder="Role Name"
                className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <input
                type="text"
                name="permissions"
                value={newRole.permissions}
                onChange={handleInputChange}
                placeholder="Permissions (comma separated)"
                className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default RolesPage;
