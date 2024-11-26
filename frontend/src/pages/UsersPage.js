import React, { useState, useEffect } from "react";
import UserTable from "../components/UserTable";
import Modal from "../components/Modal";
import { Add, Search, Sort, Refresh } from "@mui/icons-material"; // Importing Refresh icon from MUI
import { Menu, MenuItem } from "@mui/material"; // Importing Menu and MenuItem from MUI
import "../styles/UsersPage.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser] = useState({
    id: 1,
    name: "Admin User",
    role: "Admin",
    permissions: ["Read", "Write", "Delete"],
  });

  const [editingUserId, setEditingUserId] = useState(null); // Track editing state
  const [editingData, setEditingData] = useState({}); // Track temporary editing data
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    role: "",
    permissions: "",
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null); // Anchor for role sort menu
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null); // Anchor for status sort menu
  const [nameSortMenuAnchor, setNameSortMenuAnchor] = useState(null); // Anchor for name sort menu

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://dashmin.onrender.com/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditToggle = (userId) => {
    if (editingUserId === userId) {
      // Save changes
      handleEdit(userId, editingData);
      setEditingUserId(null);
      setEditingData({});
    } else {
      // Start editing
      const userToEdit = users.find((user) => user.id === userId);
      setEditingData({ ...userToEdit });
      setEditingUserId(userId);
    }
  };

  const handleEditChange = (field, value) => {
    setEditingData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleEdit = async (userId, updatedData) => {
    try {
      const response = await fetch(`https://dashmin.onrender.com/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update user");

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? updatedUser : user))
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterUsers(query);
  };

  const filterUsers = (query) => {
    if (!query) {
      fetchUsers(); // Reset to fetch all users if query is empty
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.role.toLowerCase().includes(query.toLowerCase())
    );
    setUsers(filtered);
  };

  const handleRefresh = () => {
    fetchUsers(); // Refresh the user list to its initial state
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newPermissions = newUser.permissions
      ? newUser.permissions.split(",").map((p) => p.trim())
      : [];

    const newUserData = {
      name: newUser.name,
      role: newUser.role,
      permissions: newPermissions,
      status: true,
    };

    try {
      const response = await fetch("https://dashmin.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, data]);
      setModalOpen(false);
      setNewUser({ name: '', role: '', permissions: '' });
    } catch (err) {
      setError(err.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex justify-center bg-gray-100 p-1 ">
      {/* User management UI */}
      <UserTable
        users={currentUsers}
        setUsers={setUsers}
        currentUser={currentUser}
        editingUserId={editingUserId}
        editingData={editingData}
        onEditToggle={handleEditToggle}
        onEditChange={handleEditChange}
        currentPage={currentPage}
        usersPerPage={usersPerPage}
      />
    </div>
  );
};

export default UsersPage;

