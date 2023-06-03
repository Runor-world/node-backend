const { StatusCodes } = require("http-status-codes");
const { UserModel } = require("../models/auth");
const { BadRequestError } = require("../errors");

const updateUserStatus = async (req, res) => {
  const { status, userID } = req.body;
  if (status === undefined) {
    throw new BadRequestError("Status is required");
  }

  if (!userID) {
    throw new BadRequestError("User ID is required");
  }
  const user = await UserModel.findOne({ _id: userID });
  if (!user) {
    throw new BadRequestError("User not found");
  }

  user.active = status;
  await user.save();
  res.status(StatusCodes.OK).json({
    success: true,
    msg: status
      ? "User successfully deactivated"
      : "User successfully activated",
    user,
  });
};

const getAllUsers = async (req, res) => {
  const users = await UserModel.aggregate([
    {
      $lookup: {
        from: "profiles",
        localField: "_id",
        foreignField: "user",
        as: "profile",
      },
    },
    {
      $unwind: "$profile",
    },
    // {
    //     $match: { 'role': 'admin'}
    // }
  ]);
  res.status(StatusCodes.OK).json({ users, nHits: users.length });
};

const userSearchByName = async (req, res) => {
  const { key } = req.body;
  const users = await UserModel.aggregate([
    {
      $lookup: {
        from: "profiles",
        localField: "_id",
        foreignField: "user",
        as: "profile",
      },
    },
    {
      $unwind: "$profile",
    },
    {
      $match: {
        $or: [
          {
            firstName: { $regex: key, $options: "i" },
          },
          {
            otherName: { $regex: key, $options: "i" },
          },
        ],
      },
    },
  ]);
  res.status(StatusCodes.OK).json({ users, nHit: users.length });
};

module.exports = {
  getAllUsers,
  userSearchByName,
  updateUserStatus,
};
