module.exports = function (req, res, next) {
  // authMiddleware must run BEFORE this for req.user to exist
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: "Access denied. Admin privileges required." });
  }
};