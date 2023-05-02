const { check } = require("express-validator");
exports.registerValidation = [
  check("email").isEmail().withMessage("please enter a valid email"),
  check("password")
    .isLength({ min: 4 })
    .withMessage("pls enter the min 4 characters"),
];

exports.loginValidation = [
    check("email").isEmail().withMessage("Please provide register email"),
    check("password")
      .isLength({ min: 4 })
      .withMessage("please provide valid password"),
  ];