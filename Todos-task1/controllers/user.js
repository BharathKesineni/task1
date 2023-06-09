const {
  EMAIL_EXISTS,
  EMAIL_VERIFY,
  EMAIL_REGISTERED,
  EMAIL_SENT,
  EMAIL_FAILED,
  USER_VERIFIED,
  EMAIL_NOT_REGISTER,
  USER_VERIFICATION,
  SUCCESS_LOGIN,
  FAILED_LOGIN,
  LOGOUT_SUCCESS,
  EMAIL_VERIFICATION,
} = require("../constants/user-msg");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
// Load User model
const User = require("../models/user");
const { send } = require("../utils/email");
const jwt = require("jsonwebtoken");

exports.register = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.errors[0].msg);
    return res.send(errors.errors[0].msg);
  }
  // const token = crypto.randomBytes(32).toString("hex");
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ error: EMAIL_EXISTS });
      }
      bcrypt
        .hash(password, 12)
        .then((hashPass) => {
          // console.log(hashPass);
          const hashPassword = hashPass;

          const user = new User({
            name,
            email,
            password: hashPassword,
          });

          return user.save();
        })
        .then((user) => {
          emailLink = `http://localhost:4000/api/email-verify/${user._id}`;

          text = `<p> To Create Your Account Please Verify Email </p>

				<p> Click <a href="${emailLink}"> here </a>to verify your email</p>`;

          send(email, EMAIL_VERIFY, text);
          // console.log(user);
          // res.send(EMAIL_SENT);
          res.send(EMAIL_REGISTERED);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.userVerification = (req, res, next) => {
  const userId = req.params.id;
  const token = req.params.token;
  console.log(userId);
  let userEmail;
  User.findOne({
    _id: userId,
  })
    .then((verifyUser) => {
      console.log(verifyUser);
      if (!verifyUser) {
        return res.json({ msg: EMAIL_FAILED });
      }
      userEmail = verifyUser._doc.email;
      userPassword = verifyUser.password;
      return verifyUser.save();
    })
    .then((response) => {
      text = `<h1>You Successfully Signedup TODO task.</h1>
	<p>Thank You</p>
  `;
      sendEmail(userEmail, EMAIL_VERIFICATION, text);
      res.json({ msg: USER_VERIFIED });
    });
};
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loginUser;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.send(errors.errors[0].msg);
  }
  User.findOne({ email: email })
    .then((user) => {
      // console.log(user);
      if (!user) {
        return res.json({
          msg: EMAIL_NOT_REGISTER,
        });
      }
      loginUser = user._doc;

      // if (!user.isVerified) {
      //   return res.json({
      //     msg: USER_VERIFICATION,
      //   });
      // }

      bcrypt
        .compare(password, user.password)
        .then((match) => {
          // console.log(match);
          if (match) {
            const token = jwt.sign({ loginUser }, "secretkey", {
              expiresIn: "2h",
            });
            res.json({ msg: SUCCESS_LOGIN, jwtToken: token });
          }
          if (!match) {
            return res.json({
              msg: FAILED_LOGIN,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.logout = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(401).json({ msg: "Not authenticated" });
  }
  let token = bearerHeader.split(" ")[1];

  res.send({ msg: LOGOUT_SUCCESS });
};
