import React from 'react'
import { useDispatch } from 'react-redux';
import { setLogout } from '../Redux/store';

const Dashboard = () => {
  const dispatch = useDispatch();
  function handleLogout() {

        dispatch(setLogout());
      }
  return (
    <div>
      <h1>welcome Dasboard</h1>
      {/* <button className='btn logout-btn' onClick={handleLogout}>LogOut</button> */}
      <button style={styles.button} onClick={handleLogout}>LogOut</button>
    </div>
  )
}
const styles = {
  button: {
    backgroundColor: 'red',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    // Add more styles as needed
  }
};

export default Dashboard
