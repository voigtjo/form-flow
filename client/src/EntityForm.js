import React, { useEffect } from 'react';
import { Grid, Button, Typography } from '@mui/material';
import DynamicComponent from './DynamicComponent';

const EntityForm = ({
  id,
  components,
  onInputChange,
  onSubmit,
  onClear,
  data,
  name,
  collections,
  attributes,
  datasets,
  setAttributes,
  setDatasets,
  fetchAttributesByEntity,
  fetchData,
  token
}) => {

  useEffect(() => {
    components.forEach(component => {
      if (component.type === 'entityRef' && data[component.entityid]) {
        handleEntityRefChange(data[component.entityid], component.entityid);
      } else if (component.type === 'ref') {
        handleRefChanges(component.entityid);
      }
    });
  }, [components, data]);

  const handleEntityRefChange = async (entityName, entityid) => {
    try {
      console.log('0) EntityForm.fetchAttributesByEntity: token=', token);
      const fetchedAttributes = await fetchAttributesByEntity(entityName, token);
      const formattedAttributes = fetchedAttributes.map(attr => ({
        label: attr.name,
        value: attr.name
      }));
      setAttributes(prev => {
        const updatedAttributes = { ...prev, [entityid]: formattedAttributes };
        return updatedAttributes;
      });
    } catch (error) {
      console.error(`Error fetching attributes for entity ${entityName}:`, error);
    }
  };

  const handleRefChanges = async (entityid) => {
    try {
      const fetchedData = await fetchData(entityid, token);
      const formattedData = fetchedData.map(item => ({
        label: item.name,
        value: item._id
      }));
      setDatasets(prev => ({ ...prev, [entityid]: formattedData }));
    } catch (error) {
      console.error(`Error fetching data for ${entityid}:`, error);
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

  const maxCols = Math.max(...components.map(comp => parseInt(comp.x_pos, 10)));

  const computeOrder = (component) => {
    const yPos = parseInt(component.y_pos, 10);
    const xPos = parseInt(component.x_pos, 10);
    return (yPos - 1) * maxCols + xPos;
  };

  const typeOptions = [
    { label: 'String', value: 'String' },
    { label: 'Number', value: 'Number' },
    { label: 'Date', value: 'Date' },
    { label: 'Ref', value: 'Ref' }
  ];

  const uiTypeOptions = [
    { label: 'text', value: 'text' },
    { label: 'number', value: 'number' },
    { label: 'email', value: 'email' },
    { label: 'typeSelect', value: 'typeSelect' },
    { label: 'uiTypeSelect', value: 'uiTypeSelect' },
    { label: 'ref', value: 'ref' },
    { label: 'entityRef', value: 'entityRef' },
    { label: 'entityIdRef', value: 'entityIdRef' },
    { label: 'checkbox', value: 'checkbox' },
    { label: 'date', value: 'date' }
  ];

  const sortedComponents = components.sort((a, b) => computeOrder(a) - computeOrder(b));

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
          options={
            component.type === 'uiTypeSelect' ? uiTypeOptions :
            component.type === 'typeSelect' ? typeOptions :
            component.type === 'ref' ? datasets[component.entityid] || [] :
            component.type === 'entityRef' ? collections :
            component.type === 'entityIdRef' ? attributes['entity'] || [] : []
          }
        />
      </Grid>
    );
    expectedOrder++;
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
