import React from 'react';
import { Grid, TextField, Button, Typography } from '@mui/material';
import DynamicComponent from './DynamicComponent';

const EntityForm = ({ id, components, onInputChange, onSubmit, onClear, data, name, collections }) => {
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
        {components.map((component, index) => (
          <Grid key={index} item xs={component.columnWidth || 12}>
            <DynamicComponent
              type={component.type}
              fullWidth
              variant="outlined"
              label={component.label}
              onChange={onInputChange}
              value={data ? data[component.entityid] || '' : ''}
              entityid={component.entityid}
              options={component.type === 'entityRef' ? collections : undefined}
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
