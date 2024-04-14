import React from 'react';
import { Button, Typography } from '@mui/material';

const Sidebar = ({
  navigateToCreateCollection,
  handleReinitializeClick,
  handleTabChange,
  uiElements,
  activeTab,
  sidebarOpen
}) => {
  return (
    <div style={{ display: sidebarOpen ? 'block' : 'none' }}>
    {/* Additional section for schema and collection operations */}
      <Typography variant="h5" style={{ marginTop: '16px', marginBottom: '8px' }}>Admin  Operations</Typography>
      <Button onClick={navigateToCreateCollection} variant="outlined" color="primary" fullWidth>
        Create New Collection
      </Button>
      <Button onClick={handleReinitializeClick} variant="outlined" color="primary" fullWidth>
        Reinitialize Schemas
      </Button>
      <Typography variant="h5" style={{ marginTop: '16px' }}>Admin Entities</Typography>
      {Array.from(new Set(uiElements.map(element => element.entity)))
        .filter(tab => tab === 'attribute' || tab === 'uielement')
        .map((tab, index) => (
          <Button
            key={index}
            onClick={() => handleTabChange(tab)}
            variant={activeTab === tab ? 'contained' : 'outlined'}
            color="primary"
            fullWidth
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Form
          </Button>
        ))}




      <Typography variant="h5" style={{ marginTop: '16px' }}>User Panel</Typography>
      {Array.from(new Set(uiElements.map(element => element.entity)))
        .filter(tab => tab !== 'attribute' && tab !== 'uielement')
        .map((tab, index) => (
          <Button
            key={index}
            onClick={() => handleTabChange(tab)}
            variant={activeTab === tab ? 'contained' : 'outlined'}
            color="primary"
            fullWidth
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Form
          </Button>
        ))}
    </div>
  );
};

export default Sidebar;
