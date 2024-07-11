import { fetchData, postData, updateData } from './api'; // Import API functions

export const fetchDataForTab = async (activeTab, setEntities, token) => {
  try {
    const data = await fetchData(activeTab, token);
    setEntities(data);
  } catch (error) {
    console.error(`Error fetching ${activeTab}:`, error);
  }
};

export const fetchUiElementsData = async (activeTab, setUiElements, token) => {
  try {
    const data = await fetchData('ui-elements', token);
    setUiElements(data);
  } catch (error) {
    console.error(`Error fetching UI elements:`, error);
  }
};

export const handleInputChange = (value, key, entityData, setEntityData) => {
  setEntityData({ ...entityData, [key]: value });
};

export const handleSubmit = async (e, isNewEntity, activeTab, entityData, entities, setEntities, selectedEntityIndex, setSelectedEntityIndex, uiElements, setEntityData, token) => {
  e.preventDefault();

  const endpoint = isNewEntity ? activeTab : `${activeTab}/${entityData.id}`;
  const apiFunction = isNewEntity ? postData : updateData;

  try {
    const data = await apiFunction(endpoint, entityData, token);
    if (isNewEntity) {
      setEntities([...entities, data]);
    } else {
      const updatedEntities = [...entities];
      updatedEntities[selectedEntityIndex] = data;
      setEntities(updatedEntities);
      setSelectedEntityIndex(null);
    }
    const filteredElements = uiElements.filter(element => element.entity === activeTab);
    if (filteredElements.length > 0) {
      const initialEntityData = filteredElements.reduce((acc, curr) => {
        acc[curr.entityid] = '';
        return acc;
      }, { id: null });
      setEntityData(initialEntityData);
    }
  } catch (error) {
    console.error(`Error saving ${activeTab}:`, error);
  }
};

export const handleEdit = async (index, entity, entities, setEntityData, setSelectedEntityIndex) => {
  try {
    setEntityData(entities[index]);
    setSelectedEntityIndex(index);
  } catch (error) {
    console.error(`Error handling edit:`, error);
  }
};

export const handleNewEntity = async (activeTab, uiElements) => {
  try {
    // Create an empty entity object with id set to null
    const emptyEntity = { id: null };

    // Filter UI elements for the active tab
    const filteredUiElements = uiElements.filter(element => element.entity === activeTab);

    // Initialize empty entity with properties from UI elements
    filteredUiElements.forEach(element => {
      emptyEntity[element.entityid] = '';
    });

    return emptyEntity;
  } catch (error) {
    console.error('Error creating new entity:', error);
    throw error;
  }
};

export const handleClear = (activeTab, uiElements, setEntityData) => {
  const filteredElements = uiElements.filter(element => element.entity === activeTab);
  if (filteredElements.length > 0) {
    const initialEntityData = filteredElements.reduce((acc, curr) => {
      acc[curr.entityid] = '';
      return acc;
    }, { id: null });
    setEntityData(initialEntityData);
  }
};

export const handleSearch = (event, setSearchTerm) => {
  const { value } = event.target;
  setSearchTerm(value);
};
