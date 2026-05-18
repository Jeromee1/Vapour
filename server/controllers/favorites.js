const express = require("express");
const router = express.Router();
const Favorites = require("../models/Favorites");
const User = require("../models/User");
const Game = require("../models/Game");
const isAuth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const favorites = await Favorites.find();
    return res.json(favorites);
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot get all favorites" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const favorites = await Favorites.findById(req.params.id);
    return res.json(favorites);
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot get user's favorites" });
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

    const existingFav = await Favorites.findOne({
      user: userId,
      game: gameId,
    });

    if (existingFav) {
      await Promise.all([
        Game.findByIdAndUpdate(gameId, { $pull: { favorites: existingFav._id } }),
        User.findByIdAndUpdate(userId, { $pull: { favorites: existingFav._id } }),
        Favorites.findByIdAndDelete(existingFav._id),
      ]);

      return res.json({ msg: "Removed from Favorites" });
    } else {
      const favorite = new Favorites({ user: userId, game: gameId });
      await favorite.save();

      await Promise.all([
        Game.findByIdAndUpdate(gameId, { $push: { favorites: favorite._id } }),
        User.findByIdAndUpdate(userId, { $push: { favorites: favorite._id } }),
      ]);

      return res.json({ msg: "Added to Favorites" });
    }
  } catch (e) {
    console.error("Favorites error:", e);
    return res.status(500).json({ msg: "Error processing favorite action" });
  }
});

module.exports = router;
