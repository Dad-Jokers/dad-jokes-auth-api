'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js')

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { next('What do you call someone with no body and no nose? Nobody knows.') }

  let basic = req.headers.authorization.split(' ').pop();
  let [username, pass] = base64.decode(basic).split(':');

  try {
    let result = await users.authenticateBasic(username, pass);
    req.user = result;
    next();
  } catch (e) {
    res.status(403).send('What’s Forrest Gump’s password? 1forrest1');
  }

}

