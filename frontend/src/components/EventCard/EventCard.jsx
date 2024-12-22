import React, { useState } from "react";
import styles from './EventCard.module.css'
import CameraModal from '../CameraModal/CameraModal'
import Tag from '../Tag/Tag'
import '../../global.css'

const EventCard = ({ event, user, attendance }) => {

    const [modalVisible, setModalVisibility] = useState(false)
    const toggleVisibility = () => { setModalVisibility(!modalVisible)}

    const currentTime = new Date()
    const startEventTime = new Date(event.start_time)
    const endEventTime = new Date(event.end_time)

    const style = {}
    if(attendance){
        style.border = '2px solid lightgreen'
    }else if(currentTime < startEventTime){
        style.border = '2px solid gray'
    }else if(currentTime >= startEventTime && currentTime <= endEventTime){
        style.border = '2px solid orange'
    }else{
        style.border = '2px solid red'
    }

    return (
        <div className={styles.card} style={style}>
            <div className={styles.eventDetails}>
                <p className="medium-title">{event.title}</p>
                <hr />
                <p className="small-text">Location : {event.location}</p>
                <p className="small-text">Time : {event.start_time} s.d. {event.end_time}</p>
                <p className="small-text">Owner : {user.id} - {user.name} ({user.email})</p>
                <div className={styles.participantContainer}>
                    <p className="small-text inline">Participant :</p>
                    {(event.EventParticipants).length > 0 &&
                        <>
                            {(event.EventParticipants).slice(0, 3).map((participant) => {
                                return <Tag key={participant.userId} content={participant.User.name}/>
                            })}
                            {(event.EventParticipants).length > 3 && (
                                <Tag content={`+${(event.EventParticipants).length - 3}`}/>
                            )}
                        </>
                    }
                </div>
            </div>
            <button className={styles.attendBtn} onClick={toggleVisibility}
            disabled={(currentTime < startEventTime || currentTime > endEventTime) || (attendance)}>
                {!(currentTime < startEventTime || currentTime > endEventTime || attendance) ? 'Attend Here' : "Can't attend now..."}
            </button>
            { modalVisible && <CameraModal onClose={toggleVisibility} id={event.id} event={event} user={user}/>}
        </div>
    )
}

export default EventCard