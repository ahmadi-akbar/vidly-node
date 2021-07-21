const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const { Customer, validate } = require("../modules/customer");
const router = express.Router();

router.get("/", async (req, res) => {
  const Customers = await Customers.find().sort("name");
  res.send(Customers);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = new Customer({ name: req.body.name, phone: req.body.phone });
  await customer.save();

  res.status(201).send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

  if (!customer) return res.status(404).send("the customer with the given Id was not found");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send("the customer with the given Id was not found");

  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send("the customer with the given Id was not found");

  res.send(customer);
});

module.exports = router;
