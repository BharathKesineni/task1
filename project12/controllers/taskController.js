const Task = require("../models/Task");

const getAllTasks =(req,res) => {
    Task.find().then(tasks => {
        console.log('Tasks fetched')
        res.status(200).json({tasks});
    }).catch(err => {
        console.log(err)
    })
};  

const createTask= (req,res) => {
    Task.create(req.body).then(task => {
        console.log(task);
        res.status(201).json({task})
    }).catch(err => {
        console.log(err)
    })
}



const getTask = (req,res,next) => {
    const { id: taskID } = req.params
    Task.findOne({ _id: taskID }).then(task => {
        if (!task) {
          return next(createCustomError(`No task with id : ${taskID}`, 404))
        }
        res.status(200).json({ task })
    }).catch(err => {
        console.log(err);
    })
  };


const updateTask= async (req,res) => {
    const { id: taskID } = req.params
    Task.findOneAndUpdate({ _id: taskID }, req.body, {
      new: true,
      runValidators: true,
    }).then(task => {
        if (!task) {
          return next(createCustomError(`No task with id : ${taskID}`, 404))
        }
        res.status(200).json({ task })
    }).catch(err => {
        console.log(err)
    })
  };

const deleteTask= async (req,res) => {
    const { id: taskID } = req.params
    Task.findOneAndDelete({ _id: taskID }).then(task => {
        if (!task) {
          return next(createCustomError(`No task with id : ${taskID}`, 404))
        }
        res.status(200).json({ task })
    }).catch(err => {
        console.log(err);
    })
  };


module.exports= {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
 
};


  