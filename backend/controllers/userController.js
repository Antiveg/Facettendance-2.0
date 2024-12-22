const { User, UserPhotos, Event, EventParticipants } = require('../models')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')

const getUserById = async (req, res, next) => {
    try {
        const id = +req.params.id
        const user = await User.findOne({
            attributes: {
                exclude: ['updatedAt', 'password']
            },
            where: {
                id: id
            },
            include: [
                {
                    model: UserPhotos,
                    attributes: ["photo_url"]
                }
            ]
        })

        const formattedTime = user.createdAt.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        })

        const encodedPhotos = (user.UserPhotos).map((photo) => {
            const photoPath = path.join(__dirname, '..', photo.photo_url);
            const image = fs.readFileSync(photoPath);
            return {
                name: photo.photo_url,
                photo64base: `data:image/jpeg;base64,${image.toString('base64')}`
            }
        })

        const preparedUser = {
            ...(user.toJSON()),
            createdAt: formattedTime,
            UserPhotos: encodedPhotos,
        }

        res.status(200).json({
            message: "successfully fetch user info",
            user: preparedUser
        })
    }catch(error){
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'face_data','password','email']
            }
        })
        res.status(200).json({
            message: "successfully fetch all users id & name",
            users: users
        })
    }catch(error){
        next(error)
    }
}

module.exports = { getUserById, getAllUsers }