const mongoose = require("mongoose");

const FavoritesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  game: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
  favoriteSince: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Favorites", FavoritesSchema);
