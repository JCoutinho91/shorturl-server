const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");


//? Get current user info
router.get('/api/users/current', isAuthenticated, async (req, res, next) => {
  try {
    //! If the user is authenticated we can access the JWT payload via req.payload
    //! req.payload holds the user info that was encoded in JWT during login.
    const currentUser = req.payload;
    const user = await User.findById(currentUser._id)
      //! populate the field urlData
      .populate("urlData");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
})



module.exports = router;
