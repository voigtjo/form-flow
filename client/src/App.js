import React from 'react';
import { Container, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import EntityFormWrapper from './EntityFormWrapper';
import CreateCollectionForm from './CreateCollectionForm';
import LayoutRenderer from './LayoutRenderer'; // Import the LayoutRenderer component

const App = () => {
  const layout = [
    [
      { size: 6, color: 'red', content: 'Tile 1' },
      { size: 6, color: 'blue', content: 'Tile 2' }
    ],
    [
      { size: 4, color: 'green', content: 'Tile 3' },
      { size: 4, color: 'yellow', content: 'Tile 4' },
      { size: 4, color: 'purple', content: 'Tile 5' }
    ]
  ];

  return (
    <Container>
      <Typography variant="h3" align="center">Form Flow</Typography>
      <Router>
        <Routes>
          <Route path="/create-collection-form" element={<CreateCollectionForm />} />
          <Route path="/layout-renderer" element={<LayoutRenderer layout={layout} />} /> 
          <Route path="/:entity/:entityId" element={<EntityFormWrapper />} />
          <Route path="/:entity/" element={<EntityFormWrapper />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
