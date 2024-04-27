import React, { useState, useEffect } from 'react';
import {Grid, Button, TableContainer, Paper, Box } from '@mui/material'; // Import TextField

import EntityTable from './EntityTable';
import Sidebar from './Sidebar'; // Import the Sidebar component
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation hook
import queryString from 'query-string'; // Import queryString library
import { postData } from './api'; // Import API functions
import * as functions from './functions'; // Import functions
import { IconButton } from '@mui/material'; // Import IconButton from Material-UI
import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon from Material-UI
import {reinitializeSchemas } from './api'; // Add reinitializeSchemas to your imports

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const queryParams = queryString.parse(location.search); // Parse query parameters
  const [entities, setEntities] = useState([]);
  const [uiElements, setUiElements] = useState([]);
  const [activeTab, setActiveTab] = useState(queryParams.activeTab || 'user'); // Set active tab from query parameter, default to 'user'
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to track sidebar visibility



  useEffect(() => {
    functions.fetchDataForTab(activeTab, setEntities);
  }, [activeTab]);

  useEffect(() => {
    functions.fetchUiElements(activeTab, setUiElements, setSearchTerm);
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
    

   const handleEdit = (index) => {
    functions.handleEdit(index, activeTab, entities);
  };


  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
      navigate(`/${activeTab}`);
    } catch (error) {
      console.error('Error creating new entity:', error);
    }
  };


  const handleReinitializeClick = () => {
    reinitializeSchemas().then(() => {
      alert('Schemas reinitialized successfully');
    }).catch((error) => {
      console.error("Failed to reinitialize schemas:", error);
      alert('Failed to reinitialize schemas');
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Sidebar
          navigateToCreateCollection={() => navigate("/create-collection-form")}
          handleReinitializeClick={handleReinitializeClick}
          handleTabChange={handleTabChange}
          uiElements={uiElements}
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
        />
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
