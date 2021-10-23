'use strict';

module.exports = (req, res, next) => {
  let error = { error: 'Try again!' };
  res.statusCode = 404;
  res.statusMessage = 'I made a pencil with two erasers. It was pointless.';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
};