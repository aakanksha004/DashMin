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
      const response = await fetch("http://localhost:5000/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
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

  const handleSortByRole = (role) => {
    const sortedUsers = [...users].sort((a, b) => {
      if (a.role === role && b.role !== role) return -1; // Selected role goes to the top
      if (a.role !== role && b.role === role) return 1;
      return 0; // Preserve the order of other roles
    });
    setUsers(sortedUsers);
    setSortMenuAnchor(null); // Close the menu after sorting
  };

  const handleSortByStatus = (status) => {
    const sortedUsers = [...users].sort((a, b) => {
      if (a.status === status && b.status !== status) return -1; // Selected status goes to the top
      if (a.status !== status && b.status === status) return 1;
      return 0; // Preserve the order of other statuses
    });
    setUsers(sortedUsers);
    setStatusMenuAnchor(null); // Close the menu after sorting
  };

  const handleSortByName = (order) => {
    const sortedUsers = [...users].sort((a, b) => {
      if (order === "asc") {
        return a.name.localeCompare(b.name); // Ascending order
      } else {
        return b.name.localeCompare(a.name); // Descending order
      }
    });
    setUsers(sortedUsers);
    setNameSortMenuAnchor(null); // Close the menu after sorting
  };

  const handleRefresh = () => {
    fetchUsers(); // Refresh the user list to its initial state
  };

  const handleEdit = async (userId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
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

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
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
      const response = await fetch("http://localhost:5000/users", {
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
      
      // Update the users list with the new user
      setUsers(prevUsers => [...prevUsers, data]);
      
      // Clear form and close modal
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
  <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
    <h2 className="text-2xl font-bold text-teal-700 text-center mb-6">
      User Management
    </h2>

    {/* Search Bar with Icon */}
    <div className="flex items-center gap-4 mb-6 ml-8">
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name or role"
          className="w-full border-2 bg-slate-100 rounded-3xl px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
      </div>
    </div>

    {/* Buttons: Add User, Filter by Role, Filter by Status, Sort by Name, and Refresh */}
    <div className="flex items-center justify-between gap-2 mb-6">
      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        className="flex items-center justify-center gap-2 ml-8 bg-teal-400 text-white px-2 py-2 rounded hover:bg-teal-600 transition-colors sm:px-4 sm:py-2"
      >
        <Refresh className="text-sm sm:text-base" />
        <span className="hidden sm:inline"></span>
      </button>

      <div className="flex gap-2 sm:gap-4">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center bg-teal-600 text-white px-2 py-2 rounded hover:bg-teal-500 transition-colors sm:px-4 sm:py-2"
        >
          <Add className="text-sm sm:text-base" />
          <span className="hidden sm:inline">Add User</span>
        </button>

        {/* Filter by Role Button */}
        <button
          onClick={(e) => setSortMenuAnchor(e.currentTarget)}
          className="flex items-center justify-center bg-teal-600 text-white px-2 py-2 rounded hover:bg-teal-500 transition-colors sm:px-4 sm:py-2"
        >
          <Sort className="text-sm sm:text-base" />
          <span className="hidden sm:inline">Filter by Role</span>
        </button>

        {/* Filter by Status Button */}
        <button
          onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
          className="flex items-center justify-center bg-teal-600 text-white px-2 py-2 rounded hover:bg-teal-500 transition-colors sm:px-4 sm:py-2"
        >
          <Sort className="text-sm sm:text-base" />
          <span className="hidden sm:inline">Filter by Status</span>
        </button>

        {/* Sort by Name Button */}
        <button
          onClick={(e) => setNameSortMenuAnchor(e.currentTarget)}
          className="flex items-center justify-center bg-teal-600 text-white px-2 py-2 mr-8 rounded hover:bg-teal-500 transition-colors sm:px-4 sm:py-2"
        >
          <Sort className="text-sm sm:text-base" />
          <span className="hidden sm:inline">Sort by Name</span>
        </button>
      </div>
    </div>

    {/* Sort by Role Menu */}
    <Menu
      anchorEl={sortMenuAnchor}
      open={Boolean(sortMenuAnchor)}
      onClose={() => setSortMenuAnchor(null)}
    >
      <MenuItem onClick={() => handleSortByRole("Admin")}>Admin</MenuItem>
      <MenuItem onClick={() => handleSortByRole("User")}>User</MenuItem>
      <MenuItem onClick={() => handleSortByRole("Editor")}>Editor</MenuItem>
    </Menu>

    {/* Sort by Status Menu */}
    <Menu
      anchorEl={statusMenuAnchor}
      open={Boolean(statusMenuAnchor)}
      onClose={() => setStatusMenuAnchor(null)}
    >
      <MenuItem onClick={() => handleSortByStatus(true)}>Active</MenuItem>
      <MenuItem onClick={() => handleSortByStatus(false)}>Inactive</MenuItem>
    </Menu>

    {/* Sort by Name Menu (ASC/DESC) */}
    <Menu
      anchorEl={nameSortMenuAnchor}
      open={Boolean(nameSortMenuAnchor)}
      onClose={() => setNameSortMenuAnchor(null)}
    >
      <MenuItem onClick={() => handleSortByName("asc")}>Ascending</MenuItem>
      <MenuItem onClick={() => handleSortByName("desc")}>Descending</MenuItem>
    </Menu>

    <UserTable
      users={currentUsers}
      setUsers={setUsers}
      currentUser={currentUser}
      onEdit={handleEdit}
      onDelete={handleDelete}
      currentPage={currentPage}
      usersPerPage={usersPerPage}
    />

    {/* Pagination Controls */}
<div className="flex justify-center gap-1 sm:gap-2 mt-6">
  <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    className="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600 disabled:opacity-50 sm:px-4 sm:py-2 sm:text-base"
  >
    Prev
  </button>
  {[...Array(totalPages)].map((_, index) => (
    <button
      key={index}
      onClick={() => paginate(index + 1)}
      className={`${
        currentPage === index + 1 ? "bg-blue-900" : "bg-blue-500"
      } text-white px-2 py-1 text-sm rounded hover:bg-blue-600 sm:px-4 sm:py-2 sm:text-base`}
    >
      {index + 1}
    </button>
  ))}
  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600 disabled:opacity-50 sm:px-4 sm:py-2 sm:text-base"
  >
    Next
  </button>
</div>


{modalOpen && (
  <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
    <h3 className="text-lg font-bold mb-4 text-teal-800">Add User</h3>
    {error && <div className="text-red-500 mb-4">{error}</div>}
    <form onSubmit={handleAddUser} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        value={newUser.name}
        onChange={handleInputChange}
        placeholder="Name"
        className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        required
      />
      <select
        name="role"
        value={newUser.role}
        onChange={handleInputChange}
        className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        required
      >
        <option value="">Select Role</option>
        <option value="Admin">Admin</option>
        <option value="User">User</option>
        <option value="Editor">Editor</option>
      </select>
      <input
        type="text"
        name="permissions"
        value={newUser.permissions}
        onChange={handleInputChange}
        placeholder="Permissions (comma separated)"
        className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => setModalOpen(false)}
          disabled={loading}
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

export default UsersPage;

