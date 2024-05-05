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
    res.send(data);
  });
});
router.get("/data/task", async (req, res) => {
    await taskDB.find().then((data) => {
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
router.delete("/data/del", async (req, res) => {
  const { idd } = req.body;
  await user.find({ _id: idd }).then(async (obj) => {
    if (obj[0].isAdmin === true) {
      res.send("Admin");
    } else {
      await user.findOneAndDelete({ _id: idd }).then(() => {
        res.send("del");
      });
    }
  });
});
module.exports = router;
