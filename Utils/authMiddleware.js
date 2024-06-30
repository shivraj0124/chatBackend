const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const protect = async (req, res, next) => {
    console.log(req.headers.authorization);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.userId).select("-password");
      
      next();
    } catch (err) {
      res.send({ msg: "Not authorized" });
    }
  }
  if(!token){
    res.send({ msg: "Not authorized , No Token" });
  }
};

module.exports = protect;
