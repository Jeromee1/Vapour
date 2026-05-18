const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Friend = require("../models/Friend");
const isAuth = require("../middleware/auth");

router.get("/requests/all", async (req, res) => {
  try {
    const friends = await Friend.find();
    return res.json(friends);
  } catch (e) {
    console.error(e);
    return res.status(404).json({ msg: "Could not get all friends" });
  }
});

//fetch friends
router.get("/", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json(user.friends);
  } catch (e) {
    return res.status(400).json({ msg: "Could not get friends" });
  }
});

//fetch friend requests
router.get("/requestsIn", isAuth, async (req, res) => {
  try {
    const friendRequests = await Friend.find({
      receive: req.user._id,
    })
      .populate("request", "_id username pfp")
      .sort({ requestedAt: -1 });

    res.status(200).json(friendRequests);
  } catch (e) {
    console.error("Error fetching friend requests:", e);
    return res.status(400).json({ msg: "Could not get requests" });
  }
});

router.get("/requestsOut", isAuth, async (req, res) => {
  try {
    const friendRequests = await Friend.find({
      request: req.user._id,
    })
      .populate("receive", "_id username pfp")
      .sort({ requestedAt: -1 });

    res.status(200).json(friendRequests);
  } catch (e) {
    console.error("Error fetching friend requests:", e);
    return res.status(400).json({ msg: "Could not get requests" });
  }
});

router.post("/", isAuth, async (req, res) => {
  try {
    const sentUser = await User.findById(req.body.userId);

    if (!sentUser) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (sentUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ msg: "Bro what" });
    }

    const friendRequestExists = await Friend.findOne({
      request: req.user._id,
      receive: sentUser._id,
    });

    if (friendRequestExists) {
      return res.status(400).json({ msg: "You have already sent this user a friend request" });
    }

    const addFriend = await Friend.create({
      request: req.user._id,
      receive: sentUser._id,
    });

    return res.json(addFriend);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ msg: "Failed to send friend request" });
  }
});

//remove friend
router.patch("/:id", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.id;

    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } }, { new: true });

    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } }, { new: true });

    return res.json({ msg: "Unfriended successfully" });
  } catch (e) {
    return res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/all", async (req, res) => {
  try {
    await Friend.deleteMany({});
    return res.json({ msg: "All friend requests deleted" });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ msg: "Failed to delete all friend requests" });
  }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const friendRequest = await Friend.findById(req.params.id);
    if (!friendRequest) {
      return res.status(404).json({ msg: "Friend request not found" });
    }

    if (friendRequest.receive != req.user._id) {
      return res.status(403).json({ msg: "Not authorized to handle this request" });
    }

    if (req.body.requestStatus === "accepted") {
      await User.findByIdAndUpdate(friendRequest.receive, { $addToSet: { friends: friendRequest.request } });

      await User.findByIdAndUpdate(friendRequest.request, { $addToSet: { friends: friendRequest.receive } });

      await Friend.findByIdAndDelete(req.params.id);
      return res.json({ msg: "Friend request accepted" });
    }

    if (req.body.requestStatus === "declined") {
      await Friend.findByIdAndDelete(req.params.id);
      return res.json({ msg: "Friend request declined" });
    }

    return res.status(400).json({ msg: "Invalid request status" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
