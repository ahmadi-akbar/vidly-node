const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const { User, validate } = require("../modules/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash("1234", salt);
  await user.save();
  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send(user, ["_id", "name", "email"]);
});
module.exports = router;
