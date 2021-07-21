const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlengh: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.objectId().min(5).max(50).required(),
  });
  return schema.validate(genre, schema);
}
exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;
