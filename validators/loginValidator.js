const yup = require("yup");

const loginSchema = yup.object().shape({
  email: yup.string().email().min(3).max(255),
  password: yup.string().min(3).max(255),
});

module.exports = loginSchema;
