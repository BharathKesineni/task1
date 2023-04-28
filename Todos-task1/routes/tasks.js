const express = require('express');
const auth = require("../middleware/auth");

const router = express.Router();

const taskController = require("../controllers/taskController")

router.get('/', taskController.getAllTasks);

router.post('/', auth,taskController.createTask);

router.get('/:id', taskController.getTask);

router.patch('/:id', taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

module.exports = router;
 