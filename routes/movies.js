const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Movie, validate } = require("../modules/movie");
const { Genre } = require("../modules/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});
router.post("/", async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = new Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("invalid genre");
  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();
});
router.put("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);

  if (!genre) return res.status(400).send("invalid genres");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true },
  );
  if (!movie) return res.status(404).send("The movie with the given ID was not found.");
  res.send(movie);
});

router.delete("/", async (req, res) => {
  if (!movie) return res.status(404).send("The movie with the given ID was not found.");

  const movie = await Movie.findByIdAndremove(req.params.id);

  res.send(movie);
});
module.exports = router;
