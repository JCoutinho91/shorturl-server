const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");


const saltRounds = 10;

//? Sign Up User
router.post("/auth/signup", async (req, res, next) => {
  try {
    //! Get the data from req.body
    const { email, password, name } = req.body;
    //! Validate that values are not empty strings
    if (email === "" || password === "" || name === "") {
      res.status(400).json({ message: "Provide email, password and name." });
      return;
    }
    //! Validate email and password format
    //! Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Provide a valid email address." });
      return;
    }

    //! Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }
    //! Check if email is not taken
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      res.status(400).json({ message: "Provide a valid email" });
      return;
    }

    //! Hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    //! Create the new user in the DB
    const createdUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    //! Never expose passwords publicly!!
    const user = {
      _id: createdUser._id,
      email: createdUser.email,
      name: createdUser.name,
    };
    //! Send the response back
    res.status(201).json({ user: user });
  } catch (error) {
    next(error);
  }
});

//? Logs In User
router.post("/auth/login", async (req, res, next) => {
  try {
    //! Same this has before.  Get values from req.body
    const { email, password } = req.body;
    //! Same this has before.  Validate that values are not empty strings
    if (email === "" || password === "") {
      res.status(400).json({ message: "Provide email and password" });
      return;
    }
    //! Check if the user exists
    const foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      res.status(400).json({ message: "Provide a valid email" });
      return;
    }

    //! Compare the provided password with bcrypt method
    const passwordCorrect = await bcrypt.compare(password, foundUser.password);

    if (passwordCorrect) {
      //! We should never expose passwords publicly
      //! Here I passed also the UrlData so I can have access to it on the client.
      const payload = {
        _id: foundUser._id,
        name: foundUser.name,
        role: foundUser.role, // 'admin' or 'user'
        urlData: foundUser.urlData
      };

      //! Create a JWT with the payload
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "12h",
      });
      //!Response
      res.status(200).json({ authToken: authToken });
    } else if (!passwordCorrect) {
      res.status(401).json({ message: "Unable to login the user" });
    }
  } catch (error) {
    next(error);
  }
});
//?  Verify tokens stored in the frontend
router.get("/auth/verify", isAuthenticated, async (req, res, next) => {
  //! If JWT is valid the payload gets decoded by isAuthenticated middleware
  //! and made available on req.payload
  try {
    res.status(200).json(req.payload);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
