import React, { useState, useEffect } from "react";
import PermissionTable from "../components/PermissionTable";
import Modal from "../components/Modal";
import { Add } from "@mui/icons-material"; // Importing MUI icon

const PermissionsPage = () => {
  // Load permissions from localStorage
  const loadPermissionsFromStorage = () => {
    const storedPermissions = localStorage.getItem("permissions");
    return storedPermissions
      ? JSON.parse(storedPermissions)
      : [
          { id: 1, name: "Read", description: "Allows reading data" },
          { id: 2, name: "Write", description: "Allows writing data" },
          { id: 3, name: "Delete", description: "Allows deleting data" },
        ];
  };

  const [permissions, setPermissions] = useState(loadPermissionsFromStorage);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState(null);

  // Save permissions to localStorage whenever permissions change
  useEffect(() => {
    localStorage.setItem("permissions", JSON.stringify(permissions));
  }, [permissions]);

  const handleSave = (permission) => {
    if (permission.id) {
      // Update existing permission
      setPermissions(
        permissions.map((p) =>
          p.id === permission.id ? { ...p, ...permission } : p
        )
      );
    } else {
      // Add new permission
      setPermissions([...permissions, { ...permission, id: Date.now() }]);
    }
    setModalOpen(false);
    setCurrentPermission(null);
  };

  const handleEdit = (permission) => {
    setCurrentPermission(permission);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setPermissions(permissions.filter((p) => p.id !== id));
  };

  return (
    <div className="flex justify-center bg-gray-100  h-full">
      {/* Centering on X-axis only */}
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6 max-[400px]:px-0">
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-6">
          Permission Management
        </h2>
        <div className="flex justify-center w-full mb-6">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors mb-6"
        >
          <Add />
          <span>Add Permission</span>
        </button>
        </div>
        <PermissionTable
          permissions={permissions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {modalOpen && (
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <h3 className="text-lg font-bold mb-4">
              {currentPermission ? "Edit Permission" : "Add Permission"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const name = formData.get("name");
                const description = formData.get("description");
                handleSave({ id: currentPermission?.id, name, description });
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                name="name"
                defaultValue={currentPermission?.name || ""}
                placeholder="Permission Name"
                className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <input
                type="text"
                name="description"
                defaultValue={currentPermission?.description || ""}
                placeholder="Description"
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

export default PermissionsPage;
