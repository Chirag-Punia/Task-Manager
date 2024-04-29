const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const userSchema = require("../models/user");
const user = mongoose.model("user", userSchema);
const jwt = require("jsonwebtoken");
const { userid, temp } = require("../middleware/temp");
const { SECRET } = require("../middleware/auth");


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  user.findOne({ email }).then((user) => {
    if (user) {
      if (password !== user.password) {
        res.status(401).json({ msg: "Wrong password" });
      } else {
        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
        res.status(200).json({ msg: "Login successfully" ,token});
      }
    } else {
      res.status(401).json({ msg: "User does not exist" });
    }
  });
});
router.post("/signup", async (req, res) => {
  const { email, password, name, confirmpassword } = req.body;
  if (!name || !email || !password || !confirmpassword) {
    res.send("Enter all required field");
  } else if (password !== confirmpassword) {
    res.send("password does not match");
  } else if (password.length < 2) {
    res.send("Password should be at least 6 characters");
  } else {
    const newUser = new user({
      email: email,
      name: name,
      password: password,
    });
    newUser.save();
    res.send("User created");
  }
});

module.exports = router;
