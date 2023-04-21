const express = require('express');
const mongoose = require('mongoose');
const tasksRoutes = require("./routes/tasks");
const userRoutes = require('./routes/user');
// const authRoutes = require('./routes/auth');
const User = require('./models/user');
const multer = require("multer");
const path = require("path");
const session = require("express-session"); 

const MongoStore = require("connect-mongodb-session")(session);
const app = express();

const MongoUrl = "mongodb://127.0.0.1:27017/bharath";

// mongoose.connect(MongoUrl,{
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useUnifiedTopology:true
// });

const store = new MongoStore({
    uri: MongoUrl,
    collection: "sessions",
  });


  app.use(
    session({
      secret: "key that will sign cookie",
      resave: false,
      saveUninitialized: false,
      store: store,
    })
  );
  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then((reqUser) => {
        req.user = reqUser;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  });


const fileStorageEngine = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./public')
    },
    filename:(req,file,cb) => {
        cb(null, new Date().toISOString() + "--"+file.originalname);
    },
});

const fileFilter = (req,file,cb) => {
    //reject a file 
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null,true);
    } else {
        cb(null,false);
    }
}

const upload   = multer ({
    storage:fileStorageEngine,
     limits:{
    fileSize: 1024 * 1024 * 5
 },
    fileFilter: fileFilter
});


app.use(express.json());


app.use(session({secret: "secret", resave: false, saveUninitialized: false}));

app.use((req,res,next) => {
    if(!req.session.user) {
       return next()
    }
    User.findOne({_id: req.session.user._id})
    .then(user => {
        console.log(user);
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
    // User.findOne()
    // .then(user => {
    //     // console.log(user);
    //     if(!user) {
    //         user = new User({
    //             email: "bharath@gmail.com",
    //             password: "101010"
    //         })
    //         user.save();
    //     }
    // })
    console.log('db connected!!')
})
.catch( err => console.log(err))

app.listen(4000,() => console.log ("server is running on port 4000"));