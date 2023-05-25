const {StatusCodes}  = require('http-status-codes')
const {UserModel} = require('../models/auth')
const { UserServiceProfileModel, UserProfileModel } = require('../models/profile')


const getAllServiceMen = async(req, res) => {
    const {key, location} = req.body

    const serviceMen = await UserServiceProfileModel.aggregate([
        {
            $match: {
                $or: [
                    {accountType: "service consumer"},
                    {accountType: "business"}
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
    const result = await UserServiceProfileModel.populate(serviceMen, 'user')
    res.status(StatusCodes.OK).json({serviceMen: result, nHits: result.length})
}

const getLocationServiceMen = async(req, res) =>{
    const serviceMen = [] 
    res.status( StatusCodes.OK).json({serviceMen, nHits:serviceMen.length})
}

const serviceMenSearch = async(req, res) =>{
    const serviceMen = [] 
    res.status( StatusCodes.OK).json({serviceMen, nHits:serviceMen.length})
}
module.exports = {getAllServiceMen}