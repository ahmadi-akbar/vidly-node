module.exports = function (req, res) {
  if (!req.user.isAdmin) return res.status(403).send("Access Denied.");
  next();
};
