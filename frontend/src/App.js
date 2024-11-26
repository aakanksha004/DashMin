import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import PermissionsPage from "./pages/PermissionsPage";
import { UserProvider } from "./context/UserContext";
import { RoleProvider } from "./context/RoleContext";
import Dashboard from "./pages/Dashboard";
import CalendarComponent from "./pages/CalendarComponent";
import Navbar from "./components/Navbar";
import "./styles/App.css";

const App = () => {
  
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [marginLeft, setMarginLeft] = useState("16rem");
  const [chartSize, setChartSize] = useState("80%");
  const [isStacked, setIsStacked] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    // Handle screen resize to adjust margin-left based on sidebar state and chart size
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMarginLeft("3rem"); // Set margin-left for small screens (collapsed sidebar)
        setChartSize("90%"); // Larger chart size for small screens
        setIsStacked(true); // Stacked layout for small screens
      } else if (isSidebarOpen) {
        setMarginLeft("16rem"); // Set margin-left when the sidebar is open
        setChartSize("80%"); // Default chart size for larger screens
        setIsStacked(false); // Reset to side-by-side layout for larger screens
      } else {
        setMarginLeft("3rem"); // Set margin-left for collapsed sidebar in large screens
        setChartSize("90%"); // Set chart size to 90% when sidebar is collapsed
        setIsStacked(true); // Stacked layout for collapsed sidebar
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Run once on initial render to set the proper values

    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]); // Re-run on sidebar state change

  return (
    <UserProvider>
      <RoleProvider>
        <Router>
          <div className="app">
            <Navbar toggleSidebar={toggleSidebar} />
            <div className="main-content">
              <Sidebar isSidebarOpen={isSidebarOpen} />
              <div
                className={`page-content ${isSidebarOpen ? "" : "sidebar-collapsed"}`}
                style={{ marginLeft }} // Apply dynamic margin-left based on screen size or sidebar state
              >
                <Routes>
                  <Route path="/calendar" element={<CalendarComponent />} />
                  <Route
                    path="/"
                    element={
                      <Dashboard
                        isSidebarOpen={isSidebarOpen}
                        marginLeft={marginLeft}
                        chartSize={chartSize}
                        isStacked={isStacked}
                      />
                    }
                  />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/roles" element={<RolesPage />} />
                  <Route path="/permissions" element={<PermissionsPage />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </RoleProvider>
    </UserProvider>
  );
};

export default App;

