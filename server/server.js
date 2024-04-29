const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const bodyParser = require("body-parser");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
mongoose.connect(process.env.MONGO_URI, { dbName: "userDB" }).then(() => {
  console.log("mongoDD connected");
});

app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);
app.get("/:", (req, res) => {
  res.status(200).json({ info: "something" });
});
app.listen(port, () => console.log(`server.js running on port: ${port}`));
