const express = require("express");
const tasksRoutes = require("./routes/tasks");
const userRoutes = require("./routes/user");
const auth = require("./middleware/auth");
const taskController = require("./controllers/taskController");
require("dotenv").config();
const connect = require("./config/database");
const upload = require("./utils/upload");
const app = express();
app.use(express.json());
app.use("/api/tasks", tasksRoutes);
app.use("/api", userRoutes);
app.post("/api/task", auth, upload, taskController.createTask);
const PORT = process.env.PORT || 4000;
const start = async () => {
  try {
    await connect();

    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
