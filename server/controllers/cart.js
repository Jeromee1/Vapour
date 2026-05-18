const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const Cart = require("../models/Cart");
const isAuth = require("../middleware/auth");

router.post("/", isAuth, async (req, res) => {
  try {
    const { gameId } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ game: gameId }],
      });
      return res.status(201).json({
        success: true,
        message: "Item added to new cart",
        cart,
      });
    }

    const itemExists = cart.items.some((item) => item.game.toString() === gameId);

    if (itemExists) {
      return res.status(400).json({
        success: false,
        message: "Item already in cart",
      });
    }

    cart.items.push({ game: gameId });
    await cart.save();

    return res.json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("Cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.get("/", isAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.game");
    return res.json(cart);
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot get your cart" });
  }
});

router.delete("/", isAuth, async (req, res) => {
  try {
    let cart = await Cart.findOneAndDelete({ user: req.user._id });
    return res.json({ msg: "Successfully cleared cart", cart });
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Failed to empty cart" });
  }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    cart.items = cart.items.filter((item) => item.game != req.params.id);

    if (cart.items.length) {
      await cart.save();
      return res.json({ msg: "Cart item was deleted" });
    } else {
      await Cart.findOneAndDelete({ user: req.user._id });
      return res.json({ msg: "Cart is now empty" });
    }

    return res.json({ msg: "Product has been removed from cart" });
  } catch (e) {
    return res.status(400).json({ msg: "failed to remove item" });
  }
});

module.exports = router;
