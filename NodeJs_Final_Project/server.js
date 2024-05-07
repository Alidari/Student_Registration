const express = require('express');
const studentRoutes = require('./src/student/routes');
const { initializeDatabase } = require('./src/student/initializeDatabase'); // Database config
const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/v1/students', studentRoutes);

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error initializing database:", error);
  });