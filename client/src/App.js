import React from 'react';
import { Container, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import EntityFormWrapper from './EntityFormWrapper';
import CreateCollectionForm from './CreateCollectionForm'; // Import the form component

const App = () => {
  return (
    <Container>
      <Typography variant="h3" align="center">Form Flow</Typography>
      <Router>
        <Routes>
          <Route path="/create-collection-form" element={<CreateCollectionForm />} />
          {/* Route for EntityFormWrapper */}
          <Route path="/:entity/:entityId" element={<EntityFormWrapper />} />
          {/* Route for the main page */}
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
