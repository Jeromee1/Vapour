const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      game: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
      _id: false,
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);
