const { INCORRECT_EMAIL_PASSWORD_ERROR_CODE } = require('../utils/constants');

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INCORRECT_EMAIL_PASSWORD_ERROR_CODE; // 401
  }
}

module.exports = AuthorizationError;
