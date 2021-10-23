'use strict';

// Activating express 
const express = require('express');
const authRouter = express.Router();

const forbidden = require('../error-handlers/403.js');

// Auth
const basicAuth = require('../middleware/basic.js');
const bearerAuth = require('../middleware/bearer.js');
const acl = require('../middleware/acl.js');

// Models
const dataModules = require('../models/index.js');

// CRUD Models for every Model we have
authRouter.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    // forbidden
    next('What do you call a fake noodle? An impasta');
  }
});

authRouter.get('/:model', handleGetAll); // get jokes without loggin in
authRouter.get('/:model/all', bearerAuth, acl('read'), handleGetAllJokes); // get jokes with hooks while logged in
authRouter.get('/:model/:id', bearerAuth, acl('read'), handleGetOne);
authRouter.post('/:model', bearerAuth, acl('update'), handleCreate);
authRouter.put('/:model/:id', bearerAuth, acl('update'), handleUpdate);
authRouter.delete('/:model/:id', bearerAuth, acl('delete'), handleDelete);

async function handleGetAll(req, res) {
  try {
    let jokes = await req.model.read();
    let jokesArray = jokes.map(element => {
      // console.log('Name',element.dataValues.name)
      // console.log('Set Up',element.dataValues.setup)
      return { name: element.dataValues.name,
       setup: element.dataValues.setup}
    })
    console.log('Jokes Array: ----',jokesArray)
    // console.log('jokes', jokes[1].dataValues)
    res.status(200).json(jokesArray);
  } catch (e) {
    res.status(404).send('Could not get all the jokes');
  }
}

async function handleGetAllJokes(req, res) {
  try {
    let jokes = await req.model.read();
    let jokesArray = jokes.map(element => {
      // console.log('Name',element.dataValues.name)
      // console.log('Set Up',element.dataValues.setup)
      return { name: element.dataValues.name,
       setup: element.dataValues.setup,
      punchline: element.dataValues.punchline}
    })
    res.status(200).json(jokesArray);
  } catch(e) {
    res.status(404).send('Could not get all the jokes with hooks')
  }
}

async function handleGetOne(req, res) {
  try {
    let id = req.params.id;
    let jokes = await req.model.read(id);
    res.status(200).json(jokes);
  } catch (e) {
    res.status(404).send('Could not get one joke');
  }
}

async function handleCreate(req, res) {
  try {
    const obj = req.body;
    let jokes = await req.model.create(obj);
    res.status(200).json(jokes);
  } catch (e) {
    res.status(404).send('Could not create a joke');
  }
}

async function handleUpdate(req, res) {
  try {
    let id = req.params.id;
    const obj = req.body;
    let jokes = await req.model.update(id, obj);
    res.status(200).json(jokes);
  } catch (e) {
    res.status(404).send('Could not update a joke');
  }
}

async function handleDelete(req, res) {
  try {
    let id = req.params.id;
    let jokes = await req.model.delete(id);
    res.status(200).json(jokes);
  } catch (e) {
    res.status(404).send('Could not delete a joke');
  }
}

module.exports = authRouter;

/* 
User1 -> { "username":"Krissy", "password": "BestGurl", "role": "admin"}
  - Basic a3Jpc3N5OkJlc3RHdXJs
  - Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtyaXNzeSIsImlhdCI6MTYzNDc4MzA2N30.4ZbK1LFWW4Fr0LjLQX-eU3MrQ_MyBJU2RUJLhVG6_qQ

  { "username": "Billy", "password": "Bob" }
  - Basic QmlsbHk6Qm9i
  - Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJpbGx5IiwiaWF0IjoxNjM0NDMwNjUyfQ.ODjmQyIuDBO0K3m7HXw3U4HDP2wpZ_a6I2Pv74kculs

  { "username":"cakeViewer", "password": "cake", "role": "user" }
    - Basic Y2FrZVZpZXdlcjpjYWtl
    - Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNha2VWaWV3ZXIiLCJpYXQiOjE2MzQ3ODY3NTh9.yQwkPGu5d_ivatcWACGsedIgTVnA1FOPmPLLsfXQKR8

  { "username":"cakeViewer3", "password": "cake", "role": "editor" }
  - Basic Y2FrZVZpZXdlcjM6Y2FrZQ==
  - Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNha2VWaWV3ZXIzIiwiaWF0IjoxNjM1MDI0NzI0fQ.kLsCOqDznW4YFoSCKYnaNWVtvhQSlKD0TPie3btdj_g
*/
