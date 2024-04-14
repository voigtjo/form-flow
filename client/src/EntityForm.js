// EntityForm.js

import React from 'react';
import { Grid, TextField, Button, Typography } from '@mui/material';
import DynamicComponent from './DynamicComponent'; // Ensure the correct path is set

const EntityForm = ({ id, components, onInputChange, onSubmit, onClear, data, name }) => {
  console.log('Received data in EntityForm:', data); // Debugging statement

  const isNewRecord = !id;

  const handleClear = () => {
    onClear();
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2} style={{ marginTop: '32px' }}>
        <Grid item xs={12}>
          <Typography variant="h6">{isNewRecord ? 'New ' + name : 'Update ' + name}</Typography>
        </Grid>
        {components && components.map((component, index) => (
          <Grid key={index} item xs={component.columnWidth || 12}> {/* Utilizing columnWidth */}
            <DynamicComponent
              type={component.type} // This should come from each component's definition
              fullWidth
              variant="outlined"
              label={component.label}
              onChange={onInputChange}
              value={data ? data[component.entityid] || '' : ''}
              entityid={component.entityid}
            />
          </Grid>
        ))}
        <input type="hidden" name="id" value={id || ''} />
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">Submit</Button>
          <Button type="button" variant="contained" color="secondary" onClick={handleClear}>Clear</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EntityForm;
