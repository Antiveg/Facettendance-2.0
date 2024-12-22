import React, { useState, useEffect } from 'react';
import '../../global.css'
import styles from './Create.module.css'
import axios from 'axios'

const Create= ({user}) => {

    const [users, setUsers] = useState(null)
    const [loading, setLoading] = useState(true);
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        location: '',
        creator: 0,
        participants: []
    })

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const response = await axios.get('http://localhost:5000/users', {
                    withCredentials: true
                });
                setUsers(response.data.users);
            } catch (err) {
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
            setEventData({
            ...eventData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        const checkboxes = document.querySelectorAll('input[name="participants"]:checked');
        const checkedValues = Array.from(checkboxes).map((checkbox) => Number(checkbox.value));

        const updatedEventData = {
            ...eventData,
            participants: checkedValues,  
            creator: user.id
        };

        e.preventDefault();
        try {
            setLoading(true);
            console.log(updatedEventData)

            await axios.post('http://localhost:5000/event/create', updatedEventData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            
            setEventData({
                title: '',
                description: '',
                start_time: '',
                end_time: '',
                location: '',
                creator: '',
                participants: []
            })
        } catch (error) {
            console.error('Error creating event:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.base}>
            <h1 className="big-title">Create New Event</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.form_inputs}>
                    <div className={styles.left_side}>
                        <div className={styles.input_container}>
                            <label htmlFor="title">Event Title</label>
                            <input
                            type="text"
                            name="title"
                            value={eventData.title}
                            onChange={handleChange}
                            className={styles.input_box}/>
                        </div>
                        <div className={styles.input_container}>
                            <label htmlFor="start_time">Start Time</label>
                            <div className={styles.multiple_input}>
                                <input
                                type="datetime-local"
                                name="start_time"
                                value={eventData.start_time}
                                onChange={handleChange}
                                className={styles.datetime_box} />
                                <p> s.d. </p>
                                <input
                                type="datetime-local"
                                name="end_time"
                                value={eventData.end_time}
                                onChange={handleChange}
                                className={styles.datetime_box} />
                            </div>
                        </div>
                        <div className={styles.input_container}>
                            <label htmlFor="description">Description</label>
                            <textarea
                            name="description"
                            value={eventData.description}
                            onChange={handleChange}
                            className={styles.textarea_box}/>
                        </div>
                        <div className={styles.input_container}>
                            <label htmlFor="creator">Creator</label>
                            <input
                                type="text"
                                name="creator"
                                value={`${user.id}. ${user.name} (${user.email})`}
                                readOnly
                                className={styles.input_box}/>
                        </div>
                        <div className={styles.input_container}>
                            <label htmlFor="location">Location</label>
                            <input
                            type="text"
                            name="location"
                            value={eventData.location}
                            onChange={handleChange}
                            className={styles.input_box}/>
                        </div>
                        <div className={styles.input_container}>
                            <label htmlFor="participants">Participants</label>
                            <div className={styles.checkbox_box}>
                                {(users && users.length > 0) &&
                                users.map((user) => (
                                    <label key={user.id} className={styles.checkbox} htmlFor={`participant-${user.id}`}>
                                        <input
                                        type="checkbox"
                                        id={`participant-${user.id}`}
                                        name="participants"
                                        value={user.id}
                                        onChange={handleChange} />
                                        <p className="ellipsis">{user.id}. {user.name}</p>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={styles.right_side}>
                        <img src="https://joomly.net/frontend/web/images/googlemap/map.png" alt="Not Found!" className={styles.map}/>
                    </div>
                </div>
                <button
                type="submit"
                disabled={loading}
                className={styles.btn}>{loading ? 'Creating...' : 'Create Event'}</button>
            </form>
        </div>
    );
};

export default Create;
