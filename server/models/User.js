const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number, default: null },
  role: { type: Number, default: 0 },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  pfp: { type: String },
  bio: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Favorites" }],
  ownedGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
  developedGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

module.exports = mongoose.model("User", UserSchema);
