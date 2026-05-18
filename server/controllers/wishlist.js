const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const User = require("../models/User");
const Game = require("../models/Game");
const isAuth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const wishlist = await Wishlist.find().populate("user", "username");
    return res.json(wishlist);
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot get all wishlists" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    if (!foundUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const userWishlist = await Wishlist.find({ user: foundUser._id }).populate("game");

    if (!userWishlist) {
      return res.status(404).json({ msg: "Wishlist not found for this user" });
    }

    return res.json(userWishlist);
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot get user's wishlist" });
  }
});

router.put("/", isAuth, async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user._id;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ msg: `Game not found: ${gameId}` });
    }

    const existingWish = await Wishlist.findOne({
      user: userId,
      game: gameId,
    });

    if (existingWish) {
      await Promise.all([
        Game.findByIdAndUpdate(gameId, { $pull: { wishlist: existingWish._id } }),
        User.findByIdAndUpdate(userId, { $pull: { wishlist: existingWish._id } }),
        Wishlist.findByIdAndDelete(existingWish._id),
      ]);

      return res.json({ msg: "Removed from Wishlist" });
    } else {
      const wishlist = new Wishlist({ user: userId, game: gameId });
      await wishlist.save();

      await Promise.all([
        Game.findByIdAndUpdate(gameId, { $push: { wishlist: wishlist._id } }),
        User.findByIdAndUpdate(userId, { $push: { wishlist: wishlist._id } }),
      ]);

      return res.json({ msg: "Added to Wishlist" });
    }
  } catch (e) {
    console.error("Wishlist error:", e);
    return res.status(500).json({ msg: "Error processing wishlist action" });
  }
});

module.exports = router;
