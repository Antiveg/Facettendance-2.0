import React from 'react';
import '../../global.css'
import styles from './About.module.css'

const About = ({user}) => {
    return (
        <div className={styles.base}>
            <div>
                <h1 className="big-title">About Us</h1>
                <p className="text-justify">Welcome to Facettendance, the ultimate event management solution designed to simplify the process of creating, organizing, and tracking events with ease. Whether you're planning a casual get-together, a corporate meeting, a wedding, or any type of gathering, our app ensures that every detail is in place, and attendance is accurately recorded and authenticated</p>
            </div>
            <div>
                <h1 className="big-title">Our Mission</h1>
                <p className="text-justify">At Facettendance, our mission is simple: to make event planning and attendance tracking seamless and stress-free. We understand that organizing events can be time-consuming, especially when trying to manage RSVPs, guest lists, and on-the-day attendance. That's why we've built an intuitive platform that brings everything you need in one place — from event creation to attendance management.</p>
            </div>
            <div>
                <h1 className="big-title">Our Values</h1>
                <p className="text-justify">
                    <b>Easy Event Creation:</b> Whether you're hosting a small meeting or a large-scale conference, our app lets you create events in just a few clicks. Simply enter your event details, set the time and location, and you're ready to go. You can also personalize your event with custom invitations, themes, and more.
                </p>
                <p className="text-justify">
                    <b>Real-Time Attendance Tracking:</b> With our smart attendance tracking feature, you'll know exactly who has attended and who hasn't. Our app makes it easy to mark attendance on-site, scan QR codes, or sync with your calendar for automatic updates.
                </p>
                <p className="text-justify">
                    <b>Secure & Reliable:</b> We take your data seriously. All personal and event information is securely stored and protected, ensuring your privacy is always respected.
                </p>
                <p className="text-justify">
                    <b>RSVP Management:</b> Our app makes it simple to send invitations and track RSVPs, so you never have to worry about last-minute no-shows or overbooked venues. Guests can RSVP directly through the app, and you can send reminders or updates instantly.
                </p>
                <p className="text-justify">
                    <b>Event Insights & Analytics:</b> Beyond attendance tracking, [App Name] provides you with valuable insights into your event's performance. View statistics on guest attendance, no-shows, and more to improve your future events.
                </p>
            </div>
        </div>
    );
};

export default About;
