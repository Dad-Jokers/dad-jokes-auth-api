'use strict';

const jokeModel = (sequelize, DataTypes) => sequelize.define('Jokes', {
  name: { 
    type: DataTypes.STRING, 
    required: true 
  },
  setup: { 
    type: DataTypes.STRING, 
    required: true 
  },
  punchline: { 
    type: DataTypes.STRING, 
    required: true 
  }
});

module.exports = jokeModel;