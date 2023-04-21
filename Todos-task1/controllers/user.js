const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
// Load User model
const User = require('../models/user');
const {send} = require('../utils/email');




exports.register = (req, res,next) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({email: email}).then(user => {
		if (user) {
			res.send("E-mail already exists");
		}
		bcrypt.hash(password, 12)
		.then(hashPass => {
			// console.log(hashPass);
			const hashPassword = hashPass;
			const user = new User({
				name,
				email,
				password: hashPassword
			})
			send(email, "Registration success",`Hello user,
			you are successfully registered with my application 
			`)
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


exports.login = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
	  .then((user) => {
		// console.log(password);
		if (!user) {
		  return res.json({ msg: "email doesnot register. Please register with this mail." });
		}
		bcrypt
		  .compare(password, user.password)
		  .then((match) => {
			// console.log(match);
			if (match) {
			  // req.session.isLogin = true;
			  req.session.user = user;
			  res.json({ msg: "succesfully login" });
			}
			if(!match){
			  return res.json({ msg: "failed to login , chech your credentials. whether its correct or not." });
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
		// console.log(req.session);
	//   console.log(err);
	  res.send({ msg: "Logout Successfully" });
	});

	
  };
