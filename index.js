'use strict';

require('dotenv').config();

const PORT = process.env.PORT ? process.env.PORT : 3010;

const { db } = require('./src/models/index.js');

const server = require('./src/server.js');

db.sync()
  .then(() => {
      server.start(PORT)
  })
  .catch(console.error)
