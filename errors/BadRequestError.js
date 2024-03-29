const { BAD_REQUEST_ERROR_CODE } = require('../utils/constants');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_ERROR_CODE; // 400
  }
}

module.exports = BadRequestError;
