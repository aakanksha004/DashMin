import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material"; // MUI components
import { Doughnut, Bar } from "react-chartjs-2"; // Chart.js components
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = ({ isSidebarOpen }) => {
  const [userCount, setUserCount] = useState(0); // State for total users
  const [activeUserCount, setActiveUserCount] = useState(0); // State for active users
  const [inactiveUserCount, setInactiveUserCount] = useState(0); // State for inactive users
  const [roleDistribution, setRoleDistribution] = useState({}); // State for role counts
  const [chartSize, setChartSize] = useState("100%"); // Default chart size for responsiveness
  const [isStacked, setIsStacked] = useState(false); // State to check if charts are stacked

  // Fetch data from the db.json API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/users"); // Adjust the API URL as needed
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();

        // Set user count
        setUserCount(data.length);

        // Calculate active user count
        const activeUsers = data.filter((user) => user.status === true);
        setActiveUserCount(activeUsers.length);

        // Calculate inactive user count
        const inactiveUsers = data.filter((user) => user.status === false);
        setInactiveUserCount(inactiveUsers.length);

        // Calculate role distribution
        const roleCounts = data.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});
        setRoleDistribution(roleCounts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Handle screen resize to adjust chart size and layout
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChartSize("100%"); // Make charts take full width on mobile/tablet
        setIsStacked(true); // Stacked layout for small screens
      } else {
        setChartSize("80%"); // Default chart size for larger screens
        setIsStacked(false); // Side-by-side layout for larger screens
      }
    };

    // Listen to window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Re-run whenever screen size changes

  // Prepare role distribution data for the chart
  const roleLabels = Object.keys(roleDistribution);
  const roleData = Object.values(roleDistribution);
  const roleColors = ["#bbf564", "#fa8ca6", "#97deaf", "#e91e63", "#9c27b0"]; // Example colors

  const doughnutData = {
    labels: roleLabels,
    datasets: [
      {
        data: roleData,
        backgroundColor: roleColors,
        hoverBackgroundColor: roleColors.map((color) => `${color}b3`), // Slightly darker on hover
      },
    ],
  };

  // Bar chart data for active and inactive users
  const barChartData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        label: "User Count",
        data: [activeUserCount, inactiveUserCount],
        backgroundColor: ["#74d698", "#fa5757"], // Green for active, Red for inactive
        borderColor: ["#74d698", "#fa5757"],
        borderWidth: 1,
        barThickness: 60, // Thinner bars for better appearance
      },
    ],
  };

  // Data for cards
  const cardsData = [
    { title: "Users", value: userCount, color: "#659e91" },
    { title: "Active Users", value: activeUserCount, color: "#6e8cb8" },
    { title: "Inactive Users", value: inactiveUserCount, color: "#ab80a6" },
    { title: "Roles", value: roleLabels.length, color: "#a7a0fa" },
  ];

  return (
    <div
      className="p-6 bg-gray-100 min-h-screen"
      style={{ marginLeft: "0" }} // No more margin-left applied
    >
      <Typography variant="h4" gutterBottom className="text-center text-teal-800 font-bold mb-6">
        Dashboard
      </Typography>

      {/* Cards Section */}
      <Grid container spacing={2} className="mb-8">
        {cardsData.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card style={{ backgroundColor: card.color, color: "#fff", height: "100%" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="h4">{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Graphs Section */}
      <Grid container spacing={2}>
        {/* Doughnut chart */}
        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Role Distribution
              </Typography>
              <div
                style={{
                  width: chartSize, // Dynamic chart size
                  margin: "0 auto",
                  transition: "width 0.3s ease-in-out", // Smooth resizing transition
                  height: isStacked ? "auto" : "400px", // Adjust height when stacked
                }}
              >
                <Doughnut data={doughnutData} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar chart */}
        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active vs Inactive Users
              </Typography>
              <div
                style={{
                  width: chartSize, // Dynamic chart size
                  margin: "0 auto",
                  height: "400px",
                  transition: "width 0.3s ease-in-out", // Smooth resizing transition
                }}
              >
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false, // Ensures that the chart fills the container
                    scales: {
                      x: {
                        // Adjust the spacing of bars
                        barThickness: 30, // Adjust the width of the bars
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
