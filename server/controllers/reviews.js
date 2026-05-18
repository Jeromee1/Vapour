const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/auth");
const Review = require("../models/Review");
const User = require("../models/User");
const Game = require("../models/Game");

router.get("/all", async (req, res) => {
  try {
    const reviews = await Review.find();
    return res.json(reviews);
  } catch (e) {
    return res.status(400).json({ msg: "Could not get reviews" });
  }
});

//get game reviews
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    const reviews = await Review.find().populate("user", "id username pfp");

    const gameReviews = reviews.filter((review) => review.game.equals(game._id));

    return res.json(gameReviews);
  } catch (e) {
    return res.status(400).json({ msg: "Could not get reviews" });
  }
});

router.post("/:id", isAuth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ msg: "Game not found" });
    }

    const review = await Review.create({
      user: req.user._id,
      game: game._id,
      recommended: req.body.recommended,
      message: req.body.message,
    });

    await Game.findByIdAndUpdate(game._id, {
      $push: { reviews: review._id },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { reviews: review._id },
    });

    return res.json(review);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ msg: "Could not create review", e });
  }
});

router.put("/:id", isAuth, async (req, res) => {
  try {
    const review = Review.findById(req.params.id);
  } catch (e) {
    return res.status(400).json({ msg: "Could not update review", e });
  }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    if (!review.user.equals(req.user._id)) {
      return res.status(400).json({ msg: "Not your comment" });
    }

    await Review.findByIdAndDelete(req.params.id);

    await Game.findByIdAndUpdate(review.game, {
      $pull: { reviews: review._id },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { reviews: review._id },
    });

    return res.json({ msg: "Review deleted" });
  } catch (e) {
    return res.status(400).json({ msg: "Could not delete review", e });
  }
});

module.exports = router;
