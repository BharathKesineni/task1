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
  







// const upload = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null,'uploads');
//         },
//         filename : function(req,file,cb){
//             cb(null, file.fieldname+".jpeg")
//         }
//     }),
// }).single("user_file");

// app.post('/upload',upload,(req,resp)=> {
//     resp.send('file uploaded')