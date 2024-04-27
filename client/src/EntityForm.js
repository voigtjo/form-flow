import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography } from '@mui/material';
import DynamicComponent from './DynamicComponent';
import { fetchAttributesByEntity } from './api';

const EntityForm = ({ id, components, onInputChange, onSubmit, onClear, data, name, collections }) => {
  const [attributes, setAttributes] = useState({});

  useEffect(() => {
    components.forEach(component => {
      if (component.type === 'entityRef' && data[component.entityid]) {
        handleEntityRefChange(data[component.entityid], component.entityid);
      }
    });
  }, [components, data]);

  const handleEntityRefChange = async (entityName, entityid) => {
    try {
      const fetchedAttributes = await fetchAttributesByEntity(entityName);
      const formattedAttributes = fetchedAttributes.map(attr => ({
        label: attr.name,
        value: attr.name
      }));
      setAttributes(prev => ({ ...prev, [entityid]: formattedAttributes }));
    } catch (error) {
      console.error(`Error fetching attributes for entity ${entityName}:`, error);
    }
  };

  const handleInputChange = (value, entityid) => {
    onInputChange(value, entityid);
    const component = components.find(comp => comp.entityid === entityid);
    if (component && component.type === 'entityRef') {
      handleEntityRefChange(value, entityid);
    }
  };

  const isNewRecord = !id;

  const handleClear = () => {
    onClear();
  };

   // Dynamically calculate the max x_pos
   const maxCols = Math.max(...components.map(comp => parseInt(comp.x_pos, 10)));

   // Compute order with type safety checks
   const computeOrder = (component) => {
     const yPos = parseInt(component.y_pos, 10);
     const xPos = parseInt(component.x_pos, 10);
     return (yPos - 1) * maxCols + xPos;
   };

  // Sort components by their computed order
  const sortedComponents = components.sort((a, b) => computeOrder(a) - computeOrder(b));

  // Fill gaps with placeholder components
  const filledComponents = [];
  let expectedOrder = 1;
  sortedComponents.forEach(component => {
    const currentOrder = computeOrder(component);
    while (expectedOrder < currentOrder) {
      filledComponents.push(
        <Grid key={`placeholder-${expectedOrder}`} item xs={12 / maxCols}>
          <p></p> 
        </Grid>
      );
      expectedOrder++;
    }
    filledComponents.push(
      <Grid key={component.entityid} item xs={12 / maxCols}>
        <DynamicComponent
          type={component.type}
          fullWidth
          variant="outlined"
          label={component.label}
          onChange={handleInputChange}
          value={data ? data[component.entityid] || '' : ''}
          entityid={component.entityid}
          options={component.type === 'entityRef' ? collections :
                  component.type === 'entityIdRef' ? attributes[component.entityid] : undefined}
        />
      </Grid>
    );
    expectedOrder++;  // Increment to expect the next order
  });

  return (
    <form onSubmit={onSubmit}>
      <Typography variant="h6" sx={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        {isNewRecord ? 'New ' + name : 'Update ' + name}
      </Typography>
      <Grid container spacing={2}>
        {filledComponents}
        <input type="hidden" name="id" value={id || ''} />
        <Grid item xs={12} sx={{ gridColumn: '1 / -1' }}>
          <Button type="submit" variant="contained" color="primary">Submit</Button>
          <Button type="button" variant="contained" color="secondary" onClick={handleClear}>Clear</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EntityForm;
