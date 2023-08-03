// hubpage.js
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Select, InputNumber } from 'antd';
import { read, utils } from 'xlsx';
import { useNavigate } from 'react-router-dom';
import './Hubpage.css';

/*!!!uigg
const React = require('react');
const { useState, useEffect } = require('react');
const { Select, InputNumber } = require('antd');
const axios = require('axios');
const { read, utils } = require('xlsx');
const { useNavigate } = require('react-router-dom');
require('./Hubpage.css');
*/

const { Option } = Select;
const teamTitle = "Which team do you support";
const supportTitle = "How much do you want your team represented";
const formTitle = "How important is recent form?";
const ppgTitle = "Efficiency - How important is points per game?";
const ppmTitle = "Looking for good value? How important is points per million?";
const differentialTitle = "Want to get the edge? How important are rarely-owned players?";
const positionTitle = "Position:";

const Hubpage = () => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState({
    team: teamTitle,
    teamSupport: supportTitle,
    form: formTitle,
    efficiency: ppgTitle,
    value: ppmTitle,
    differential: differentialTitle,
    position: positionTitle,
    budget: "",
  });

   // Add a new state variable to keep track of the selected team
   const [selectedTeam, setSelectedTeam] = useState(null);

   useEffect(() => {
    // Convert the selected team to lowercase when it changes
    if (selectedTeam) {
      const capitalizedTeam = selectedTeam.charAt(0) + selectedTeam.slice(1).toLowerCase();
      setSelectedTeam(capitalizedTeam);
    }
  }, [selectedTeam]);

  const [teamOptions, setTeamOptions] = useState([]);
  //const [userNumber, setUserNumber] = useState(null);

  const handleOptionChange = (option, comboBoxName) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [comboBoxName]: option,
    }));
    // Update the selected team whenever the team combobox is changed
    if (comboBoxName === "team") {
      setSelectedTeam(option);
    }
  };

  const handleBudgetChange = value => {
    // Check if the value is a valid number
    if (isNaN(value)) {
      // Display an error message or take appropriate action
      console.error('Invalid budget');
      return;
    }

    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      budget: value !== '' ? parseFloat(value) : '',
    }));
  };

  const fetchTeamNames = () => {
    const endpoint = 'http://localhost:5000/merged_data.json';
  
    axios.get(endpoint)
      .then((response) => {
        const jsonData = response.data;
        const teamCounts = {};
        Object.values(jsonData).forEach((player) => {
          const teamName = player.Team;
          teamCounts[teamName] = (teamCounts[teamName] || 0) + 1;
        });
  
        const teams = Object.keys(teamCounts)
          .sort((a, b) => teamCounts[b] - teamCounts[a])
          .slice(0, 20);
        
        setTeamOptions(teams.sort());

  
        console.log('Top 20 teams with most occurrences:', selectedOptions);
      })
      .catch((error) => {
        console.error('Error reading JSON data:', error);
      });
  };


  useEffect(() => {
    fetchTeamNames();
  }, []);

  const handleRequest = () => {
    // Check if budget is valid
    const budget = parseFloat(selectedOptions.budget);
    if (isNaN(budget) || budget < 0) {
      // Display an error message or take appropriate action
      console.error('Invalid budget');
      return;
    }

    const payload = selectedOptions;

    axios
      .post('http://localhost:5000/calculate', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        // Handle the response from the server if needed
        console.log(response.data.result);

        // Wait for a short delay to allow the server to create the Excel file
        setTimeout(() => {
          // Navigate to the new page
          // navigate('/Results');
        }, 2000); // Adjust the delay as needed
      })
      .catch(error => {
        // Handle any errors that occur during the request
        console.error(error);
      });
  };

  const handleNextPage = () => {
    navigate('/Results');
  };

  console.log(selectedOptions);

  return (
    <div className='hubpage-container'>
      <h1>What matters to you?</h1>
      <p>Welcome to the new page content.</p>
      <div className='hubpage-form'>
        <div className='form-row'>
          <Select
            key='team'
            style={{ width: '100%' }}
            onChange={option => handleOptionChange(option, 'team')}
            value={selectedOptions.team || teamTitle}
          >
            <Option value={teamTitle} disabled>
              {teamTitle}
            </Option>
            {teamOptions.map(team => (
              <Option key={team} value={team}>
                {team}
              </Option>
            ))}
          </Select>
        </div>
        <div className='form-row'>
          <Select
            key='teamSupport'
            style={{ width: '100%' }}
            onChange={option => handleOptionChange(option, 'teamSupport')}
            value={selectedOptions.teamSupport || supportTitle}
          >
            <Option value={supportTitle} disabled>
              {supportTitle}
            </Option>
            <Option value='0.01'>{selectedTeam ? `${selectedTeam}'s not my top priority` : "YOUR TEAM's not my top priority"}</Option>
            <Option value='0.4'>{selectedTeam ? `${selectedTeam}'s not my top priority` : "YOUR TEAM's not my top priority"}</Option>
            <Option value='0.6'>{selectedTeam ? `Seeing the ${selectedTeam} options would be nice` : "Seeing the YOUR TEAM options would be nice"}</Option>
            <Option value='0.8'>{selectedTeam ? `They're ${selectedTeam} almost as important as winning` : "They're YOUR TEAM almost as important as winning"}</Option>
            <Option value='1'>{selectedTeam ? `They're ${selectedTeam} in my fantasy DNA` : "They're YOUR TEAM in my fantasy DNA"}</Option>
          </Select>
        </div>
        <div className='form-row'>
          <Select
            key='form'
            style={{ width: '100%' }}
            onChange={option => handleOptionChange(option, 'form')}
            value={selectedOptions.form || formTitle}
          >
            <Option value={formTitle} disabled>
              {formTitle}
            </Option>
            <Option value='0.2'>I don't care</Option>
            <Option value='0.4'>Long-term results come first</Option>
            <Option value='0.6'>A mixture is the best approach</Option>
            <Option value='0.8'>I expect good recent performances</Option>
            <Option value='1'>
              <strong>They better be on FIRE</strong>
            </Option>
          </Select>
        </div>
        <div className='form-row'>
          <Select
            key='efficiency'
            style={{ width: '100%' }}
            onChange={option => handleOptionChange(option, 'efficiency')}
            value={selectedOptions.efficiency || ppgTitle}
          >
            <Option value={ppgTitle} disabled>
              {ppgTitle}
            </Option>
            <Option value='0.2'>I don't care</Option>
            <Option value='0.4'>The main thing is their total score</Option>
            <Option value='0.6'>If they're efficient it's a plus</Option>
            <Option value='0.8'>Points per game are an important metric</Option>
            <Option value='1'>I want them sweating points each second</Option>
          </Select>
        </div>
        <div className='form-row'>
          <Select
            key='value'
            style={{ width: '100%' }}
            onChange={option => handleOptionChange(option, 'value')}
            value={selectedOptions.value || ppmTitle}
          >
            <Option value={ppmTitle} disabled>
              {ppmTitle}
            </Option>
            <Option value='0.2'>Money is no object</Option>
            <Option value='0.4'>I'm usually willing to spend for the best</Option>
            <Option value='0.6'>I want a solid return on my investment</Option>
            <Option value='0.8'>Clever spending goes a long way</Option>
            <Option value='1'>I'll never waste a single penny</Option>
          </Select>
        </div>
        <div className='form-row'>
          <Select
            key='differential'
            style={{ width: '100%' }}
            onChange={option => handleOptionChange(option, 'differential')}
            value={selectedOptions.differential || differentialTitle}
          >
            <Option value={differentialTitle} disabled>
              {differentialTitle}
            </Option>
            <Option value='0.2'>I don't care</Option>
            <Option value='0.4'>I care a bit</Option>
            <Option value='0.6'>I care medium</Option>
            <Option value='0.8'>I care a lot</Option>
            <Option value='1'>It's the most important thing to me</Option>
          </Select>
        </div>
        <div className='form-row'>
          <Select
            key='position'
            style={{ width: '100%' }}
            onChange={option => handleOptionChange(option, 'position')}
            value={selectedOptions.position || positionTitle}
          >
            <Option value={positionTitle} disabled>
              {positionTitle}
            </Option>
            <Option value='ANY'>Any Position</Option>
            <Option value='GK'>Goalkeeper</Option>
            <Option value='DEF'>Defender</Option>
            <Option value='MID'>Midfielder</Option>
            <Option value='FWD'>Forward</Option>
          </Select>
        </div>
        <div className='form-row'>
          <InputNumber
            min={0}
            step={0.1}
            style={{ width: '100%' }}
            className="center-align-input"
            placeholder="Enter budget"
            value={selectedOptions.budget}
            onChange={handleBudgetChange}
          />
        </div>
      </div>
      <div className='hubpage-buttons'>
        <button className='hubpage-button' onClick={handleRequest}>
          Request
        </button>
        <button className='hubpage-button' onClick={handleNextPage}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default Hubpage;



