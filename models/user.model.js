const mongoose = require("mongoose");
const { Schema, model } = mongoose;


//! Models for DB, urlData ref to "Url"
const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  urlData: [{ type: Schema.Types.ObjectId, ref: "Url" }],

});

module.exports = model("User", userSchema);
