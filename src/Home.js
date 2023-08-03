import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Select, InputNumber } from 'antd';
import { read, utils } from 'xlsx';
import { useNavigate } from 'react-router-dom';
import './Hubpage.css';

const Home = () => {
  const editableText = `Welcome.`;
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
      <h1>Welcome to the Hub Page</h1>
      <div className='hubpage-buttons'>
        <button className='hubpage-button' onClick={runTable}>
          Request
        </button>
        <button className='hubpage-button' onClick={goToHubPage}>
          Next Page
        </button>
      </div>
      <pre className='hubpage-text'>
        {editableText}
      </pre>
    </div>
  );
};

export default Home;
