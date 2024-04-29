const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const taskSchema = require("../models/task");
const taskDB = mongoose.model("taskDB", taskSchema);
const { authenticateJwt } = require("../middleware/auth");
const {temp} = require("../middleware/temp");


router.post("/todo",authenticateJwt,async (req, res) => {
  const { task, description } = req.body;
  const newTask = new taskDB({
    task: task,
    description: description,
    userID:req.headers.userID
  });
  await newTask.save().then((data) => {
    res.status(200).send(data);
  });
});

router.get("/todo",authenticateJwt,async (req, res) => {
  await taskDB.find({userID : req.headers.userID}).then((data) => {
    res.status(200).send(data);
  });
});

router.patch("/todo/:id/done", async (req, res) => {
  const id = req.params.id;
  await taskDB
    .findOneAndUpdate({ _id: id }, { $set: { done: true } })
    .then((data) => {
      res.status(200).send(data);
    });
});

module.exports = router;
