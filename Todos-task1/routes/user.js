const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const validation = require('../utils/validation')

router.post("/register", validation.registerValidation,userController.register);

router.post("/email-verify/:id", userController.userVerification);

router.post("/login",validation.loginValidation, userController.login);

router.post("/logout", userController.logout);

module.exports = router;
