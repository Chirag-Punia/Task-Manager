const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const userSchema = require("./models/user");
const taskSchema = require("./models/task");
const taskDB = mongoose.model("taskDB", taskSchema);
const user = mongoose.model("user", userSchema);
app.use(cors());
app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://cpuniabe21:RH7bxwKzcPyljZgR@cluster0.zxrnern.mongodb.net/",
    { dbName: "userDB" }
  )
  .then(() => {
    console.log("mongoDD connected");
  });
app.get("/", (req, res) => {
  res.status(200).json({ info: "something" });
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  user.findOne({ email }).then((user) => {
    if (user) {
      if (password === user.password) {
        res.send("User already exist");
      } else {
        res.send("Wrong password");
      }
    } else {
      res.send("User does not exist");
    }
  });
});
app.post("/signup", async (req, res) => {
  const { email, password, name, confirmpassword } = req.body;
  console.log(!email);
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

app.post("/todo", (req, res) => {
  const { task, description } = req.body;
  console.log(task, description);
  const newTask = new taskDB({
    task: task,
    description: description,
  });
  newTask.save().then((data) => {
    console.log(data);
  });
    res.send("Task created");
});
app.listen(port, () => console.log(`server.js running on port: ${port}`));
