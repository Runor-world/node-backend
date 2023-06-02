const {StatusCodes}  = require('http-status-codes')
const {UserModel} = require('../models/auth')
const { UserServiceProfileModel, UserProfileModel } = require('../models/profile')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


const getAllServiceMen = async(req, res) => {
    const {key, location} = req.body

    // fetch serviceProviders with active and verified user account
    const serviceMen = await UserServiceProfileModel.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [
                            {accountType: "service man"},
                            {accountType: "business"}
                        ]
                    },
                ]
            }
        }, 
        {
            $lookup: {
                from: 'profiles',
                localField: 'user',
                foreignField: 'user',
                as: 'profile'
            }
        },{
            $unwind: '$profile'
        }, 
    ])
    const result = await UserServiceProfileModel.populate(serviceMen, ['user', 'services'])
    res.status(StatusCodes.OK).json({serviceMen: result, nHits: result.length})
}

const getServiceMan = async(req, res) =>{
    const {id: serviceProviderId} = req.params
    const serviceMan = await UserServiceProfileModel.aggregate([
        {
            $match: {
                _id: ObjectId(serviceProviderId)
            }
        },
        {
            $lookup: {
                from: 'profiles',
                localField: 'user',
                foreignField: 'user',
                as: 'profile'
            }
        },{
            $unwind: '$profile'
        }, 
    ])
    const result = await UserServiceProfileModel.populate(serviceMan[0], ['user', 'services'])
    res.status(StatusCodes.OK).json({serviceProvider: result?? {}, success: true})
}

const getLocationServiceMen = async(req, res) =>{
    const serviceMen = [] 
    res.status( StatusCodes.OK).json({serviceMen, nHits:serviceMen.length})
}

const serviceMenSearch = async(req, res) =>{
    const serviceMen = [] 
    res.status( StatusCodes.OK).json({serviceMen, nHits:serviceMen.length})
}
module.exports = {getAllServiceMen, getServiceMan}