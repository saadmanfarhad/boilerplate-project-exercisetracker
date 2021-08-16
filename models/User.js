const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, uniq: true, required: true },
  createdAt: Date,
});

mongoose.model("users", userSchema);
