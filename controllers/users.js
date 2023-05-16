const {StatusCodes}  = require('http-status-codes')
const {UserModel} = require('../models/auth')


const getAllUsers = async(req, res) => {
    const users = await UserModel.aggregate(
        [ 
            { $lookup: 
                {
                    from: 'profiles', 
                    localField: '_id', 
                    foreignField: 'user',
                    as: 'profile'
                }
            },
            {
                $unwind: '$profile'
            },
            // {
            //     $match: { 'role': 'admin'}
            // }
        ]
    )
    res.status(StatusCodes.OK).json({users, nHits: users.length})
}

module.exports = {
    getAllUsers
}