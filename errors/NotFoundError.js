const { NOT_FOUND_ERROR_CODE } = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR_CODE; // 404
  }
}

module.exports = NotFoundError;
