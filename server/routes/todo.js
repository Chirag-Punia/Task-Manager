const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const taskSchema = require("../models/task");
const taskDB = mongoose.model("taskDB", taskSchema);
const { authenticateJwt } = require("../middleware/auth");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const userSchema = require("../models/user");
const user = mongoose.model("user", userSchema);
const cron = require("node-cron")

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "samplemail650@gmail.com",
    pass: "dcallqzulbgqhuwt",
  },
});
const handleJob = async (date, userID, task, description) => {
  console.log("inside handle job");
  console.log(date);
  cron.schedule(`${new Date(2024, 5, 5, 17, 20, 0)}`, async () => {
    console.log("Job started");
    const EMAIL = await user.findOne({ _id: userID }).then((user) => {
      return user.email;
    });
    const info = await transporter.sendMail({
      from: {
        name: "Task Scheduler",
        address: "samplemail650@gmail.com",
      },
      to: [EMAIL],
      subject: task,
      text: description,
      html: `<p>Dear ${user.name},</p>
      <p>You have task scheduled</p>
      <ul>
  <li><strong>Task:</strong> ${task}</li>
  <li><strong>Description:</strong> ${description}</li>
  <li><strong>Date:</strong>${date.slice(0, 10)}</li>
  <li><strong>Time:</strong> ${date.slice(11, 16)}</li>
</ul>`,
    });
    console.log("Message sent: %s", info.messageId);
  });
};

const mailDone = async (userID) => {
  await taskDB.findOne({ userID }).then(async (obj) => {
    await user.findOne({ _id: userID }).then(async (user) => {
      await transporter.sendMail({
        from: {
          name: "Task Done",
          address: "samplemail650@gmail.com",
        },
        to: [user.email],
        subject: `Congratulation for completing you Task <<TASK : ${obj.task}>>`,
        text: "Best of luck for remaining task",
      });
    });
  });
};
router.post("/todo", authenticateJwt, async (req, res) => {
  const { task, description, date } = req.body;
  const newTask = new taskDB({
    date: date,
    task: task,
    description: description,
    userID: req.headers.userID,
  });
  await handleJob(date, req.headers.userID, task, description);
  await newTask.save().then((data) => {
    res.status(200).send(data);
  });
});

router.get("/todo", authenticateJwt, async (req, res) => {
  await taskDB.find({ userID: req.headers.userID }).then((data) => {
    res.status(200).send(data);
  });
});

router.patch("/todo/:id/done", authenticateJwt, async (req, res) => {
  const id = req.params.id;
  await taskDB
    .findOneAndUpdate({ _id: id }, { $set: { done: true } })
    .then(async (data) => {
      await taskDB.findOne({ _id: id }).then(async (user) => {
        if (user.done === true) {
          await mailDone(req.headers.userID);
        }
      });
      res.status(200).send(data);
    });
});

module.exports = router;
