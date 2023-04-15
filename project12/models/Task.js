const mongoose = require("mongoose");

const Todo = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    completed:{
      type:Boolean,
      default:false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", Todo);
