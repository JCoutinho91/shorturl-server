//!Getting access to environment variables/settings
require("dotenv/config");

//! Connects to the database
require("./db");

//! Express
const express = require("express");
//! Creating App...
const app = express();

//! Config file has some middlewares, must be runned before the Routes.
require("./config")(app);

//* Routes Here: 

const allRoutes = require("./routes");
app.use("/", allRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

const urlRoutes = require("./routes/url.routes");
app.use("/", urlRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/", userRoutes);

//! To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
