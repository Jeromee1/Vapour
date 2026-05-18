const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  game: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
  recommended: { type: Boolean, required: true },
  message: { type: String },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", ReviewSchema);
