'use strict';

const { users } = require('../models/index.js');


module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization) { next('I don’t trust stairs. They’re always up to something.') }

    const token = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateToken(token);
    req.user = validUser;
    req.token = validUser.token;
    next();
  } catch (e) {
    res.status(403).send('What do you call cheese that isn’t yours? Nacho cheese. Come back when you have some more cheese!');;
  }
}