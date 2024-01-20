const { NO_ACCESS_ERROR_CODE } = require('../utils/constants');

class ForbiddenError extends Error { // NoAccessError
  constructor(message) {
    super(message);
    this.statusCode = NO_ACCESS_ERROR_CODE; // 403
  }
}

module.exports = ForbiddenError;
