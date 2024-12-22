const { User, UserPhotos, Event, EventParticipants } = require('../models')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'creatorId']
            },
            include: [
                {
                    model: User,
                    attributes: ['name','email','id'],
                },
                {
                    model: EventParticipants,
                    attributes: null,
                    include: [
                        {
                            model: User,
                            attributes: ["name", "id", "email"]
                        }
                    ]
                }
            ]
        })
        
        const formattedEvents = events.map((event) => {
            const start_time = new Date(event.start_time)
            const end_time = new Date(event.end_time)

            const formattedStartTime = start_time.toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            })

            const formattedEndTime = end_time.toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            })

            return {
                ...event.toJSON(),
                start_time: formattedStartTime,
                end_time: formattedEndTime
            }
        })

        res.status(200).json({
            message: "Successfully fetched all events info!",
            events: formattedEvents,
            user: req.user
        });
    }catch(error){
        next(error)
    }
}

const getEventById = async (req, res, next) => {
    try {
        const id = +req.params.id
        const event = await Event.findOne({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            where: {
                id: id
            }
        })

        if(!event){
            res.status(404).json({
                message: `event ${id} not found`
            })
        }else{
            res.status(200).json({
                message: `event ${id} found`,
                data: event
            })
        }
    }catch(error){
        next(error)
    }
}

const createEvent = async (req, res, next) => {
    try {
        const { title, start_time, end_time, location, description, participants, creator } = req.body

        const newEvent = await Event.create({
            title: title,
            start_time: start_time, 
            end_time: end_time, 
            location: location, 
            description: description,
            creatorId: creator
        })

        const allParticipants = participants.includes(creator) ? participants : [...participants, creator];
        
        const newParticipants = await Promise.all(allParticipants.map(async (id) => {
            return await EventParticipants.create({
                userId: id,
                eventId: newEvent.id,
                img_proof: null,
                status: false,
            })
        }))

        res.status(201).json({
            message: "event successfully created!",
            event: {
                newEvent,
                participants: newParticipants
            }
        })
    }catch(error){
        next(error)
    }
}

const getEventsByUserId = async (req, res, next) => {
    try {
        const id = +req.params.id
        const events = await EventParticipants.findAll({
            where: {
                userId: id
            },
            include: [
                {
                    model: Event,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    include: [
                        {
                            model: EventParticipants, 
                            attributes: ['userId'],
                            include: [
                                {
                                    model: User,
                                    attributes: ['id', 'name'] 
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        res.status(200).json({
            message: "successfully fetch all event associated with logged user along with its participants",
            data: events
        })
    }catch(error){
        next(error)
    }
}

const validateEventAttendance = async (req, res, next) => {
    try {
        const eventId = +req.params.eventId
        const userId = +req.params.userId

        const users = await User.findAll({
            attributes: ['id','face_data']
        })

        const newFolder = path.join(__dirname, '..','uploads','event',`${eventId}`)
        if(!fs.existsSync(newFolder)){
            fs.mkdirSync(newFolder, {recursive: true})
        }

        const file = req.file
        const oldFilePath = file.path
        const newFilePath = path.join(newFolder, file.filename)
        await fs.promises.rename(oldFilePath, newFilePath)
        file.path = path.join('uploads', 'event', `${eventId}`, file.filename)

        const formData = new FormData()
        formData.append('file', fs.createReadStream(path.join(__dirname, '..', file.path)))
        formData.append('users', JSON.stringify(users))

        const response = await axios.post('http://localhost:8000/verify', formData, {
            headers: {
                ...formData.getHeaders()
            }
        })

        const result = response.data

        if(result.message === "Warning"){
            res.status(200).json({
                message: `No faces detected`,
                status: false,
            })
        }else if(response.data.match_result !== "None"){
            
            const realuser = await User.findOne({
                where: {
                    id: result.match_userId
                }
            })

            if(userId !== result.match_userId){

                const fakeuser = await User.findOne({
                    where: {
                        id: result.match_userId
                    }
                })
                res.status(200).json({
                    message: `You're ${fakeuser.name} (ID: ${fakeuser.id}), you're not ${realuser.name} (ID: ${realuser.id}), `,
                    status: result.match_result,
                    similarity: (1 - result.match_distance) * 100,
                    user: fakeuser
                })
            }else{
                const numberUpdated = await EventParticipants.update(
                    {
                        status: result.match_result,
                        img_proof: file.path,
                        updatedAt: new Date()
                    }, {
                        where: {
                            userId: userId,
                            eventId: eventId
                        }
                    }
                )

                const updatedEventAttendance = await EventParticipants.findOne({
                    where: {
                        userId: userId,
                        eventId: eventId
                    }
                })

                res.status(200).json({
                    message: `Hello, ${realuser.name} (ID: ${realuser.id}). Your attendance has been recorded!`,
                    status: result.match_result,
                    similarity: (1 - result.match_distance) * 100,
                    attendance: updatedEventAttendance
                })
            }
        }else{
            res.status(200).json({
                message: "Who are you? Your face is not recognized...",
                status: false,
            })
        }
    }catch(error){
        next(error)
    }
}

module.exports = { getAllEvents, getEventById, createEvent, getEventsByUserId, validateEventAttendance }