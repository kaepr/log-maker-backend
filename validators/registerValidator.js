const yup = require("yup");

const registerSchema = yup.object().shape({
  email: yup.string().email().min(3).max(255),
  password: yup.string().min(3).max(255),
  confirmpassword: yup.string().min(3).max(255),
  fullname: yup.string().min(3).max(255),
  role: yup.string(),
});

module.exports = registerSchema;
