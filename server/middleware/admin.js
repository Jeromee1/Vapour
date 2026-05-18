module.exports = (req, res, next) => {
  try {
    if (req.user.role === 2) {
      next();
    } else {
      return res.status(401).json({ msg: "T - You are not an admin" });
    }
  } catch (e) {
    return res.status(401).json({ error: e.message, msg: "You are not an admin" });
  }
};
