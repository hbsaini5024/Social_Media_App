const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { error, success } = require("../utils/responseWrapper");
dotenv.config("./.env");

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      // return res.status(400).send("All Fields are Required");
      return res.send(error(400, "All Fields are Required"));
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      // return res.status(409).send("This User Already exists! ,");
      return res.send(error(400, "This User Already exists!"));
    }

    //hashing the user password
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    return res.send(success(201, "User  Created Succesfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(400).send("All Fields are Required");
      return res.send(error(400, "All Fields are Required"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // return res.status(404).send("User is not registered");
      return res.send(error(404, "User is not registered"));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      // return res.status(403).send("Incorrect Password");
      return res.send(error(403, "Incorrect Password"));
    }

    const accessToken = generateAccessToken({
      _id: user._id,
    });
    const refreshToken = generateRefreshToken({
      _id: user._id,
    });

    //to save refreshToken inside cookie from backend to frontend
    res.cookie("Refresh_Token", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    // return res.json({
    //   user,
    //   accessToken,
    // });
    return res.send(success(200, { accessToken }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

// this API will check the accesstoken validity and generate a new access token
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies.Refresh_Token;

  if (!cookies) {
    return res.send(error(401, "Refresh Token in cookie is Required"));
  }

  const refreshToken = cookies;

  console.log("Refresh : ", refreshToken);

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const _id = decoded._id;
    const accessTOken = generateAccessToken({ _id });

    return res.send(success(201, { accessTOken }));
  } catch (e) {
    return res.send(error(401, "Invalid Refresh Token"));
  }
};

//logout Controller
const logoutController = async (req, res) => {
  try {
    res.clearCookie("Refresh_Token", {
      httpOnly: true,
      secure: true,
    });

    res.send(success(200, "User gets loggout"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

// internal functions
const generateAccessToken = (data) => {
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: "1d",
  });
  console.log(token);
  return token;
};

const generateRefreshToken = (data) => {
  const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
    expiresIn: "1yr",
  });
  console.log(token);
  return token;
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController,
};
