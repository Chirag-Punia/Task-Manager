const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  done: {
    type: Boolean,
    default: false,
  },
  userID: {
    type: String,
    required: true,
  },
  date : {
    type : Date,
    required : false
  }
});

module.exports = taskSchema;
