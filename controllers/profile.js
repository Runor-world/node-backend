const { BadRequestError, UnAuthenticatedError } = require("../errors");
const {
  UserProfileModel,
  UserServiceProfileModel,
} = require("../models/profile");
const { StatusCodes } = require("http-status-codes");
const { UserModel } = require("../models/auth");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { getTodayFormatedDate } = require("../utils/date");

// profile controllers:

const updateProfileInfo = async (req, res) => {
  const {
    bio,
    dateOfBirth: birthday,
    city,
    country,
    address,
    firstName,
    otherName,
  } = req.body;
  const { userID } = req.user;

  if (
    !bio ||
    !birthday ||
    !city ||
    !country ||
    !firstName ||
    !otherName ||
    !address
  ) {
    throw new BadRequestError(
      "Bio, birthday, address, city, country, first name and other name required"
    );
  }

  // update personal info:
  const user = await UserModel.findOne({ _id: userID });
  if (!user) {
    throw new UnAuthenticatedError("User does not exist");
  }
  user.firstName = firstName;
  user.otherName = otherName;
  user.location = address;
  await user.save();

  let newUserProfile = null;
  const userProfile = await UserProfileModel.findOne({ user: userID });

  if (!userProfile) {
    // create profile if not created
    newUserProfile = await UserProfileModel.create({
      user: userID,
      bio: "my beatiful bio",
      birthday: getTodayFormatedDate(),
      city: "my city",
      country: "my country",
    });
  } else {
    newUserProfile = null; // clear newUserProfile when updating
    userProfile.bio = bio;
    userProfile.birthday = birthday;
    userProfile.city = city;
    userProfile.country = country;
    await userProfile.save();
  }

  res.status(StatusCodes.OK).json({
    personalProfile: userProfile ?? newUserProfile,
    user,
    message: "profile updated successfully",
    success: true,
  });
};

const updateProfilePhoto = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("File not uploaded");
  }
  const photo = req.files.image;

  if (!photo.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload image");
  }

  const maxSize = 1024 * 1024;
  if (photo.size > maxSize) {
    throw new BadRequestError("Image should not be more than 1MB");
  }

  if (!photo) {
    throw new BadRequestError("Please provide background photo");
  }

  const userProfile = await UserProfileModel.findOne({ user: req.user.userID });
  if (!userProfile) {
    throw new BadRequestError("User profile not found");
  }
  const result = await cloudinary.uploader.upload(photo.tempFilePath, {
    use_filename: true,
    folder: "profile-photo",
  });

  userProfile.photo = result.secure_url;
  await userProfile.save();
  fs.unlinkSync(photo.tempFilePath);
  res.status(StatusCodes.OK).json({
    profile: userProfile,
    msg: "profile photo updated successfully",
    success: true,
  });
};

const updateProfileBackgroundPhoto = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("File not uploaded");
  }
  const backgroundPhoto = req.files.image;

  if (!backgroundPhoto.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload image");
  }

  const maxSize = 1024 * 1024;
  if (backgroundPhoto.size > maxSize) {
    throw new BadRequestError("Image should not be more than 1MB");
  }

  if (!backgroundPhoto) {
    throw new BadRequestError("Please provide background photo");
  }

  const userProfile = await UserProfileModel.findOne({ user: req.user.userID });
  if (!userProfile) {
    throw new BadRequestError("User profile not found");
  }
  const result = await cloudinary.uploader.upload(
    backgroundPhoto.tempFilePath,
    {
      use_filename: true,
      folder: "background-photo",
    }
  );

  userProfile.backgroundPhoto = result.secure_url;
  await userProfile.save();
  fs.unlinkSync(backgroundPhoto.tempFilePath);
  res.status(StatusCodes.OK).json({
    profile: userProfile,
    message: "profile bg photo updated successfully",
    success: true,
  });
};

const createUserServiceProfile = async (req, res) => {
  const { accountType, service } = req.body;
  const { userID } = req.user;

  if (!accountType) {
    throw new BadRequestError("Please provide account type");
  }
  if (!service) {
    throw new BadRequestError("Please provide service");
  }

  // check if service profile exist
  const existingServiceProfile = await UserServiceProfileModel.findOne({
    user: userID,
  });

  if (existingServiceProfile) {
    throw new BadRequestError("Service profile created already");
  }

  const user = await UserModel.findOne({ _id: userID });
  if (!user) {
    throw new UnAuthenticatedError(`User with ID ${userID} not found`);
  }

  const userServiceProfile = await UserServiceProfileModel.create({
    accountType,
    services: [service],
    user: userID,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: "User service profile created",
    userServiceProfile,
  });
};

const updateUserServiceProfile = async (req, res) => {
  const { accountType, service } = req.body;
  if (!accountType) {
    throw new BadRequestError("Please provide account type");
  }
  if (!service) {
    throw new BadRequestError("Please provide service");
  }

  const userServiceProfile = await UserServiceProfileModel.findOne({
    user: req.user.userID,
  });
  if (!userServiceProfile) {
    throw new BadRequestError(
      `Service profile for user with ID ${req.user.userID} not found`
    );
  }

  userServiceProfile.service = service;
  userServiceProfile.accountType = accountType;
  await userServiceProfile.save();

  res.status(StatusCodes.OK).json({
    success: true,
    userServiceProfile,
    msg: "Updated successfully",
  });
};

const getAllProfiles = async (req, res) => {
  // fetches both personal and service info
  const { userID } = req.user;
  const personalProfile = await UserProfileModel.findOne({ user: userID });
  const serviceProfile = await UserServiceProfileModel.findOne({
    user: userID,
  }).populate("services");

  res.status(StatusCodes.OK).json({
    personalProfile,
    serviceProfile,
  });
};

const createUserPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    throw new BadRequestError("Please provide a phone number");
  }
  const user = await UserModel.findOne({ _id: req.user.userID });

  if (!user) {
    throw new UnAuthenticatedError("User not found! Pls login");
  }

  const existingNumber = await UserModel.findOne({
    phoneNumber: phoneNumber,
    _id: { $ne: req.user.userID },
  });

  if (existingNumber) {
    throw new BadRequestError("Number is used by another user");
  }

  // save phone number
  user.phoneNumber = phoneNumber;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ success: true, user, msg: `${phoneNumber} successfully saved` });
};

module.exports = {
  updateProfileInfo,
  updateProfilePhoto,
  updateProfileBackgroundPhoto,
  createUserServiceProfile,
  updateUserServiceProfile,
  getAllProfiles,
  createUserPhoneNumber,
};
