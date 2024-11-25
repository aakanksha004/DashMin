const express = require('express');
try {
  const jsonServer = require('json-server');
  console.log('json-server successfully loaded');
} catch (err) {
  console.log('Error loading json-server:', err.message);
}

const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Use default middlewares (CORS, static files, etc.)
app.use(middlewares);

// Serve your API from db.json
app.use('/api', router);

// Serve frontend static files (for production)
app.use(express.static(path.join(__dirname, 'build')));



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
