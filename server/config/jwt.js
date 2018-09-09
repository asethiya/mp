const config = require('./env');
const jwt = require('express-jwt');

const authenticate = jwt({
  secret: config.jwtSecret
});

module.exports = authenticate;