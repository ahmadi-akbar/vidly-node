const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlengh: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlengh: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlengh: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.objectId().min(5).max(50).required(),
    email: Joi.objectId().min(5).max(255).required().email(),
    password: Joi.objectId().min(5).max(255).required(),
  });
  return schema.validate(user);
}
exports.User = User;
exports.validate = validateUser;
