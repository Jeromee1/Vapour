const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  total: { type: Number },
  purchased_date: { type: Date, default: Date.now },
  items: [
    {
      game: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
      _id: false,
    },
  ],
});

module.exports = mongoose.model("Order", OrderSchema);
