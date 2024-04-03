import React, { useState, useEffect } from 'react';
import {Typography, Grid, Button, TableContainer, Paper, Box } from '@mui/material'; // Import TextField

import EntityTable from './EntityTable';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation hook
import queryString from 'query-string'; // Import queryString library
import { postData, updateData } from './api'; // Import API functions
import * as functions from './functions'; // Import functions
import { IconButton } from '@mui/material'; // Import IconButton from Material-UI
import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon from Material-UI

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const queryParams = queryString.parse(location.search); // Parse query parameters
  const [entityData, setEntityData] = useState({});
  const [entities, setEntities] = useState([]);
  const [selectedEntityIndex, setSelectedEntityIndex] = useState(null);
  const [uiElements, setUiElements] = useState([]);
  const [activeTab, setActiveTab] = useState(queryParams.activeTab || 'user'); // Set active tab from query parameter, default to 'user'
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to track sidebar visibility


  useEffect(() => {
    functions.fetchDataForTab(activeTab, setEntities);
  }, [activeTab]);

  useEffect(() => {
    functions.fetchUiElements(activeTab, setUiElements, initializeEntityData, setSearchTerm);
    setSearchTerm('');
  }, [activeTab]);

  useEffect(() => {
    // Update URL query parameter when activeTab changes
    const query = queryString.stringify({ activeTab });
    navigate(`/?${query}`);
  }, [activeTab, navigate]);

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };

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

  const handleNewEntity = async () => {
    try {
      const newEntity = await functions.handleNewEntity(activeTab, uiElements, postData);
      console.log("handleNewEntity: newEntity.id=" + newEntity.id + ", newEntity._id=" + newEntity._id);
      console.log(newEntity);
      navigate(`/${activeTab}/${newEntity._id}`);
    } catch (error) {
      console.error('Error creating new entity:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={3} style={{ display: sidebarOpen ? 'block' : 'none' }}> {/* Conditional rendering of sidebar */}
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
        <Box mt={4} mb={4} display="flex" justifyContent="space-between">
          <Box>
            {/* Toggle sidebar button */}
            <IconButton onClick={toggleSidebar} color="primary" aria-label="toggle-sidebar">
              <MenuIcon />
            </IconButton>
          </Box>
          <Box>
            {/* New entity button */}
            <Button
              onClick={handleNewEntity}
              variant="outlined"
              color="primary"
            >
              New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Entry
            </Button>
          </Box>
        </Box>

        {/* Entity table */}
        {uiElements.filter(element => element.entity === activeTab).length > 0 && (
          <TableContainer component={Paper}>
            <EntityTable
              entities={filteredEntities}
              onEdit={handleEdit}
              tableColumns={uiElements.filter(element => element.entity === activeTab)}
              activeTab={activeTab}
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
