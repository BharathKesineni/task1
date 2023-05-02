const multer = require('multer');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public");
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + "--" + file.originalname);
    },
  });
  
  const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: fileStorageEngine,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  }).single("taskFile");

  module.exports = upload;