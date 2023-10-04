// Import 
const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// Call port to make requests
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
  });
});