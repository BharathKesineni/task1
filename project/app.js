const express = require('express');
const mongoose = require('mongoose');
const tasksRoutes = require("./routes/tasks");

mongoose.connect('mongodb://127.0.0.1:27017/bharath')
.then(() => console.log('db connected!!')).catch( err => console.log(err));

const app = express();

app.use(express.json());

app.use("/api/tasks",tasksRoutes);

app.listen(4000,() => console.log ("server is running on port 4000"));