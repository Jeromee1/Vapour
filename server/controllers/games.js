const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
const Review = require("../models/Review");
const Wishlist = require("../models/Wishlist");
const isAuth = require("../middleware/auth");
const isDev = require("../middleware/developer");
const isAdmin = require("../middleware/admin");

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

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 6,
  },
});

//Get all games
router.get("/", async (req, res) => {
  try {
    const games = await Game.find()
      .populate("favorites")
      .populate("wishlist")
      .populate("theme")
      .populate("developer", "username");
    return res.json(games);
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot get all games" });
  }
});

//Get game
router.get("/:id", async (req, res) => {
  try {
    let game = await Game.findById(req.params.id)
      .populate("reviews")
      .populate("wishlist")
      .populate("favorites")
      .populate("theme")
      .populate("developer", "username");
    return res.json(game);
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot get this game" });
  }
});

// Dev game add
router.post(
  "/",
  isAuth,
  isDev,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "subImg1", maxCount: 1 },
    { name: "subImg2", maxCount: 1 },
    { name: "subImg3", maxCount: 1 },
    { name: "subImg4", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files;
      const {
        title,
        description,
        price,
        genre,
        video,
        onSale,
        sales,
        favorites,
        releaseDate,
        earlyAccess,
        isActive,
        featured,
        featuredOnBanner,
        age,
        theme,
      } = req.body;

      const game = new Game({
        title,
        description,
        price,
        image: {
          banner: files?.banner?.[0]?.filename,
          thumbnail: files?.thumbnail?.[0]?.filename,
          subImg1: files?.subImg1?.[0]?.filename,
          subImg2: files?.subImg2?.[0]?.filename,
          subImg3: files?.subImg3?.[0]?.filename,
          subImg4: files?.subImg4?.[0]?.filename,
        },
        video,
        genre: genre?.split(",") || [],
        onSale,
        sales,
        favorites,
        developer: req.user._id,
        releaseDate: releaseDate || Date.now(),
        earlyAccess,
        isActive,
        featured,
        featuredOnBanner,
        age,
        theme,
      });

      await game.save();

      await User.findByIdAndUpdate(req.user._id, { $push: { developedGames: game._id } }, { new: true });

      return res.json({
        msg: "Game added successfully",
        game,
      });
    } catch (e) {
      console.error("Game creation error:", e);
      return res.status(400).json({
        error: e.message,
      });
    }
  }
);

//Dev game edit
router.put(
  "/:id",
  isAuth,
  isDev,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "subImg1", maxCount: 1 },
    { name: "subImg2", maxCount: 1 },
    { name: "subImg3", maxCount: 1 },
    { name: "subImg4", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const files = req.files;
      const { title, description, price, genre, video, onSale, age, theme } = req.body;

      const existingGame = await Game.findById(id);
      if (!existingGame) {
        return res.status(404).json({ error: "Game not found" });
      }

      if (existingGame.developer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Not authorized to edit this game" });
      }

      const updateData = {
        title,
        description,
        price,
        video,
        genre: genre?.split(",") || [],
        onSale,
        age,
        theme,
      };

      if (files) {
        updateData.image = {
          ...existingGame.image,
          ...(files.banner && { banner: files.banner[0].filename }),
          ...(files.thumbnail && { thumbnail: files.thumbnail[0].filename }),
          ...(files.subImg1 && { subImg1: files.subImg1[0].filename }),
          ...(files.subImg2 && { subImg2: files.subImg2[0].filename }),
          ...(files.subImg3 && { subImg3: files.subImg3[0].filename }),
          ...(files.subImg4 && { subImg4: files.subImg4[0].filename }),
        };
      }

      const updatedGame = await Game.findByIdAndUpdate(id, updateData, { new: true });

      return res.json({
        msg: "Game updated successfully",
        game: updatedGame,
      });
    } catch (e) {
      console.error("Game update error:", e);
      return res.status(400).json({
        error: e.message,
      });
    }
  }
);

//Game status change
router.patch("/status/:id", isAuth, isDev, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(400).json({ msg: "No game found" });
    } else {
      await Game.findByIdAndUpdate(
        req.params.id,
        {
          $set: { isActive: !game.isActive },
        },
        { new: true }
      );
      return res.json({ msg: "Game status updated" });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot update status" });
  }
});

//Admin game featured
router.patch("/featured/:id", isAuth, isAdmin, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(400).json({ msg: "No game found" });
    } else {
      await Game.findByIdAndUpdate(
        req.params.id,
        {
          $set: { featured: !game.featured },
        },
        { new: true }
      );
      return res.json({ msg: "Game is being featured" });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot update" });
  }
});

//Admin game featured on banner
router.patch("/featuredOnBanner/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(400).json({ msg: "No game found" });
    }

    await Game.updateMany(
      { _id: { $ne: req.params.id }, featuredOnBanner: true },
      { $set: { featuredOnBanner: false } }
    );

    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      {
        $set: { featuredOnBanner: !game.featuredOnBanner },
      },
      { new: true }
    );

    return res.json({ msg: "Game is being featured on banner", game: updatedGame });
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot update" });
  }
});

router.patch("/earlyAccess/:id", isAuth, isDev, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(400).json({ msg: "No game found" });
    } else {
      await Game.findByIdAndUpdate(
        req.params.id,
        {
          $set: { earlyAccess: !game.earlyAccess },
        },
        { new: true }
      );
      return res.json({ msg: "Early Access status updated" });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Cannot update" });
  }
});

//Dev delete
router.delete("/:id", isAuth, isDev, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(400).json({ msg: "Game doesn't exist" });

    const imageFields = [
      game.image.banner,
      game.image.thumbnail,
      game.image.subImg1,
      game.image.subImg2,
      game.image.subImg3,
      game.image.subImg4,
    ];

    imageFields.forEach((file) => {
      if (file) {
        const filePath = path.join(__dirname, "../public", file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    await Game.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Game Deleted Successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message, msg: "Couldn't delete ts pmo" });
  }
});

module.exports = router;
