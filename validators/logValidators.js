const yup = require("yup");

const logSchema = yup.object().shape({
  body: yup.string().min(0).max(160),
  phoneNumber: yup.string().min(10).max(10),
});

module.exports = logSchema;
