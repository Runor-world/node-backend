const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const HiringModel = require("../models/hiring");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const createHiring = async (req, res) => {
  const {
    service: serviceId,
    serviceProvider: serviceProviderId,
    status,
  } = req.body;

  const { userID: serviceConsumerId } = req.user;
  console.log("userId: ", serviceConsumerId, "providerID: ", serviceProviderId);

  if (!serviceId) {
    throw new BadRequestError("Please provide service ID");
  }
  if (!serviceProviderId) {
    throw new BadRequestError("Please provide service provider ID");
  }
  if (!serviceConsumerId) {
    throw new BadRequestError("Please provide service consumer ID");
  }

  if (serviceConsumerId === serviceProviderId) {
    throw new BadRequestError("Consumer and service cannot be the same");
  }

  let hiringStatus = "";
  if (!status) {
    hiringStatus = "pending";
  }

  const hiring = await HiringModel.create({
    ...req.body,
    serviceConsumer: serviceConsumerId,
    status: hiringStatus,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ hiring, success: true, msg: "Hiring created" });
};

const getPendingHiringByUser = async (req, res) => {
  const { userID } = req.user;

  const result = await HiringModel.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [
              { serviceConsumer: ObjectId(userID) },
              { serviceProvider: ObjectId(userID) },
            ],
          },
          { status: "pending" },
        ],
      },
    },
    {
      $lookup: {
        from: "profiles",
        localField: "serviceProvider",
        foreignField: "user",
        as: "profile",
      },
    },
    {
      $unwind: "$profile",
    },
  ]);

  const hirings = await HiringModel.populate(result, [
    "serviceProvider",
    "serviceConsumer",
    "service",
  ]);
  res.status(StatusCodes.OK).json({ hirings, count: hirings.length });
};

const getAllHiringByUser = async (req, res) => {
  // get all people or businesses hired by a user
  const { userID } = req.user;
  const result = await HiringModel.aggregate([
    {
      $match: {
        serviceConsumer: ObjectId(userID),
      },
    },
    {
      $lookup: {
        from: "profiles",
        localField: "serviceProvider",
        foreignField: "user",
        as: "servicemanProfile",
      },
    },
    {
      $unwind: "$servicemanProfile",
    },
  ]);
  console.log(result);
  const hirings = await HiringModel.populate(result, [
    "serviceProvider",
    "serviceConsumer",
    "service",
  ]);
  res.status(StatusCodes.OK).json({ hirings, count: hirings.length });
};

const getAllUserJobs = async (req, res) => {
  // get all jobs serviceman/bussines has when they are hired
  const { userID } = req.user;
  const result = await HiringModel.aggregate([
    {
      $match: {
        serviceProvider: ObjectId(userID),
      },
    },
    {
      $lookup: {
        from: "profiles",
        localField: "serviceProvider",
        foreignField: "user",
        as: "servicemanProfile",
      },
    },
    {
      $unwind: "$servicemanProfile",
    },
  ]);
  const jobs = await HiringModel.populate(result, [
    "serviceProvider",
    "serviceConsumer",
    "service",
  ]);
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getAllHiring = async (req, res) => {
  const hirings = await HiringModel.find();
  res.status(StatusCodes.OK).json({ hirings, count: hirings.length });
};

const updateHiring = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

const deleteHiring = async (req, res) => {
  res.status(StatusCodes.OK).json({ hiring });
};

module.exports = {
  createHiring,
  getAllHiring,
  getPendingHiringByUser,
  getAllHiringByUser,
  updateHiring,
  deleteHiring,
  getAllUserJobs,
};
