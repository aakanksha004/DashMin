const express = require('express');
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const dbPath = path.join(__dirname, 'db.json');

// Read database
const readDatabase = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Write database
const writeDatabase = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Get users
app.get('/users', (req, res) => {
  const database = readDatabase();
  res.json(database.users);
});

// Add new user
app.post('/users', (req, res) => {
  const database = readDatabase();
  const newUser = req.body;

  // Generate a unique ID for the new user
  newUser.id = Date.now().toString(); // Using timestamp as unique ID
  newUser.status = true; // Default status to true

  // Add the new user to the database
  database.users.push(newUser);
  writeDatabase(database);

  res.status(201).json(newUser);
});

// Update user details
app.patch('/users/:id', (req, res) => {
  const database = readDatabase();
  const userId = req.params.id;
  const updatedData = req.body;
  const userIndex = database.users.findIndex(user => user.id === userId);

  if (userIndex !== -1) {
    // Update user data
    const updatedUser = { ...database.users[userIndex], ...updatedData };
    database.users[userIndex] = updatedUser;

    // Write updated data to the database
    writeDatabase(database);

    // Respond with updated user data
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Toggle user status
app.patch('/users/:id/status', (req, res) => {
  const database = readDatabase();
  const userId = req.params.id;
  const userIndex = database.users.findIndex(user => user.id === userId);

  if (userIndex !== -1) {
    database.users[userIndex].status = !database.users[userIndex].status;
    writeDatabase(database);
    res.json(database.users[userIndex]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

