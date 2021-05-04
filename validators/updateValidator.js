const yup = require("yup");

const updateSchema = yup.object().shape({
  email: yup.string().email().min(3).max(255),
  password: yup.string().min(3).max(255),
  fullname: yup.string().min(3).max(255),
  role: yup.string(),
  id: yup.string(),
});

module.exports = updateSchema;
