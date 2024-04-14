import React, { useState, useEffect } from 'react';
import { Grid, Box, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import EntityForm from './EntityForm';
import { postData, updateData, fetchEntityById, listCollections } from './api'; // Ensure listCollections is imported
import * as functions from './functions'; // Import functions

const EntityFormWrapper = () => {
  const { entity, entityId } = useParams();
  const [uiElements, setUiElements] = useState([]);
  const [entityData, setEntityData] = useState({});
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      functions.fetchUiElements(entity, setUiElements, data => {
        return data.filter(element => element.entity === entity);
      });

      // Only fetch entity data if an entityId exists
      if (entityId !== undefined && entityId !== null) {
        fetchEntityData(entity, entityId);
      }

      const fetchedCollections = await listCollections();
      setCollections(fetchedCollections.map(name => ({ label: name, value: name })));
    };
    fetchInitialData();
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
    // Determine whether it's a new entity creation or an update based on the presence of entityId
    const isCreation = entityId === null || entityId === undefined;
  
    // Use a different endpoint and method based on whether you're creating or updating
    const endpoint = isCreation ? entity : `${entity}/${entityId}`;
  
    try {
      let updatedData;
      if (isCreation) {
        // Create a new entity
        updatedData = await postData(endpoint, entityData);
        // After creation, navigate to the new entity's page
        navigate(`/${entity}/${updatedData._id}`);
      } else {
        // Update an existing entity
        updatedData = await updateData(endpoint, entityData);
        // Optionally navigate or perform other actions after update
      }
      setEntityData(updatedData);
    } catch (error) {
      console.error(`Error ${isCreation ? "creating" : "updating"} ${entity} data:`, error);
    }
  };
  

  const handleClear = () => {
    functions.handleClear(entity, uiElements, setEntityData);
  };

  const handleBack = () => {
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
              columnWidth: 4 // Example modification
            }))}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
            data={entityData}
            name={entity}
            collections={collections}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default EntityFormWrapper;
