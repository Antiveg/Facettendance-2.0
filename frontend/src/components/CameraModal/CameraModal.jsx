import React, { useState, useEffect, useRef } from "react";
import '../../global.css'
import styles from './CameraModal.module.css'
import Tag from '../Tag/Tag'
import axios from 'axios'
import * as blazeface from '@tensorflow-models/blazeface'
import '@tensorflow/tfjs'

const CameraModal = ({ onClose, event, user }) => {

    const videoRef = useRef(null)
    const captureCanvasRef = useRef(null)
    const detectionCanvasRef = useRef(null)
    const [model, setModel] = useState(null)
    const [message, setMessage] = useState('Please click button below to start the face verification')

    const closeModal = () => {
        if(videoRef.current && videoRef.current.srcObject){
            console.log("Hello World")
            const stream = videoRef.current.srcObject
            const tracks = stream.getTracks()
            tracks.forEach((track) => track.stop())
        }
        onClose(false)
    }

    useEffect(() => {
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                })
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
                const loadedModel = await blazeface.load()
                setModel(loadedModel)
                detectFaces()
            } catch (error) {
                console.error('Error accessing webcam: ', error)
            }
        }
        startWebcam()
        return () => {
            if(videoRef.current && videoRef.current.srcObject){
                const stream = videoRef.current.srcObject
                const tracks = stream.getTracks()
                tracks.forEach((track) => track.stop())
            }
        }
    }, [])

    const detectFaces = async () => {
        if (model && videoRef.current && detectionCanvasRef.current) {
            const video = videoRef.current
            const canvas = detectionCanvasRef.current
            const context = canvas.getContext('2d')

            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            const predict = async () => {
                const predictions = await model.estimateFaces(video, false)
                context.clearRect(0, 0, canvas.width, canvas.height)

                predictions.forEach((prediction) => {
                    const startX = prediction.topLeft[0]
                    const startY = prediction.topLeft[1]
                    const width = prediction.bottomRight[0] - startX
                    const height = prediction.bottomRight[1] - startY
                    context.beginPath()
                    context.rect(startX, startY, width, height)
                    context.lineWidth = 2
                    context.strokeStyle = 'red'
                    context.fillStyle = 'red'
                    context.stroke()
                    context.fillText(
                        'Face',
                        startX,
                        startY > 10 ? startY - 10 : 10
                    )
                })
                requestAnimationFrame(predict)
            }
            predict()
        }
    }

    const captureImage = async () => {
        if(videoRef.current && captureCanvasRef.current){
            const video = videoRef.current
            const canvas = captureCanvasRef.current
            const context = canvas.getContext('2d')

            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            const imageUrl = canvas.toDataURL('image/png')

            const blob = await fetch(imageUrl).then(res => res.blob())
            const formData = new FormData()
            formData.append('photo', blob, 'capturedImage.png')
            formData.append('user', user.id)

            try {
                const response = await axios.post(
                    `http://localhost:5000/event/${event.id}/attend/${user.id}`,
                    formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                    }
                )
                const result = response.data
                setMessage(result.message)
            }catch(error){
                console.log(error)
            }
        }
    }

    return (
        <div className={styles.base}>
            <div className={styles.body}>
                <button className={styles.exit_btn} onClick={closeModal}><b>X</b></button>
                <div className={styles.left_part}>
                    <div className={styles.header}>
                        <p className="small-title">PLEASE ATTEND WITH YOU FACE</p>
                        <p className="warning-text">--- Please allow access to your camera ---</p>
                    </div>
                    <div className={styles.liveContainer}>
                        <video ref={videoRef} autoPlay playsInline width="100%" height="auto"></video>
                        <canvas ref={detectionCanvasRef} className={styles.canvas}></canvas>
                        <canvas ref={captureCanvasRef} style={{ display: 'none' }}></canvas>
                    </div>
                    <div className={styles.notice}>
                        <p className="small-details text-center">{message}</p>
                    </div>
                    <button className={styles.photo_btn} onClick={captureImage}><p className="small-text">Verify</p></button>
                </div>
                <div className={styles.right_part}>
                    <div className={styles.base_details}>
                        <img src="https://joomly.net/frontend/web/images/googlemap/map.png" alt="Not Found!" className={styles.map_img}/>
                        <p className="small-text">Title : {event.title}</p>
                        <p className="small-text">Location : {event.location}</p>
                        <p className="small-text">Time : {event.start_time} s.d. {event.end_time}</p>
                        <p className="small-text">Made by : {user.name} </p>
                        <p className="small-text flex-wrap">Participants : 
                        {(event.EventParticipants).map((participant) => { return (
                            <Tag key={participant.userId} content={participant.User.name}/>
                        )})}
                        </p>
                        <p className="small-text">Event Description : {event.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CameraModal