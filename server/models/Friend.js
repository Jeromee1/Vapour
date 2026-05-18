const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receive: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requestStatus: { type: String, default: "pending" },
  requestedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Friend", FriendSchema);
