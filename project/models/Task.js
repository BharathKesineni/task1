const mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", Todo);