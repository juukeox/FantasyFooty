import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Select, InputNumber } from 'antd';
import { read, utils } from 'xlsx';
import { useNavigate } from 'react-router-dom';
import './Hubpage.css';


const Home = () => {
  const editableText = `\n Click the above button to ensure you're updated dated \n \n \n When you're ready, \n choose from the range of options \nto get a table of players perfect \nfor your squad.`;
  const navigate = useNavigate();

  const goToHubPage = () => {
    navigate('/Hub');
  };

  const runTable = () => {
    axios.get('http://localhost:5000/run-table')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
<div className='hubpage-container'>
  <h1>WELCOME TO YOUR<br/> FANTASY FOOTBALL HUB!</h1>
  <div className='hubpage-buttons'>
    <button className='hubpage-button' onClick={runTable}>
      Get newest data
    </button>
  </div>
  <pre className='hubpage-text'>
    <strong>{editableText}</strong>
  </pre>
  <div className='hubpage-buttons'>
    <button className='hubpage-button' onClick={goToHubPage}>
      Pick your preferences
    </button>
  </div>
</div>
  );
};

export default Home;
