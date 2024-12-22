import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Loading from '../Loading/Loading'
import ErrorPage from '../ErrorPage/ErrorPage'
import styles from './Profile.module.css'
import '../../global.css'

const Profile = ({user}) => {

    const [userData, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`http://localhost:5000/user/${user.id}`, {
                    withCredentials: true
                })
                setUser(response.data.user)
            }catch(error){
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if(loading){
        return <Loading loadingMsg='fetching user information now...'/>
    }

    const currentUser = userData

    if(!currentUser){
        return <ErrorPage statusNumber={403} statusMsg={'Unauthenticated'} addMsg={'Looks like you user id didnt exist in database. Please try login again...'} route={'/login'} routePage={'Login'}/>
    }

    return (
        <div className={styles.base}>
            <h2>User Profile</h2>

            <div className={styles.basicInfo}>
                <p className="ellipsis"><strong>ID: </strong> {currentUser.id}</p>
                <p className="ellipsis"><strong>Name: </strong> {currentUser.name}</p>
                <p className="ellipsis"><strong>Email: </strong> {currentUser.email}</p>
                <p className="ellipsis"><strong>Password: </strong> ********</p>
                <p className="ellipsis"><strong>Face data: </strong> {currentUser.face_data}</p>
                <p className="ellipsis"><strong>Account created on: </strong> {currentUser.createdAt}</p>
            </div>
            <p className="">Pictures You Uploaded Previously</p>
            <div className={styles.img_container}>
                {currentUser.UserPhotos && currentUser.UserPhotos.length > 0 ? 
                    (currentUser.UserPhotos.map((photo, index) => (
                        <img
                        key={index}
                        src={photo.photo64base}
                        alt={`User Photo ${index + 1}`}
                        className={styles.photo}
                        />
                    ))) : 
                    ( <p>No photos uploaded</p> )
                }
            </div>
        </div>
    );
};

export default Profile;