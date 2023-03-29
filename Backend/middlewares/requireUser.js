const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
const { error } = require("../utils/responseWrapper");
dotenv.config("./.env");

module.exports = async (req, res, next) => {
  console.log("i am inside middleware");

  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    // return res.status(401).send("Authorization header is required");
    return res.send(error(401, "Authorization header is required"));
  }

  //kyunki jb hm frontend se token bhejte h to bearer<space>token ese bhejte h
  const accessToken = req.headers.authorization.split(" ")[1];

  console.log(accessToken);

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );

    req._id = decoded._id;

    //check wthether user is present is database or not
    const user = await User.findById(req._id);
    if (!user) {
      return res.send(error(404, "user not found in database"));
    }

    next();
  } catch (e) {
    // return res.status(401).send("Invalid acess key");
    return res.send(error(401, "Invalid acess key"));
  }
};
