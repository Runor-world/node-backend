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

    const newService = await ServiceCategoryModel.create({name, description})

    res.status(StatusCodes.CREATED).json({
        success: true, 
        service: newService,
        msg: 'Service created'
    })

}

const updateService = async(req, res) => {
    const {serviceID, name, description, active} = req.body
    console.log(serviceID, name, description, active)
    const service = await ServiceCategoryModel.findOne({_id: serviceID})

    if(!service){
        throw new BadRequestError(`Service with ID ${serviceID} not found`)
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
        service
    })
}

module.exports  = {
    getAllServices,
    createService,
    updateService
}