import React, { useState, useEffect } from 'react';
import { Grid, Box, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import EntityForm from './EntityForm';
import { postData, updateData, fetchEntityById, listCollections, fetchAttributesByEntity, fetchData } from './api';
import * as functions from './functions';

const EntityFormWrapper = ({ token }) => {
  const { entity, entityId } = useParams();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const selectedEntityParam = urlParams.get('selectedEntity');
  const [uiElements, setUiElements] = useState([]);
  const [entityData, setEntityData] = useState({});
  const [collections, setCollections] = useState([]);
  const [attributes, setAttributes] = useState({});
  const [datasets, setDatasets] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log('1) EntityFormWrapper.fetchInitialData: token= ', token);
        await functions.fetchUiElementsData(entity, setUiElements, token);  // Correctly pass token here

        if (entityId !== undefined && entityId !== null) {
          await fetchEntityData(entity, entityId);
        }

        const fetchedCollections = await listCollections(token);
        setCollections(fetchedCollections.map(name => ({ label: name, value: name })));

        await fetchAttributesAndReferences();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, [entity, entityId, token]);

  const fetchEntityData = async (entity, entityId) => {
    try {
      const data = await fetchEntityById(entity, entityId, token);
      setEntityData(data);
    } catch (error) {
      console.error(`Error fetching ${entity} by ID ${entityId}:`, error);
    }
  };

  const fetchAttributesAndReferences = async () => {
    try {
      const attributePromises = uiElements.map(async (component) => {
        if (component.type === 'entityRef') {
          const fetchedAttributes = await fetchAttributesByEntity(component.entityid, token);
          return { [component.entityid]: fetchedAttributes.map(attr => ({ label: attr.name, value: attr.name })) };
        }
        return {};
      });

      const referencePromises = uiElements.map(async (component) => {
        if (component.type === 'ref') {
          const fetchedData = await fetchData(component.entityid, token);
          return { [component.entityid]: fetchedData.map(item => ({ label: item.name, value: item._id })) };
        }
        return {};
      });

      const resolvedAttributes = await Promise.all(attributePromises);
      const resolvedReferences = await Promise.all(referencePromises);

      setAttributes(Object.assign({}, ...resolvedAttributes));
      setDatasets(Object.assign({}, ...resolvedReferences));
    } catch (error) {
      console.error('Error fetching attributes and references:', error);
    }
  };

  const handleInputChange = (value, key) => {
    functions.handleInputChange(value, key, entityData, setEntityData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isCreation = entityId === null || entityId === undefined;
    const endpoint = isCreation ? entity : `${entity}/${entityId}`;

    try {
      let updatedData;
      if (isCreation) {
        updatedData = await postData(endpoint, entityData, token);
        navigate(`/${entity}/${updatedData._id}`);
      } else {
        updatedData = await updateData(endpoint, entityData, token);
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
    const navigationString = `/?activeTab=${entity}&selectedEntity=${selectedEntityParam}`;
    navigate(navigationString);
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
              columnWidth: 4
            }))}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onClear={handleClear}
            data={entityData}
            name={entity}
            collections={collections}
            attributes={attributes}
            datasets={datasets}
            setAttributes={setAttributes}
            setDatasets={setDatasets}
            fetchAttributesByEntity={fetchAttributesByEntity}
            fetchData={fetchData}
            token={token}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default EntityFormWrapper;
