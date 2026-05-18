const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isAuth = require("../middleware/auth");
const User = require("../models/User");
const Game = require("../models/Game");
const Friend = require("../models/Friend");
const Favorites = require("../models/Favorites");
const Wishlist = require("../models/Wishlist");
const Order = require("../models/Order");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

require("dotenv").config();
const { SECRET_KEY } = process.env;

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let userFound = await User.findOne({ email, username });

    if (userFound) return res.status(400).json({ msg: "User already exists" });

    let salt = bcrypt.genSaltSync(12);
    let hashedPassword = bcrypt.hashSync(password, salt);

    let user = new User({ ...req.body, password: hashedPassword });
    user.save();
    return res.json({ msg: "Registered Successfully", user });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    let user = await User.findOne({ username });

    if (!user) return res.status(400).json({ msg: "User doesn't exist" });

    let isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    let token = jwt.sign(
      {
        data: {
          _id: user._id,
          username: user.username,
          role: user.role,
          email: user.email,
        },
      },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ user, msg: "Logged in Successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .populate("favorites")
      .populate({ path: "ownedGames", model: "Game", select: "id title image.thumbnail" })
      .populate("friends", "id username pfp")
      .populate("wishlist", "id")
      .populate("reviews")
      .populate({
        path: "developedGames",
        model: "Game",
        select: "title",
      });
    return res.json(users);
  } catch (e) {
    return res.json({ msg: "Users not found" });
  }
});

router.get("/me", isAuth, async (req, res) => {
  try {
    const users = await User.findById(req.user._id)
      .populate("favorites")
      .populate("friends", "id username pfp")
      .populate("wishlist")
      .populate("reviews")
      .populate({
        path: "developedGames",
        model: "Game",
      });
    return res.json(users);
  } catch (e) {
    return res.json({ msg: "User not found" });
  }
});

router.get("/auth/me", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("_id username role email pfp");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Error in /auth/me:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const users = await User.findById(req.params.id).populate({
      path: "developedGames",
      model: "Game",
      select: "title",
    });
    return res.json(users);
  } catch (e) {
    return res.json({ msg: "User not found" });
  }
});

router.put("/", isAuth, upload.single("pfp"), async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullname, username, bio, age } = req.body;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = { fullname, username, bio, age };

    if (req.file) {
      if (existingUser.pfp) {
        const oldPath = path.join(__dirname, "../public", existingUser.pfp);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log("Old image deleted successfully");
        } else {
          console.log("Old image not found at path");
        }
      }

      updateData.pfp = req.file.filename;
      console.log("New PFP filename:", req.file.filename);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    return res.json(updatedUser);
  } catch (e) {
    console.error("Full error:", e);
    return res.status(500).json({ error: e.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ msg: "Logged out" });
});

module.exports = router;
