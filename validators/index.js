const loginSchema = require("./loginValidator");
const registerSchema = require("./registerValidator");
const logSchema = require("./logValidators");
const updateSchema = require("./updateValidator");

const formatYupError = (err) => {
  const errors = [];
  err.inner.forEach((e) => {
    errors.push({
      path: e.path,
      message: e.message,
    });
  });
  return errors;
};

module.exports = {
  formatYupError,
  loginSchema,
  registerSchema,
  logSchema,
  updateSchema,
};
