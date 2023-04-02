const { BadRequestError, UnAuthenticatedError } = require('../errors')
const {UserProfileModel, UserServiceProfileModel} = require('../models/profile')
const {StatusCodes} = require('http-status-codes')
const {UserModel} = require('../models/auth')

// profile controllers:

const updateProfileInfo = async(req, res) => {
    const {bio, dateOfBirth:birthday, city, country, address, firstName, otherName} = req.body
    const {userID} = req.user

    if(!bio || !birthday || !city || !country || !firstName || !otherName || !address ){
        throw new BadRequestError('Bio, birthday, address, city, country, first name and other name required')
    }
    
    // update personal info:
    const user = await UserModel.findOne({_id: userID})
    if (!user){
        throw new UnAuthenticatedError('User does not exist')
    }
    user.firstName = firstName
    user.otherName = otherName
    user.location = address
    await user.save()

    let newUserProfile = null
    const userProfile = await UserProfileModel.findOne({user_id: userID})

    if (!userProfile){
        // create profile if not created
        newUserProfile = await UserProfileModel.create({user: userID})
    }else{
        newUserProfile = null // clear newUserProfile when updating
        userProfile.bio = bio 
        userProfile.birthday = birthday
        userProfile.city = city
        userProfile.country = country
        await userProfile.save()
    }

    res.status(StatusCodes.OK).json(
        {
            personalProfile: userProfile ?? newUserProfile, 
            user,
            message: 'profile updated successfully',
            success: true
        }
    )
}

const updateProfilePhoto = async(req, res) => {
    const {photo} = req.body

    if(!photo){
        throw new BadRequestError('Please provide photo')
    }

    const userProfile = await UserProfileModel.findOne({user_id: req.user.userID})
    if(!userProfile){
        throw new BadRequestError('User profile not found')
    }

    userProfile.photo = photo
    await userProfile.save()

    res.status(StatusCodes.OK).json(
        {
            profile: userProfile, 
            message: 'profile photo updated successfully',
            success: true
        }
    )

}

const updateProfileBackgroundPhoto = async(req, res) => {
    const {backgroundPhoto} = req.body

    if(!backgroundPhoto){
        throw new BadRequestError('Please provide background photo')
    }

    const userProfile = await UserProfileModel.findOne({user_id: req.user.userID})
    if(!userProfile){
        throw new BadRequestError('User profile not found')
    }

    userProfile.backgroundPhoto = backgroundPhoto
    await userProfile.save()

    res.status(StatusCodes.OK).json(
        {
            profile: userProfile, 
            message: 'profile bg photo updated successfully',
            success: true
        }
    )

}

const createUserServiceProfile = async(req, res) =>{ 
    res.json('creating user service proifle')
}

const updateUserServiceProfile = async(req, res) =>{
    res.json('updating user service profile')
}

const getAllProfiles = async(req, res) => {
    // fetches both personal and service info
    const {userID} = req.user
    const personalProfile = await UserProfileModel.findOne({user_id: userID})
    const serviceProfile = await UserServiceProfileModel.findOne({user_id: userID})

    res.status(StatusCodes.OK).json({
        personalProfile,
        serviceProfile, 
    })
}

module.exports = {
    updateProfileInfo, 
    updateProfilePhoto,
    updateProfileBackgroundPhoto,
    createUserServiceProfile,
    updateUserServiceProfile,
    getAllProfiles
}