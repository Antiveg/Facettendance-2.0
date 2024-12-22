import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'
import styles from './ErrorPage.module.css'
import '../../global.css'

const ErrorPage = ({ statusNumber, statusMsg, addMsg, route, routePage }) => {

    const navigate = useNavigate()

    return (
        <div className={styles.base}>
            <p className="super-huge-title">{statusNumber}</p>
            <p className="big-title">{statusMsg}</p>
            <p className={styles.note}>{addMsg}</p>
            <button
            onClick={() => navigate(route)}
            className={styles.btn}
            >{routePage} →</button>
        </div>
    )
}

export default ErrorPage