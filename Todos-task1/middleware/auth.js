const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
    const token = bearerHeader.split(" ")[1];
    // console.log(token);
  let decodedToken;
  try {
    decodedToken = await jwt.verify(token, "secretKey");
    if (!decodedToken) {
      return res.send("Not Authenticated");
    }
    const user = await User.findById(decodedToken.loginUser._id);
    req.user = user._doc;
    console.log(req.user);

} catch (err) {
    console.log(err);
  }
  next();
};