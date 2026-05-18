module.exports = (req, res, next) => {
  try {
    if (req.user.role >= 1) {
      next();
    } else {
      return res.status(401).json({ msg: "T - You are not a developer" });
    }
  } catch (e) {
    return res.status(401).json({ error: e.message, msg: "You are not a developer" });
  }
};
