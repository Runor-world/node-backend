const {StatusCodes}  = require('http-status-codes')
const {ServiceCategoryModel} = require('../models/serviceCategory')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllServices = async (req, res) => {
    const services = await ServiceCategoryModel.find()

    res.status(StatusCodes.OK).json({
        services
    })
}

const createService = async(req, res) => {
    const {name, description, active} = req.body
    if(!name || !description){
        throw new BadRequestError('Name and description required')
    }

    const newService = await ServiceCategoryModel.create({name, description, active})

    res.status(StatusCodes.CREATED).json({
        success: true, 
        service: newService,
        msg: 'Service created'
    })
}

const updateService = async(req, res) => {
    console.log(req.body)
    const {_id, name, description, active} = req.body
    console.log(_id, name, description, active)
    const service = await ServiceCategoryModel.findOne({_id})

    if(!service){
        throw new BadRequestError(`Service with ID ${_id} not found`)
    }

    if(active===undefined || !name || !description) {
        throw new BadRequestError('Name description and active required')
    }

    service.name  = name
    service.description = description
    service.active = active
    await service.save()

    res.status(StatusCodes.OK).json({
        success: true,
        service, 
        msg: 'Service updated'
    })
}

module.exports  = {
    getAllServices,
    createService,
    updateService
}