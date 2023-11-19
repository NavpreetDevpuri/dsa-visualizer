// server.js
const express = require('express');
const app = express();
const port = 5500;
const host = '0.0.0.0';

// Sample data for the graph

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});
