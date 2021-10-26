'use strict';

module.exports = (capability) => {

  return (req, res, next) => {
    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      }
      else {
        next('I tell dad jokes, but I don’t have any kids. I’m a faux pa.');
      }
    } catch (e) {
      next('I would avoid the sushi if I was you. It’s a little fishy.');
    }
  }
}
