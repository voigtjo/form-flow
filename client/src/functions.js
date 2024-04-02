// functions.js
import { useState, useEffect } from 'react';
import { fetchData, postData, updateData } from './api';

export const useEntityData = (activeTab) => {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const fetchDataForTab = async () => {
      try {
        const data = await fetchData(activeTab);
        setEntities(data);
        console.log(`Data received for ${activeTab}:`, data);
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      }
    };
    fetchDataForTab();
  }, [activeTab]);

  return { entities };
};

export const useUiElements = (activeTab, setEntityData) => {
  const [uiElements, setUiElements] = useState([]);

  useEffect(() => {
    const fetchUiElements = async () => {
      try {
        const data = await fetchData('ui-elements');
        setUiElements(data);
        initializeEntityData(data.filter(element => element.entity === activeTab), setEntityData);
      } catch (error) {
        console.error(`Error fetching UI elements:`, error);
      }
    };
    fetchUiElements();
  }, [activeTab, setEntityData]);

  return { uiElements };
};

const initializeEntityData = (data, setEntityData) => {
  const initialEntityData = data.reduce((acc, curr) => {
    acc[curr.entityid] = '';
    return acc;
  }, { id: null });
  setEntityData(initialEntityData);
};

export const handleFormSubmit = (activeTab, entityData, setEntities, entities, selectedEntityIndex, setSelectedEntityIndex, uiElements, setEntityData, postData, updateData) => {
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

export const handleFormClear = (activeTab, uiElements, setEntityData) => {
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
