'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Middleware
const accessControl = require('./middleware/acl.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');

// Error handlers
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');

// Prepare the express app
const app = express();

// Using middleware
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const routes = require('./routes/routes.js');
const apiRoutes = require('./routes/apiRoutes.js');

// Use routes
app.use(routes);
app.use(apiRoutes);


// Catchalls
app.use(notFound);
app.use(errorHandler);

// Start
const start = (port) => {
  app.listen(port, () => {
    console.log(`Server Up on ${port}`);
  });
}

module.exports = {
    server: app,
    start: start
};