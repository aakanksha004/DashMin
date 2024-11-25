import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  PeopleAltOutlined,
  SecurityOutlined,
  AssignmentIndOutlined,
  DashboardOutlined,
  ArrowLeft,
  ArrowRight,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Updated to Calendar icon
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar open state
  const [isMobile, setIsMobile] = useState(false); // State to track screen size

  // Handle screen resize to collapse/expand sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true); // Set isMobile to true on small screens
        setIsOpen(false); // Automatically collapse sidebar on small screens
      } else {
        setIsMobile(false); // Reset for large screens
        setIsOpen(true); // Keep sidebar open on large screens
      }
    };

    // Initialize on mount
    handleResize();
    
    // Listen to window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar manually
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed top-16 left-0 h-full bg-teal-900 text-white shadow-lg transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle Button for opening/closing sidebar */}
      <div className="flex justify-end p-4">
        <IconButton onClick={toggleSidebar} className="text-white ">
          {isOpen ? (
            <ArrowLeft className="text-white " />
          ) : (
            <ArrowRight className="text-white" />
          )}
        </IconButton>
      </div>

      {/* Sidebar Navigation */}
      <ul className="mt-4">
        <li className="mb-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-teal-800 rounded ${
                isActive ? "bg-teal-700" : ""
              }`
            }
          >
            <DashboardOutlined />
            {isOpen && <span>Dashboard</span>}
          </NavLink>
        </li>
        <li className="mb-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-teal-800 rounded ${
                isActive ? "bg-teal-700" : ""
              }`
            }
          >
            <PeopleAltOutlined />
            {isOpen && <span>Users</span>}
          </NavLink>
        </li>
        <li className="mb-4">
          <NavLink
            to="/roles"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-teal-800 rounded ${
                isActive ? "bg-teal-700" : ""
              }`
            }
          >
            <AssignmentIndOutlined />
            {isOpen && <span>Roles</span>}
          </NavLink>
        </li>
        <li className="mb-4">
          <NavLink
            to="/permissions"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-teal-800 rounded ${
                isActive ? "bg-teal-700" : ""
              }`
            }
          >
            <SecurityOutlined />
            {isOpen && <span>Permissions</span>}
          </NavLink>
        </li>
        <li className="mb-4">
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-teal-800 rounded ${
                isActive ? "bg-teal-700" : ""
              }`
            }
          >
            <CalendarTodayIcon />
            {isOpen && <span>Calendar</span>} {/* Updated text */}
          </NavLink>
        </li>
        <li className="mb-4">
          <NavLink
            to=""
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-teal-800 rounded 
                
              `
            }
          >
            <SettingsIcon />
            {isOpen && <span>Settings</span>}
          </NavLink>
        </li>
        <li className="mb-4">
          <NavLink
            to=""
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 hover:bg-teal-800 rounded `
            }
          >
            <LogoutIcon />
            {isOpen && <span>Logout</span>}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
