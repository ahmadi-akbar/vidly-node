const mongoose = require("mongoose");
module.exports = function (req, res, next) {
  if (!mongoose.Types.objectId.isValid(req.params.id)) return res.status(404).send("invalid ID");

  next();
};
