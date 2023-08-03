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
      <Footer />
    </BackgroundContainer>
  );
};

const BackgroundContainer = ({ children }) => {
  return <div style={{ backgroundColor: 'green' }}>{children}</div>;
};

const Footer = () => {
  return (
    <div style={{ backgroundColor: 'gray', padding: '20px', textAlign: 'center', color: 'white' }}>
      <p>
      <p>To discuss work possibilities contact me:</p>
      <p>  malachikakembo@gmail.com </p>
      <p>   +44 737 8143 599 </p>
      </p>
    </div>
  );
};

export default App;