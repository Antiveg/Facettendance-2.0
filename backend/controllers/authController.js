const { User, UserPhotos, Event, EventParticipants } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')
const secretKey = process.env.JWT_SECRETKEY
const axios = require('axios')
const FormData = require('form-data')

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email: email }
        })

        if(!user){
            const error = new Error('User not found')
            error.name = 'USER_NOT_FOUND'
            return next(error)
        }

        const match = await bcrypt.compare(password, user.password)
        if(!match){
            const error = new Error('Invalid credentials')
            error.name = 'INVALID_CREDENTIALS'
            return next(error)
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            secretKey,
            { expiresIn: '10h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000,
            path: '/',
        })

        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        })
    } catch (error) {
        next(error);
    }
}

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        const newFolder = path.join(__dirname, '..','uploads','users',`${newUser.id}`)
        if(!fs.existsSync(newFolder)){
            fs.mkdirSync(newFolder, {recursive: true})
        }

        for(const file of req.files){
            const oldFilePath = file.path
            const newFilePath = path.join(newFolder, file.filename)
            await fs.promises.rename(oldFilePath, newFilePath)
            file.path = path.join('uploads', 'users', `${newUser.id}`, file.filename)
        }

        const formData = new FormData()

        for (const file of req.files){
            UserPhotos.create({
                userId: newUser.id,
                photo_url: file.path,
            })
            formData.append('files', fs.createReadStream(path.join(__dirname, '..', file.path)))
        }

        try {
            const response = await axios.post('http://localhost:8000/encodes', formData, {
                headers: {
                    ...formData.getHeaders()
                }
            })
            const finalEncoding = response.data.final_encoding
            console.log(response)
            if(finalEncoding){
                await User.update(
                    { face_data: finalEncoding },
                    { where: { id: newUser.id } }
                )
            }
        }catch(error){
            console.log(error)
        }

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                face_data: newUser.face_data
            }
        })
    }catch (error){
        next(error);
    }
}

const logout = (req, res, next) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: true, path: '/' })
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
        next(error)
    }
}

module.exports = { login, register, logout };
