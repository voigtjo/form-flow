import React, { useState, useEffect } from 'react';
import { Grid, Button, TableContainer, Paper, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import EntityTable from './EntityTable';
import Sidebar from './Sidebar';
import Multiselector from './Multiselector';
import * as functions from './functions';
import { listCollections, reinitializeSchemas, postData } from './api';

const MainPage = ({ selectedEntity: selectedEntityFromProps, sections, setSections, token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const [entities, setEntities] = useState([]);
  const [uiElements, setUiElements] = useState([]);
  const [activeTab, setActiveTab] = useState(queryParams.activeTab || 'user');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(queryParams.selectedEntity || '');
  const [entityOptions, setEntityOptions] = useState([]);

  useEffect(() => {
    if (['attribute', 'uielement'].includes(activeTab)) {
      listCollections(token)
        .then(collections => {
          setEntityOptions(collections.map(name => ({ label: name, value: name })));
          if (!collections.includes(selectedEntity)) {
            setSelectedEntity('');
          }
        })
        .catch(error => console.error('Failed to fetch collections:', error));
    } else {
      setSelectedEntity('');
    }
  }, [activeTab, selectedEntity, token]);

  useEffect(() => {
    if (selectedEntityFromProps) {
      setSelectedEntity(selectedEntityFromProps);
    }
  }, [selectedEntityFromProps]);

  useEffect(() => {
    functions.fetchDataForTab(activeTab, setEntities, token);
  }, [activeTab, token]);

  useEffect(() => {
    functions.fetchUiElementsData(activeTab, setUiElements, token);
    setSearchTerm('');
  }, [activeTab, token]);

  useEffect(() => {
    const query = queryString.stringify({ activeTab });
    navigate(`/?${query}`);
  }, [activeTab, navigate]);

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
    const matchesSearchTerm = Object.values(entity).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesSelectedEntity = selectedEntity === '' || entity.entity === selectedEntity;
    return matchesSearchTerm && matchesSelectedEntity;
  });

  const handleNewEntity = async () => {
    try {
      const newEntity = await functions.handleNewEntity(activeTab, uiElements, postData, selectedEntity, token);
      navigate(`/${activeTab}?selectedEntity=${selectedEntity}`);
    } catch (error) {
      console.error('Error creating new entity:', error);
    }
  };

  const handleReinitializeClick = () => {
    reinitializeSchemas(token).then(() => {
      alert('Schemas reinitialized successfully');
    }).catch((error) => {
      console.error("Failed to reinitialize schemas:", error);
      alert('Failed to reinitialize schemas');
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Multiselector sections={sections} setSections={setSections} />
        <Sidebar
          navigateToCreateCollection={() => navigate("/create-collection-form")}
          handleReinitializeClick={handleReinitializeClick}
          handleTabChange={handleTabChange}
          uiElements={uiElements}
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          sections={sections}
        />
      </Grid>
      <Grid item xs={9}>
        <Box mt={4} mb={4} display="flex" justifyContent="space-between">
          <Box>
            <IconButton onClick={toggleSidebar} color="primary" aria-label="toggle-sidebar">
              <MenuIcon />
            </IconButton>
          </Box>
          <Box>
            <Button
              onClick={handleNewEntity}
              variant="outlined"
              color="primary"
            >
              New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Entry
            </Button>
          </Box>
        </Box>

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
              selectedEntity={selectedEntity}
              setSelectedEntity={setSelectedEntity}
              entityOptions={entityOptions}
            />
          </TableContainer>
        )}
      </Grid>
    </Grid>
  );
};

export default MainPage;
