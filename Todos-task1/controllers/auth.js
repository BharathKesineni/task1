// // exports.getLogin = (req, res, next) => {
// //     // console.log(req.get('cookie').split(';')[1].trim());
// //     res.render('auth/login',{
// //         path:'/login',
// //         pageTitle:'Login'
// //     });
// // };

// // exports.postLogin = (req,res,next) => {
// //     res.setHeader ('set-cookie','loggedIn=true');
// //     res.redirect('/');
// // }

// // const storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //       cb(null, 'uploads/')
// //     },
// //     filename: function (req, file, cb) {
// //       cb(null, Date.now() + '-' + file.originalname)
// //     }
// //   })

// //   const upload = multer({ storage }).single('file');


// //   app.post('/upload', function (req, res) {
// //     upload(req, res, function (err) {
// //       if (err) {
// //         // Handle the error
// //       } else {
// //         // File uploaded successfully
// //       }
// //     })
// //   })

  
// //   app.post('/upload', function (req, res) {
// //     upload(req, res, function (err) {
// //       if (err) {
// //         // Handle the error
// //       } else {
// //         // File uploaded successfully
// //         const file = req.file;
// //         console.log(file);
// //         // Do something with the file
// //       }
// //     })
// //   })
  






const {page, size} = req.query
if (!page) {
    page=1
} 
if (!size) {
    size = 10
}

const limit = parseInt(size);
const skip = (page - 1) * size;


const users = await user.find().limit(limit).skip(skip);

res.send(tasks);

res.send({
    page,
    size,
    data:tasks
})