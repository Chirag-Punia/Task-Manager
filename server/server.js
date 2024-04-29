const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://cpuniabe21:RH7bxwKzcPyljZgR@cluster0.zxrnern.mongodb.net/",
    { dbName: "userDB" }
  )
  .then(() => {
    console.log("mongoDD connected");
  });

app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);
app.get("/:", (req, res) => {
  res.status(200).json({ info: "something" });
});
app.listen(port, () => console.log(`server.js running on port: ${port}`));
