const mongoose = require("mongoose");
const { Schema } = mongoose;

const exerciseSchema = new Schema({
  description: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  date: Date,
  duration: Number,
});

mongoose.model("exercises", exerciseSchema);
