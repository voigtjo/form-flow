import React, { useState } from 'react';
import { Button, Typography, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = ({
  navigateToCreateCollection,
  handleReinitializeClick,
  handleTabChange,
  uiElements,
  activeTab,
  sidebarOpen,
  sections
}) => {

  return (
    <div style={{ display: sidebarOpen ? 'block' : 'none' }}>
      {sections.adminOperations && (
        <>
          <Typography variant="h5" style={{ marginTop: '16px', marginBottom: '8px' }}>Admin Operations</Typography>
          <Button onClick={navigateToCreateCollection} variant="outlined" color="primary" fullWidth>
            Create New Collection
          </Button>
          <Button onClick={handleReinitializeClick} variant="outlined" color="primary" fullWidth>
            Reinitialize Schemas
          </Button>
        </>
      )}

      {sections.adminEntities && (
        <>
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
        </>
      )}

      {sections.entityFormsPanel && (
        <>
          <Typography variant="h5" style={{ marginTop: '16px' }}>Entity Forms Panel</Typography>
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
        </>
      )}

      {sections.layoutPanel && (
        <>
          <Typography variant="h5" style={{ marginTop: '16px' }}>Layout Panel</Typography>
          <Link to="/layout-renderer">
            <Button variant="outlined" color="primary" fullWidth>
              LayoutRenderer
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Sidebar;
