const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Game = require("../models/Game");
const isAuth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

//get all orders by the user
router.get("/", isAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate({
      path: "items.game",
      select: "name price image",
    });
    return res.json(orders);
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Could not get orders" });
  }
});

//get all orders by the admin
router.get("/all", isAuth, isAdmin, async (req, res) => {
  try {
    let orders = await Order.find().populate({
      path: "items.game",
      select: "id name price image.thumbnail",
    });
    return res.json(orders);
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot get all orders" });
  }
});

function roundTo2(num) {
  return Math.round(num * 100) / 100;
}

router.post("/", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.game");
    if (!cart) return res.status(400).json({ msg: "No cart found" });

    const myOrder = await Order.create({
      user: req.user._id,
      total: cart.items.reduce((acc, item) => {
        const discount = item.game.onSale > 0 ? (item.game.price * item.game.onSale) / 100 : 0;
        const finalPrice = item.game.price - discount;
        return acc + roundTo2(finalPrice);
      }, 0),
      items: cart.items.map((item) => {
        const discount = item.game.onSale > 0 ? (item.game.price * item.game.onSale) / 100 : 0;
        const finalPrice = item.game.price - discount;
        return {
          game: item.game._id,
          price: roundTo2(finalPrice),
        };
      }),
    });

    await Cart.findByIdAndDelete(cart._id);

    const gameIds = cart.items.map((item) => item.game._id);
    const newGameIds = gameIds.filter((id) => !user.ownedGames.some((ownedId) => ownedId === id));

    user.ownedGames.push(...newGameIds);
    await user.save();

    for (const item of cart.items) {
      await Game.findByIdAndUpdate(item.game._id, {
        $inc: { sales: 1 },
      });
    }

    return res.json({ msg: "Checkout Successful", order: myOrder });
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot create an order" });
  }
});

router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    const user = await User.findById(req.user._id);

    order.items.forEach((item) => {
      user.ownedGames = user.ownedGames.filter((gameId) => gameId.toString() !== item.game.toString());
    });

    await user.save();

    return res.json({ msg: "Order and owned games updated", order });
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Failed to delete order" });
  }
});

module.exports = router;
