const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

const taskController = require("../controllers/taskController");

router.get("/", auth, taskController.getAllTasks);

router.post("/", auth, taskController.createTask);

router.get("/:id", auth, taskController.getTask);

router.patch("/:id", auth, taskController.updateTask);

router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;
