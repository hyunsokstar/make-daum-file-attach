import React from 'react'
import styles from "./ProgressBar.module.scss";


function ProgressBar({percent}) {
  
    return (
        <div className={styles.ProgressBarContainer} >
            <div className='progress-bar' className={styles.ProgressBar} style={{"width":percent}}>
               {percent} %
            </div>
        </div>
    )
}


export default ProgressBar