const Joi = require("joi");
const validate = require("../middlewhere/validate");
const express = require("express");
const { Rental } = require("../modules/rental");
const router = express.Router();
const auth = require("../middlewhere/auth");
const { Movie } = require("../modules/movie");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  // if (!req.body.customerId) return res.status(400).send("customer id is not provided");
  // if (!req.body.movieId) return res.status(400).send("movie id is not provided");

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if (!rental) return res.status(404).send("Rental not found");

  if (rental.dateReturned) return res.status(400).send("Return already processed.");

  rental.return();
  await rental.save();
  await Movie.update({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } });
  return res.status(200).send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req, schema);
}
module.exports = router;
