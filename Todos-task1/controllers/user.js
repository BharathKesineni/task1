const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
// Load User model
const User = require('../models/user');
// const { forwardAuthenticated } = require('../config/auth');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mailto:bharath.kesineni@brainvire.com',
    pass: 'Brain@2023'
  }
});


exports.register = (req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({email: email}).then(user => {
		if (user) {
			res.send("E-mail already exist");
		}
		bcrypt.hash(password, 12)
		.then(hashPass => {
			// console.log(hashPass);
			const hashPassword = hashPass;
			const user = new User({
				name: name,
				email: email,
				password: hashPassword
			})
			return user.save();
		})
		.then(user => {
			console.log(user);
			res.send("User successfully Registred");
		})
		.catch(err => {
			console.log(err);
		})
	}).catch(err => {
		console.log(err)
	})
}

// exports.login = (req, res, next) => {

// 	/* Authenticating if login was successful or
// 	not with the help of passport */
// passport.authenticate('local', {
// 	successRedirect: res.send("Login Successful"),

// 	failureRedirect: res.send("Error in Login"),
// 	failureFlash: false
// })(req, res, next);

// }

// exports.logout = (req, res) => {
// 	req.logout();
// /* Logging out */
// 	res.send("User Logout");
// }

exports.login = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
	  .then((user) => {
		// console.log(password);
		if (!user) {
		  return res.json({ msg: "Incorrect email" });
		}
		bcrypt
		  .compare(password, user.password)
		  .then((match) => {
			// console.log(match);
			if (match) {
			  // req.session.isLogin = true;
			  req.session.user = user;
			  res.json({ msg: "Login Successfully" });
			}
			if(!match){
			  return res.json({ msg: "failed to login , Incorrect password" });
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
  
  exports.logout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(req.session);
	  console.log(err);
	  res.send({ msg: "Logout Successfully" });
	});

	
  };
