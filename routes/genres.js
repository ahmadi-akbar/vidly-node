const validateObjectId = require("../middlewhere/validateObjectId");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const auth = require("../middlewhere/auth");
const admin = require("../middlewhere/admin");
const express = require("express");
const { Genre, validate } = require("../modules/genre");
const router = express.Router();
router.get("/me", async (req, res) => {
  const user = await User.findById(req.user._id).select("_password");
  res.send(user);
});

router.get("/", async (req, res) => {
  // throw new Error("could not get the genres");
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

  if (!genre) return res.status(404).send("the genre with the given Id was not found");

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send("the genre with the given Id was not found");

  res.send(genre);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send("the genre with the given Id was not found");

  res.send(genre);
});

module.exports = router;
