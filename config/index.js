const express = require("express");

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require("morgan");

//! For authentication
const cookieParser = require("cookie-parser");

//! For requests from the outside
const cors = require("cors");

const REACT_APP = process.env.ORIGIN || "http://localhost:3000";

//? Middlewares
module.exports = (app) => {
  //! In case of deployment
  app.set("trust proxy", 1);

  //! cors config
  app.use(
    cors({
      credentials: true,
      origin: [REACT_APP],
    })
  );

  //! For Logs, i love it
  app.use(logger("dev"));

  //! To have access to BODY property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
