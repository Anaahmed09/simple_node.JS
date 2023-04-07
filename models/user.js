const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firsName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  token: { type: String },
});
module.exports = mongoose.model("user", userSchema);
