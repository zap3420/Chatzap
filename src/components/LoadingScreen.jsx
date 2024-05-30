import React from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

const LoadingScreen = () => {
  return (
    <div style={styles.container}>
      <ClimbingBoxLoader color="#ffffff" loading={true} speedMultiplier={1.4} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(#2F80ED, #56CCF2)',
  },
};

export default LoadingScreen;
