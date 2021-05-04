const { model, Schema } = require("mongoose");

const logSchema = new Schema({
  body: String,
  phoneNumber: String,
  createdAt: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Log", logSchema);
