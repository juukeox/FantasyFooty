import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hubpage from './Hubpage.js';
import ResultsPage from './Results.js';
import Home from './Home.js';

const App = () => {
  return (
    <BackgroundContainer>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Hub" element={<Hubpage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Router>
      <p>Learn React</p> {/* Add this line!!! sync with other file*/}
    </BackgroundContainer>
  );
};

const BackgroundContainer = ({ children }) => {
  return <div style={{ backgroundColor: 'green' }}>{children}</div>;
};

export default App;