const {StatusCodes} = require('http-status-codes')
const { BadRequestError } = require('../errors')
const HiringModel = require('../models/hiring')


const createHiring = async( req, res) => {
    const {
        service: serviceId, 
        serviceProvider: serviceProviderId,
        status
    } = req.body

    const {userID: serviceConsumerId} = req.user
    
    if(!serviceId){
        throw new BadRequestError('Please provide service ID')
    }
    if(!serviceProviderId){
        throw new BadRequestError('Please provide service provider ID')
    }
    if(!serviceConsumerId){
        throw new BadRequestError('Please provide service consumer ID')
    }

    let hiringStatus = ''
    if(!status){
        hiringStatus = 'pending'
    }
    
    const hiring = await HiringModel.create({
        ...req.body,
        serviceConsumer: serviceConsumerId,
        status: hiringStatus
    })
    
    res.status(StatusCodes.CREATED).json({hiring, success: true, msg: 'Hiring created'})
}

const getAllHiring = async(req, res) => {
    const hirings = await HiringModel.find()
    res.status(StatusCodes.OK).json({hirings, count: hirings.length})
}

const updateHiring = async( req, res) => {
    res.status(StatusCodes.OK).json({})
}

const deleteHiring = async( req, res) => {
    res.status(StatusCodes.OK).json({})
}

module.exports = {
    createHiring, 
    getAllHiring,
    updateHiring, 
    deleteHiring
}