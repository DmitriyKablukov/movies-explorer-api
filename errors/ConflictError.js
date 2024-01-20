const { CONFLICT_ERROR_CODE } = require('../utils/constants');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR_CODE; // 409
  }
}

module.exports = ConflictError;
