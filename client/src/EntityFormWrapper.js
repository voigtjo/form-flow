import React, { useState, useEffect } from 'react';
import { Grid, Box, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import EntityForm from './EntityForm';
import { postData, updateData, fetchEntityById } from './api'; // Import API functions
import * as functions from './functions'; // Import functions

const EntityFormWrapper = () => {
  const { entity, entityId } = useParams();
  const [uiElements, setUiElements] = useState([]);
  const [entityData, setEntityData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data for entity and initialize UI elements
    functions.fetchUiElements(entity, setUiElements, data => {
      // Filter uiElements based on the current entity
      return data.filter(element => element.entity === entity);
    });
    fetchEntityData(entity, entityId);
  }, [entity, entityId]);

  const fetchEntityData = async (entity, entityId) => {
    try {
      const data = await fetchEntityById(entity, entityId);
      setEntityData(data);
    } catch (error) {
      console.error(`Error fetching ${entity} by ID ${entityId}:`, error);
    }
  };

  const handleInputChange = (value, key) => {
    functions.handleInputChange(value, key, entityData, setEntityData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const endpoint = entityId === null ? entity : `${entity}/${entityId}`;
  
    try {
      const updatedData = await updateData(endpoint, entityData);
      setEntityData(updatedData);
    } catch (error) {
      console.error(`Error updating ${entity} data:`, error);
    }
  };

  const handleClear = () => {
    functions.handleClear(entity, uiElements, setEntityData);
  };

  const handleBack = () => {
    // Navigate back to the MainPage with the same activeTab selected
    navigate(`/?activeTab=${entity}`);
  };
  

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box mt={4} mb={4}>
          <Button variant="outlined" color="primary" onClick={handleBack}>Back</Button>
          <EntityForm
            id={entityId}
            components={uiElements.filter(element => element.entity === entity).map(element => ({
              ...element,
              columnWidth: 4 // Pass the column width parameter here
            }))}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
            data={entityData}
            name={entity}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default EntityFormWrapper;
