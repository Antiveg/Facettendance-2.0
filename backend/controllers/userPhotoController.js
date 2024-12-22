const { User, UserPhotos, Event, EventParticipants } = require('../models')

const getPhotosByUserId = async (req, res, next) => {
    try {
        const { id } = +req.headers['user']
    }catch(error){
        next(error)
    }
}

module.exports = { getPhotosByUserId }