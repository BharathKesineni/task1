const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
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
	console.log("Request: " + JSON.stringify(req.body));
	const { email, password } = req.body;
	let errors = [];

	/* If condition to check whether all credentials are filled */
	if (!email || !password) {
	errors.push({ msg: 'Please enter all fields' });
	}
	

	/* If condition to check in case password
	length is greater than 3 or not */
	if (password.length < 3) {
	errors.push({ msg: 'Password must be at least 3 characters' });
	}

	if (errors.length > 0) {
	res.send('register error')
	} else {
	
	/* Checking if user exists */
	User.findOne({ email: email }).then(user => {
		if (user) {
		errors.push({ msg: 'Email already exists' });
		res.send('register user exists');
		}
		
	/* Creating the user */
	else {
		const newUser = new User({
			email,
			password
		});
		
		/* Bcrypt hashing the password for user privacy */
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
			newUser
				.save()
				.then(user => {
					var mailOptions = {
						from: 'mail to:bharath.kesineni@brainvire.com',
						to: 'mail to: bharathkesineni@gmail.com',
						subject: 'Sending Email using Node.js',
						text: 'That was easy!'
					  };
					  
					  transporter.sendMail(mailOptions, function(error, info){
						if (error) {
						  console.log(error);
						} else {
						  console.log('Email sent: ' + info.response);
						}
					  });
				res.send("Register Successful");
				})
				.catch(err => console.log(err));
			});
		});
		}
	});
	}
}

exports.login = (req, res, next) => {

	/* Authenticating if login was successful or
	not with the help of passport */
passport.authenticate('local', {
	successRedirect: res.send("Login Successful"),
	failureRedirect: res.send("Error in Login"),
	failureFlash: false
})(req, res, next);

}

exports.logout = (req, res) => {
	req.logout();
/* Logging out */
	res.send("User Logout");
}
