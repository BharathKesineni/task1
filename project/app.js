const express = require('express');
const mongoose = require('mongoose');
const tasksRoutes = require("./routes/tasks");
const app = express();
 
const User = require('./models/user')

app.use(express.json());

app.use((req,res,next) => {
    User.findOne()
    .then(user => {
        req.user = user;
        next()
    }).catch(err => console.log(err));
});

app.use("/api/tasks",tasksRoutes);

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