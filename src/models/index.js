'use strict';

require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./users.js');
const jokeModel = require('./jokes.js');
const Collection = require('./collections.js');

const DATABASE_URL = process.env.DATABASE_URL === 'test' 
? 'sqlite"memory' : 'postgres://localhost:5432/finalAuth';

const sequelize = new Sequelize(DATABASE_URL);

const jokeSchema = jokeModel(sequelize, DataTypes);
const jokeCollection = new Collection(jokeSchema);

module.exports = {
    db: sequelize,
    users: userModel(sequelize, DataTypes),
    jokes: jokeCollection
};
