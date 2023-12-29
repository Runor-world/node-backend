const { StatusCodes } = require("http-status-codes");

const { UserServiceProfileModel } = require("../models/profile");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getAllServiceMen = async (req, res) => {
  let { key, page, items_per_page } = req.query;
  page = parseInt(page);
  items_per_page = parseInt(items_per_page);
  console.log(key, page, items_per_page);
  // define individual pipelines

  // fetch serviceProviders with active and verified user account
  const serviceMen = await UserServiceProfileModel.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [{ accountType: "service man" }, { accountType: "business" }],
          },
        ],
      },
    },
    {
      $lookup: {
        from: "profiles",
        localField: "user",
        foreignField: "user",
        as: "profile",
      },
    },
    {
      $unwind: "$profile",
    },
    {
      $lookup: {
        from: "users",
        localField: "_idr",
        foreignField: "user",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "servicecategories",
        localField: "services",
        foreignField: "_id",
        as: "services",
      },
    },
    {
      $match: {
        $or: [
          {
            "services.name": {
              $regex: key,
              $options: "i",
            },
          },
          {
            "services.description": {
              $regex: key,
              $options: "i",
            },
          },
        ],
      },
    },
    {
      $skip: (page - 1) * items_per_page,
    },
    {
      $limit: items_per_page,
    },
  ]);

  res.status(StatusCodes.OK).json({ serviceMen, nHits: serviceMen.length });
};

const getServiceMan = async (req, res) => {
  const { id: serviceManUserId } = req.params;
  const serviceMan = await UserServiceProfileModel.aggregate([
    {
      $match: {
        user: ObjectId(serviceManUserId),
      },
    },
    {
      $lookup: {
        from: "profiles",
        localField: "user",
        foreignField: "user",
        as: "profile",
      },
    },
    {
      $unwind: "$profile",
    },
  ]);
  const result = await UserServiceProfileModel.populate(serviceMan[0], [
    "user",
    "services",
  ]);
  res.status(StatusCodes.OK).json({ serviceMan: result ?? {}, success: true });
};

const getLocationServiceMen = async (req, res) => {
  const serviceMen = [];
  res.status(StatusCodes.OK).json({ serviceMen, nHits: serviceMen.length });
};

const serviceMenSearch = async (req, res) => {
  const serviceMen = [];
  res.status(StatusCodes.OK).json({ serviceMen, nHits: serviceMen.length });
};
module.exports = { getAllServiceMen, getServiceMan };
