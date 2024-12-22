import React, { useEffect, useState } from 'react'
import EventCard from '../../components/EventCard/EventCard'
import Loading from '../Loading/Loading'
import styles from './Home.module.css'
import '../../global.css'
import axios from 'axios'

const Home = ({user}) => {

    const [events, setEvent] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`http://localhost:5000/events/user/${user.id}`, {
                    withCredentials: true
                });
                setEvent(response.data.data);
            } catch (error) {
                console.log('Error fetching user-related events', error);
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, []);

    if(loading){
        return <Loading loadingMsg="loading... fetching events data now..."/>
    }

    const userEvents = events

    return (
        <div className={styles.base}>
            <div className={styles.header}>
                <h1 className='big-title'>Welcome, {user.name}...</h1>
                <p>Here's where all events related to you appear!</p>
            </div>
            <div className={styles.cardContainer}>
                {!userEvents && <div>failed to fetch all user's event data...</div>}
                {(userEvents && userEvents.length <= 0) && <div><h2>No Event Yet...</h2></div>}
                {(userEvents && userEvents.length > 0) && 
                (userEvents).map((event) => (
                    <EventCard key={event.id} event={event.Event} user={user} attendance={event.status}/>
                ))}
            </div>
        </div>
    );
};

export default Home;