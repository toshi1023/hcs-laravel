import React from 'react';
import styles from './commonParts.module.css';

/**
 * Loading
 */
function LoadItem() {
    return (
        <div className={styles.loadAlign}>
            <div className={styles.loader}><div className={styles.ball_scale_multiple}><div></div><div></div><div></div></div></div>
        </div>
    )
}

export default LoadItem
