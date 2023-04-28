const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
  console.log(token);
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify( "secretkey");
    if (!decodedToken) {
      return res.send("Not Authenticated");
    }
    console.log(decodedToken);
    req.user = await User.findById(decodedToken.user._id);
} catch (err) {
    return res.send({ msg: err });
  }
  //   console.log(req.user);
  next();
};