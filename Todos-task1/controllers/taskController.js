const {
  TASKS_FETCHED,
  CREATED_TODO,
  TASK_DELETED,
} = require("../constants/Taskmsg");
const Task = require("../models/Task");
const { send } = require("../utils/email");

exports.getAllTasks = (req, res) => {
  // console.log(req.user);
  Task.find()
    .then((tasks) => {
      // console.log("Tasks fetched");
      res.status(200).json({ tasks, msg: TASKS_FETCHED });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createTask = (req, res) => {
  console.log(req.file);
  const email = req.body.email;
  const task = req.body.task;
  taskFile = req.file.filename;
  const newtask = {
    task: task,
    taskFile: taskFile,
    // userId: req.user,
  };
  Task.create(newtask)
    .then((task) => {
      send(
        email,
        CREATED_TODO,
        `taskId:${task._id} your task Name:${task.task}
			`
      );
      res.status(201).json({ task });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getTask = (req, res, next) => {
  const { id: taskID } = req.params;
  Task.findOne({ _id: taskID })
    .then((task) => {
      if (!task) {
        return res.send(`No task with id : ${taskID}`);
      }
      res.status(200).json({ task });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateTask = async (req, res) => {
  const { id: taskID } = req.params;
  // console.log(req.body.task);s
  Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  }).then((task) => {
    if (!task) {
      return next(createCustomError(`No task with id : ${taskID}`, 404));
    }
    res.status(200).json({ task });
  }).catch((err) => {
    console.log(err);
  });
};

exports.deleteTask = async (req, res) => {
  const { id: taskID } = req.params;
  Task.deleteOne({ _id: taskID })
    .then((task) => {
      if (!task) {
        return next(createCustomError(`No task with id : ${taskID}`, 404));
      }
      res.status(200).json({ msg: TASK_DELETED });
    })
    .catch((err) => {
      console.log(err);
    });
};
