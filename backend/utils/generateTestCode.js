const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique test code
 * Format: TEST-XXXXXXXX (8 random characters)
 */
function generateTestCode() {
  const uuid = uuidv4().replace(/-/g, '').toUpperCase();
  return `TEST-${uuid.substring(0, 8)}`;
}

/**
 * Validate test code format
 */
function isValidTestCode(code) {
  const regex = /^TEST-[A-Z0-9]{8}$/;
  return regex.test(code);
}

module.exports = {
  generateTestCode,
  isValidTestCode
};