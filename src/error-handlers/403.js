'use strict';

module.exports = (req, res, next) => {
    let forbidden = { error: 'Come back when you have some more cheese!' };
    res.statusCode = 403;
    res.statusMessage = 'What do you call cheese that isn’t yours? Nacho cheese.';
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(error));
    res.end();
};