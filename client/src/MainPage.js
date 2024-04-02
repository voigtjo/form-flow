import React, { useState, useEffect } from 'react';
import { Typography, Grid, Button, TableContainer, Paper, Box, TextField } from '@mui/material';
import EntityForm from './EntityForm';
import EntityTable from './EntityTable';
import { fetchData, postData, updateData, deleteData } from './api'; // Import API functions

const MainPage = () => {
  const [entityData, setEntityData] = useState({});
  const [entities, setEntities] = useState([]);
  const [selectedEntityIndex, setSelectedEntityIndex] = useState(null);
  const [uiElements, setUiElements] = useState([]);
  const [activeTab, setActiveTab] = useState('user'); // default tab
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDataForTab = async () => {
      try {
        const data = await fetchData(activeTab); // Fetch user data
        setEntities(data);
        console.log(`Data received for ${activeTab}:`, data);
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      }
    };
    fetchDataForTab();
  }, [activeTab]);

  useEffect(() => {
    const fetchUiElements = async () => {
      try {
        const data = await fetchData('ui-elements');
        setUiElements(data);
        initializeEntityData(data.filter(element => element.entity === activeTab));
      } catch (error) {
        console.error(`Error fetching UI elements:`, error);
      }
    };
    fetchUiElements();
    setSearchTerm(''); // Reset searchTerm when activeTab changes
  }, [activeTab]);

  const initializeEntityData = (data) => {
    const initialEntityData = data.reduce((acc, curr) => {
      acc[curr.entityid] = ''; // Use entityid instead of id
      return acc;
    }, { id: null });
    setEntityData(initialEntityData);
  };

  const handleInputChange = (value, key) => {
    setEntityData({ ...entityData, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isNewEntity = entityData.id === null;

    const endpoint = isNewEntity ? activeTab : `${activeTab}/${entityData.id}`;
    const apiFunction = isNewEntity ? postData : updateData;

    apiFunction(endpoint, entityData)
      .then(data => {
        if (isNewEntity) {
          setEntities([...entities, data]);
        } else {
          const updatedEntities = [...entities];
          updatedEntities[selectedEntityIndex] = data;
          setEntities(updatedEntities);
          setSelectedEntityIndex(null);
        }
        // Initialize entityData with values from ui-elements if available
        const filteredElements = uiElements.filter(element => element.entity === activeTab);
        if (filteredElements.length > 0) {
          const initialEntityData = filteredElements.reduce((acc, curr) => {
            acc[curr.entityid] = ''; // Use entityid instead of id
            return acc;
          }, { id: null });
          setEntityData(initialEntityData);
        }
      })
      .catch(error => console.error(`Error saving ${activeTab}:`, error));
  };

  const handleEdit = (index) => {
    setEntityData(entities[index]);
    setSelectedEntityIndex(index);
  };

  const handleClear = () => {
    // Initialize entityData with values from ui-elements if available
    const filteredElements = uiElements.filter(element => element.entity === activeTab);
    if (filteredElements.length > 0) {
      const initialEntityData = filteredElements.reduce((acc, curr) => {
        acc[curr.entityid] = ''; // Use entityid instead of id
        return acc;
      }, { id: null });
      setEntityData(initialEntityData);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };
  

  const filteredEntities = entities.filter(entity => {
    // Filter by search term
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
                  fullWidth // Ensure the button takes full width
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
                  fullWidth // Ensure the button takes full width
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Form
                </Button>
              );
            })}
        </div>
      </Grid>
      <Grid item xs={9}>
        <Box mt={4} mb={4}> {/* Add margin top and bottom for spacing */}
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
              searchTerm={searchTerm} // Pass searchTerm to EntityTable
              setSearchTerm={setSearchTerm} // Pass setSearchTerm to EntityTable
              onTabChange={handleTabChange} // Pass handleTabChange to EntityTable
            />
          </TableContainer>
        )}
      </Grid>
    </Grid>
  );
};

export default MainPage;
