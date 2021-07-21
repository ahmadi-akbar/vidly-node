const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  process.handleExceptions(new winston.transports.console({ colorized: true, prettyPrint: true }), new winston.transports.File({ filename: "uncaughtExceptions.log" }));

  process.on("unhandeledRejection", (ex) => {
    throw ex;
    // winston.error(ex.message, ex);
    // process.exit(1);
  });

  winston.add(winston.transports.File, { filename: "logfile.log" });
  // winston.add(winston.transports.MongoDB, { db: "mongodb://localhost/vidly",level:info });
};
