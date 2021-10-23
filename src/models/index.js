'use strict';

require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./users.js');
const jokeModel = require('./jokes.js');
const Collection = require('./collections.js');

const DATABASE_URL = process.env.DATABASE_URL === 'test' 
? 'sqlite"memory' : process.env.DATABASE_URL;

const sequelizeOptions = process.env.NODE_ENV === 'production' ? {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  } : {}

const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);

const jokeSchema = jokeModel(sequelize, DataTypes);
const jokeCollection = new Collection(jokeSchema);

module.exports = {
    db: sequelize,
    users: userModel(sequelize, DataTypes),
    jokes: jokeCollection
};
