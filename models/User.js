const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  fullname: String,
  password: String,
  email: String,
  role: String,
  createdAt: String,
});

module.exports = model("User", userSchema);
