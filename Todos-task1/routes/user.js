const express = require('express');

const router = express.Router();

const userController = require("../controllers/user");

 //Register router with passport package /
 
router.post('/register', userController.register);

router.post('/login', userController.login);

router.post('/logout', userController.logout);

module.exports = router;
