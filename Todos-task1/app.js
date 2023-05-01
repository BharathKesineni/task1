const express = require("express");
const tasksRoutes = require("./routes/tasks");
const userRoutes = require("./routes/user");
const auth = require("./middleware/auth");
const taskController = require("./controllers/taskController");
require("dotenv").config();
const connect = require("./config/database");
const upload = require('./utils/upload')

const app = express();

// const MongoUrl = "mongodb://127.0.0.1:27017/bharath";

// const fileStorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public");
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + "--" + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   //reject a file
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const upload = multer({
//   storage: fileStorageEngine,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
// }).single("taskFile");

app.use(express.json());

app.use("/api/tasks", tasksRoutes);

app.use("/api", userRoutes);

app.post("/api/task", auth, upload, taskController.createTask);


const start = async () => {
  try {
    await connect();
    app.listen(4000, () => {
      console.log("listening on port: 4000");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
