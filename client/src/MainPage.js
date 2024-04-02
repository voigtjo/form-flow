import React, { useState, useEffect } from 'react';
import { Typography, Grid, Button, TableContainer, Paper, Box } from '@mui/material';
import EntityForm from './EntityForm';
import EntityTable from './EntityTable';
import { postData, updateData } from './api'; // Import API functions
import * as functions from './functions'; // Import functions

const MainPage = () => {
  const [entityData, setEntityData] = useState({});
  const [entities, setEntities] = useState([]);
  const [selectedEntityIndex, setSelectedEntityIndex] = useState(null);
  const [uiElements, setUiElements] = useState([]);
  const [activeTab, setActiveTab] = useState('user'); // default tab
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    functions.fetchDataForTab(activeTab, setEntities);
  }, [activeTab]);

  useEffect(() => {
    functions.fetchUiElements(activeTab, setUiElements, initializeEntityData, setSearchTerm);
    setSearchTerm('');
  }, [activeTab]);

  const initializeEntityData = (data) => {
    functions.initializeEntityData(data, setEntityData);
  };

  const handleInputChange = (value, key) => {
    functions.handleInputChange(value, key, entityData, setEntityData);
  };

  const handleSubmit = (e) => {
    functions.handleSubmit(e, entityData.id === null, activeTab, entityData, entities, setEntities, selectedEntityIndex, setSelectedEntityIndex, uiElements, setEntityData, postData, updateData, setSearchTerm);
  };

  const handleEdit = (index) => {
    functions.handleEdit(index, activeTab, entities, setEntityData, setSelectedEntityIndex);
  };
  

  const handleClear = () => {
    functions.handleClear(activeTab, uiElements, setEntityData);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (event) => {
    functions.handleSearch(event, setSearchTerm);
  };

  const filteredEntities = entities.filter(entity => {
    return Object.values(entity).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <div>
          <Typography variant="h5" style={{ marginTop: '16px' }}>Admin Panel</Typography>
          {Array.from(new Set(uiElements.map(element => element.entity)))
            .filter(tab => tab === 'attribute' || tab === 'uielement')
            .map((tab, index) => {
              return (
                <Button
                  key={index}
                  onClick={() => handleTabChange(tab)}
                  variant={activeTab === tab ? 'contained' : 'outlined'}
                  color="primary"
                  fullWidth
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Form
                </Button>
              );
            })}
        </div>
        <div>
          <Typography variant="h5" style={{ marginTop: '16px' }}>User Panel</Typography>
          {Array.from(new Set(uiElements.map(element => element.entity)))
            .filter(tab => tab !== 'attribute' && tab !== 'uielement')
            .map((tab, index) => {
              return (
                <Button
                  key={index}
                  onClick={() => handleTabChange(tab)}
                  variant={activeTab === tab ? 'contained' : 'outlined'}
                  color="primary"
                  fullWidth
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Form
                </Button>
              );
            })}
        </div>
      </Grid>
      <Grid item xs={9}>
        <Box mt={4} mb={4}>
          {uiElements.filter(element => element.entity === activeTab).length > 0 && (
            <EntityForm
              id={entityData.id}
              components={uiElements.filter(element => element.entity === activeTab)}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onClear={handleClear}
              data={entityData}
              name={activeTab}
            />
          )}
        </Box>
        {uiElements.filter(element => element.entity === activeTab).length > 0 && (
          <TableContainer component={Paper}>
            <EntityTable
              entities={filteredEntities}
              onEdit={handleEdit}
              tableColumns={uiElements.filter(element => element.entity === activeTab)}
              name={activeTab}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onTabChange={handleTabChange}
            />
          </TableContainer>
        )}
      </Grid>
    </Grid>
  );
};

export default MainPage;
