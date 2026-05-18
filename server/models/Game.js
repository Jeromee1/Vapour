const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  price: { type: Number, default: "0" },
  image: {
    banner: { type: String },
    thumbnail: { type: String },
    subImg1: { type: String },
    subImg2: { type: String },
    subImg3: { type: String },
    subImg4: { type: String },
  },
  video: { type: String },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }],
  genre: [{ type: String }],
  onSale: { type: Number, default: "0" },
  sales: { type: Number, default: "0" },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Favorites" }],
  developer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  releaseDate: { type: Date },
  earlyAccess: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  featuredOnBanner: { type: Boolean, default: false },
  age: { type: Number, default: "0" },
  theme: { type: Number, default: "0" },
});

module.exports = mongoose.model("Game", GameSchema);
