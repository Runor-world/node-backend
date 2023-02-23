const {StatusCodes} = require('http-status-codes')

const createJob = async(req, res) => {
    res.status(StatusCodes.OK).send('create job')
}

const getSingleJob = async (req, res) =>{
    res.status(StatusCodes.OK).send('get single Job')
}

const getAllJobs = async (req, res) => {
    res.status(StatusCodes.OK).send('Get all Jobs')
}

const deleteJob = async(req, res) => {
    res.status(StatusCodes.OK).send('delete job')
}

const updateJob = async(req, res) => {
    res.status(StatusCodes.OK).send('update job')
}


module.exports = {
    createJob,
    deleteJob,
    updateJob,
    getAllJobs,
    getSingleJob
}