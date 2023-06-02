const { UserModel } = require("../models/auth");
const { UserProfileModel } = require("../models/profile");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnAuthenticatedError } = require("../errors");
const { sendSMS } = require("../utils/sms");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new UnAuthenticatedError("Email is not registered");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnAuthenticatedError("Password is incorrect");
  }

  const token = user.getJWT();
  res
    .status(StatusCodes.OK)
    .json({ user, token, message: "success", success: true });
};

const register = async (req, res) => {
  const existingUser = await UserModel.findOne({ email: req.body.email });
  if (existingUser) {
    throw new BadRequestError("Email is already registered");
  }

  const existingNumber = await UserModel.findOne({
    phoneNumber: req.body.phoneNumber,
  });
  console.log(existingNumber);
  if (existingNumber) {
    throw new BadRequestError("Number is already used");
  }

  const user = await UserModel.create({ ...req.body });

  if (!user) {
    throw new BadRequestError("Something went wrong");
  }
  const newUserProfile = await UserProfileModel.create({ user: user._id });

  res.status(StatusCodes.CREATED).json({
    user: user,
    token: user.getJWT(),
  });
};

const updateUser = async (req, res) => {
  const { email, lastName, firstName, location, username } = req.body;
  if (!email || !lastName || !firstName || !location || !username) {
    throw new BadRequestError("Please provide user values");
  }

  const user = await UserModel.findOne({ _id: req.user.userID });

  // update values
  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;
  user.location = location;
  user.username = username;

  await user.save();
  const token = user.getJWT();
  res.status(StatusCodes.OK).json({ user, token });
};

const logout = async (req, res) => {
  if (req.user) {
    req.logout();
    res.clearCookie("session", { path: "/", httpOnly: true });
    res.clearCookie("session.sig", { path: "/", httpOnly: true });
  }
  return res.redirect(
    process.env.SERVER === "development"
      ? "http://localhost:3000"
      : "https://runor.org"
  );
};

const loginSuccess = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Login success",
      user: req.user,
      token: req.user.getJWT(),
    });
  } else {
    res.status(401).json({
      success: false,
      message: "You are not logged in",
    });
  }
};

const loginFailure = async (req, res) => {
  res.status(404).json({
    success: false,
    message: "Login failed",
    user: false,
  });
};

const sendTestSMS = async (req, res) => {
  const { receiverPn } = req.body;
  sendSMS(
    receiverPn,
    `Hello ! It is runor ${Math.floor(Math.random() * 1000)}`
  );
  res.status(StatusCodes.OK).json({ msg: `Message sent to ${receiverPn}` });
};

module.exports = {
  sendTestSMS,
  login,
  register,
  updateUser,
  logout,
  loginSuccess,
  loginFailure,
};
