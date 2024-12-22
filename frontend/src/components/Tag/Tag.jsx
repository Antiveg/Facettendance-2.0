import React from "react";
import styles from './Tag.module.css'
import '../../global.css'

const Tag = ({ content }) => {
    return (
        <div className={styles.base}>
            <p className={styles.textWhite}>{content}</p>
        </div>
    )
}

export default Tag