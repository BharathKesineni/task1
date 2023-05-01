const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Load User model
const User = require("../models/user");
const { send } = require("../utils/email");
const jwt = require("jsonwebtoken");

exports.register = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const token = crypto.randomBytes(32).toString("hex");
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ error: "E-mail already exists" });
      }
      bcrypt
        .hash(password, 12)
        .then((hashPass) => {
          // console.log(hashPass);
          const hashPassword = hashPass;
		  console.log(token);

          const user = new User({
            name,
            email,
            password: hashPassword,
            token: token,
          });

          return user.save();
        })
        .then((user) => {
          emailLink = `http://localhost:4000/api/email-verify/${user._id}/${token}`;
          text = `<p> To Create Your Account Please Verify Email </p>
				<p> Click <a href="${emailLink}"> here </a>to verify your email</p>`;

          send(email, "Email Verification", text);
          console.log(user);
          res.send("Email is sent please varify.");
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
  console.log(userId, token);
  let userEmail;
  User.findOne({
    _id: userId,
    token: token,
  })
    .then((verifyUser) => {
		console.log(verifyUser);
      if (!verifyUser) {
        return res.json({ msg: "Email verification is Failed." });
      }
      userEmail = verifyUser.email;
      userPassword = verifyUser.password;
      verifyUser.isVerified = true;
      verifyUser.token = undefined;
      verifyUser.tokenExpiration = undefined;
      return verifyUser.save();
    })
    .then((response) => {
      text = `<h1>You Successfully Signedup TODO task.</h1>
	<p>Thank You</p>
  `;
      sendEmail(userEmail, "Email Verification", text);
      res.json({ msg: "User Verified now you can Login" });
    });
};
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loginUser;
  User.findOne({ email: email })
    .then((user) => {
      loginUser = user._doc;
      if (!user) {
        return res.json({
          msg: "email doesnot register. Please register with this mail.",
        });
      }

      //   if (!user.isVerified) {
      //     return res.json({
      //       msg: "User Verification is Required. Please Verify Your Email."
      //     });
      //   }

      bcrypt
        .compare(password, user.password)
        .then((match) => {
          // console.log(match);
          if (match) {
            const token = jwt.sign({ loginUser }, "secretKey", {
              expiresIn: "3h",
            });
            res.json({ msg: "succesfully login", jwtToken: token });
          }
          if (!match) {
            return res.json({
              msg: "failed to login, chech your credentials. whether its correct or not.",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err.msg);
    });
};

exports.resetPasswordEmail = (req, res, next) => {
  const email = req.body.email;
  const token = crypto.randomBytes(32).toString("hex");
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.json({ msg: "Please choose a valid email" });
      }
      user.token = token;
      user.tokenExpiration = Date.now() + 4000000 * 3;
      return user.save();
    })
    .then((resetUser) => {
      const resetPasswordUrl = `${process.env.BASE_URL}/api/new-password/${resetUser._id}/${token}`;

      text = `<p> You are requested to reset your Passsword</p>
	   <p> Click <a href="${resetPasswordUrl}"> here </a>to reset the password</p>`;
      sendEmail(email, "Password Reset", text);
      res.json({ msg: "Reset Email sent." });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.resetPassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const userId = req.params.id;
  const token = req.params.token;
  let resetUser;
  User.findOne({
    _id: userId,
    token: token,
    tokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      if (!user) {
        return res.send("Invalid Token");
      }
      console.log(newPassword);
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPass) => {
      resetUser.password = hashedPass;
      resetUser.token = undefined;
      resetUser.tokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      text = `<h1>you were succesfully changed your password.</h1>
	  <p>Your New Password is: "${newPassword}" </p>
	  <p>Thank You</p>
	`;
      sendEmail(result.email, "Password Changed", text);
      res.json({ msg: "Your Password Is Successfully Changed" });
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

  res.send({ msg: "Logout Successfully" });
};
