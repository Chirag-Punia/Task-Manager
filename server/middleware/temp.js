const mongoose = require("mongoose");
const userSchema = require("../models/user");
const user = mongoose.model("user", userSchema);
const temp = (req, res, next) => {
  const  email = req.headers.email;
  const  password  = req.headers.password;
  user.findOne({ email }).then((user) => {
    if (user) {
      if (password === user.password) {
        req._id = user._id.toString();
        next();
      }
    }
  });
};

module.exports = {temp};
