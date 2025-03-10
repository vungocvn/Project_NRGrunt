"use client";
import styles from "../styles/loading.module.css";

const LoadingScreen = () => {
  // const text = "Vui lòng đợi...";
  const text = "Loading...";
  return (
    <div className={styles.loadingScreen}>
      <div className={styles.spinner}></div>
      {/* <p style={{color:'#fff', fontStyle:'normal',fontWeight:'bold', fontSize:14}}>Vui lòng đợi...</p>
       */}
      <div className={styles.wavyText}>
        <span>N</span>
        <span>G</span>
        <span>R</span>
        <span>U</span>
        <span>N</span>
        <span>T</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
