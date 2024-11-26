import React, { useState, useEffect } from "react";
import UserTable from "../components/UserTable";
import Modal from "../components/Modal";
import { Add, Search, Sort, Refresh } from "@mui/icons-material"; 
import { Menu, MenuItem } from "@mui/material"; 
import "../styles/UsersPage.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser] = useState({
    id: 1,
    name: "Admin User",
    role: "Admin",
    permissions: ["Read", "Write", "Delete"],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    role: "",
    permissions: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null); 
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null); 
  const [nameSortMenuAnchor, setNameSortMenuAnchor] = useState(null);

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

  const handleToggleStatus = async (userId, currentStatus) => {
    const updatedStatus = !currentStatus;
    try {
      const response = await fetch(`https://dashmin.onrender.com/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!response.ok) throw new Error("Failed to toggle status");

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: updatedUser.status } : user
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <div>
      {/* Component JSX */}
      <UserTable
        users={users}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus} // Pass toggle handler to UserTable
        currentUser={currentUser}
      />
      {/* Other JSX */}
    </div>
  );
};

export default UsersPage;

