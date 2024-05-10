import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Box, TableContainer, Paper, Button } from '@mui/material';

import EntityTable from './EntityTable';
import { fetchDataForTab, fetchUiElements } from './functions'; // These functions should already be defined as they are used in MainPage

const EntityTableWrapper = () => {
  const { entity } = useParams(); // This captures the entity as activeTab from the URL
  const [entities, setEntities] = useState([]);
  const [uiElements, setUiElements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(''); // Initially no entity is selected

  useEffect(() => {
    fetchDataForTab(entity, setEntities); // Fetch entities for this specific entity type
    fetchUiElements(entity, setUiElements, () => {}); // Fetch UI elements related to the entity
    // setSearchTerm(''); // Clear search term if needed upon loading new entity data
  }, [entity]);

  // Mimic MainPage's entity filtering logic
  const filteredEntities = entities.filter(ent => {
    const matchesSearchTerm = Object.values(ent).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesSelectedEntity = !selectedEntity || ent.entity === selectedEntity;
    return matchesSearchTerm && matchesSelectedEntity;
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box mt={4} mb={4} display="flex" justifyContent="space-between">
          <Button
            onClick={() => { /* Implement functionality to handle new entity creation */ }}
            variant="outlined"
            color="primary"
          >
            New {entity.charAt(0).toUpperCase() + entity.slice(1)} Entry
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <EntityTable
            entities={filteredEntities}
            onEdit={(index) => { /* Implement or pass editing functionality */ }}
            tableColumns={uiElements.filter(element => element.entity === entity)}
            activeTab={entity}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            // `onTabChange`, `selectedEntity`, `setSelectedEntity`, `entityOptions` are not required if not used
          />
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default EntityTableWrapper;
