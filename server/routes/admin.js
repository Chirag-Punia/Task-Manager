const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const userSchema = require("../models/user");
const user = mongoose.model("user", userSchema);
const jwt = require("jsonwebtoken");
const { userid, temp } = require("../middleware/temp");
const { SECRET, authenticateJwt } = require("../middleware/auth");
const taskSchema = require("../models/task");
const taskDB = mongoose.model("taskDB", taskSchema);

// .findOneAndUpdate({ _id: id }, { $set: { done: true } })

router.get("/data", async (req, res) => {
  await user.find().then((data) => {
    console.log(data);
    res.send(data);
  });
});

router.patch("/data", async (req, res) => {
  const { idd } = req.body;
  await user
    .findOneAndUpdate({ _id: idd }, { $set: { isAdmin: true } })
    .then((obj) => {
      res.sendStatus(200);
    });
});
module.exports = router;
