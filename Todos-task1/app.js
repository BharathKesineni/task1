const express = require('express');
const mongoose = require('mongoose');
const tasksRoutes = require("./routes/tasks");
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');


const app = express();
const path = require("path");
const multer = require("multer");

 
const User = require('./models/user');
const bodyparser = require("body-parser");

const fileStorageEngine = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./public')
    },
    filename:(req,file,cb) => {
        cb(null,Date.now()+"--"+file.originalname);
    },
});

const upload   = multer ({storage:fileStorageEngine});

app.use(express.json());

app.use((req,res,next) => {
    User.findOne({_id:'643d0b6ab2ade668851200f0'})
    .then(user => {
        // console.log(user);
        req.user = user;
        next()
    }).catch(err => console.log(err));
});

app.use("/api/tasks",tasksRoutes);

app.use("/api",userRoutes);

app.post("/single",upload.single('image'),(req,res) => {
    console.log(req.file);
    res.send("single file upload success!");
  });

  app.post('/multiple',upload.array("images", 5),(req,res) => {

    console.log(req.files);
    res.send("multiple files uploaded succesfully");
});

// app.use(authRoutes);


mongoose.connect('mongodb://127.0.0.1:27017/bharath')
.then(() => {
    User.findOne()
    .then(user => {
        // console.log(user);
        if(!user) {
            user = new User({
                email: "bharath@gmail.com",
                password: "101010"
            })
            user.save();
        }
    })
    console.log('db connected!!')
})
.catch( err => console.log(err))

app.listen(4000,() => console.log ("server is running on port 4000"));