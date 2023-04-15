const express = require('express');
const router = express.Router();
const taskController = require("../controllers/taskController")


const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController')

router.get('/', taskController.getAllTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
 