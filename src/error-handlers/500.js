'use strict';

module.exports = (err, req, res, next) => {
  let errorHandle = { status: err.status,
   error: err.message || err };
  res.statusCode = err.status || 500;
  res.statusMessage = err.statusMessage || 'What do you call a fake noodle? An impasta.';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(errorHandle));
  res.end();
};