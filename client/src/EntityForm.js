import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Typography } from '@mui/material';
import DynamicComponent from './DynamicComponent';
import { fetchAttributesByEntity } from './api'; // make sure this is imported

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
              onChange={handleInputChange}
              value={data ? data[component.entityid] || '' : ''}
              entityid={component.entityid}
              options={component.type === 'entityRef' ? collections :
                      component.type === 'entityIdRef' ? attributes['entity'] : undefined}
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
