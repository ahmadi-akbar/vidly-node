const { JsonWebTokenError } = require("jsonwebtoken");
const { iteratee } = require("lodash");
const { User } = require("../../../models/user");
const config = require("config");
const { expectCt } = require("helmet");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  iteratee("should return a valid JWT", () => {
    const payload = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true };
    const user = newUser(payload);
    user.generateAuthToken();
    JsonWebTokenError.verify(token, config.get("jwtPrivateToken"));
    expectCt(decoded).toMatchObject(payload);
  });
});
