const Task = require("../models/Task");
const {send} = require('../utils/email');


exports.getAllTasks = (req, res) => {
  // console.log(req.session.user);
  Task.find()
    .then((tasks) => {
      console.log("Tasks fetched");
      res.status(200).json({ tasks });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createTask = (req, res) => {
  email = req.user._doc.email;
  const task = req.body.task;
  taskFile = req.file.filename;
  const newtask = {
    task: task,
    taskFile: taskFile,
    userId: req.user,
  };
  Task.create(newtask)
    .then((task) => {
      send(email, "Created a Todo",`Hello user,
		 successfully created a Todo your taskId:${task._id} your task Name:${task.task}
			`)
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
  Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  })
    .then((task) => {
      if (!task) {
        return next(createCustomError(`No task with id : ${taskID}`, 404));
      }
      res.status(200).json({ task });
    })
    .catch((err) => {
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
      res.status(200).json({ msg: "Task deleted" });
    })
    .catch((err) => {
      console.log(err);
    });
};

// module.exports= {
//     getAllTasks,
//     createTask,
//     getTask,
//     updateTask,
//     deleteTask

// };
