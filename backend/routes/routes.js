const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate')
const errorHandler = require('../middlewares/errorHandling')
const { login, register, logout } = require('../controllers/authController')
const { validateEventAttendance, getAllEvents, getEventById, createEvent, getEventsByUserId } = require('../controllers/eventController')
const { getUserById, getAllUsers } = require('../controllers/userController')
const uploadPhoto = require('../middlewares/multerPhoto')
const uploadPhotos = require('../middlewares/multerPhotos')

router.post('/auth/login', login)
router.post('/auth/register', uploadPhotos, register)

router.use(authenticate)
router.post('/auth/logout', logout)
router.get('/events', getAllEvents)
router.get('/event/:id', getEventById)
router.post('/event/:eventId/attend/:userId', uploadPhoto, validateEventAttendance)
router.get('/events/user/:id', getEventsByUserId)
router.post('/event/create', createEvent)
router.get('/user/:id', getUserById)
router.get('/users', getAllUsers)

router.use(errorHandler)

module.exports = router;