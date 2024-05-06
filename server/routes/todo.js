const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const taskSchema = require("../models/task");
const taskDB = mongoose.model("taskDB", taskSchema);
const { authenticateJwt } = require("../middleware/auth");
const nodemailer = require("nodemailer");
const userSchema = require("../models/user");
const user = mongoose.model("user", userSchema);
var schedule = require("node-schedule");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.XEMAIL,
    pass: process.env.PASS,
  },
});
const handleJob = async (date, userID, task, description) => {
  schedule.scheduleJob(`${date}`, async () => {
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
  let { task, description, date } = req.body;

  let selectedHour = parseInt(date.slice(11, 13), 10);
  let selectedMinute = parseInt(date.slice(14), 10);
  let adjustedDateTime = null;
  let adjustedHour = null;
  let adjustedMinute = null;
  if (selectedHour < 12) {
    let adjustedHour = selectedHour + 5;
    let adjustedMinute = selectedMinute + 30;
    if (adjustedMinute > 60) {
      adjustedHour = adjustedHour + 1;
      adjustedMinute = adjustedMinute - 60;
    }
  } else {
    adjustedHour = selectedHour;
    adjustedMinute = selectedMinute;
  }
  let adjustedTimeString = `${adjustedHour
    .toString()
    .padStart(2, "0")}:${adjustedMinute.toString().padStart(2, "0")}`;
  adjustedDateTime = date.slice(0, 11) + adjustedTimeString;

  const newTask = new taskDB({
    date: adjustedDateTime,
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
