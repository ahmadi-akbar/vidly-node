const Joi = require("joi");

const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      minlength: 0,
      maxlength: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      minlength: 0,
      maxlength: 255,
    },
  }),
);
async function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255),
    dailyRentalRate: Joi.number().min(0).max(255),
  });
  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
