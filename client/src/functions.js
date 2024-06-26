import { fetchData } from './api'; // Import API functions

export const fetchDataForTab = async (activeTab, setEntities) => {
  try {
    const data = await fetchData(activeTab);
    setEntities(data);
  } catch (error) {
    console.error(`Error fetching ${activeTab}:`, error);
  }
};

export const fetchUiElements = async (activeTab, setUiElements, setSearchTerm) => {
  try {
    const data = await fetchData('ui-elements');
    setUiElements(data);
  } catch (error) {
    console.error(`Error fetching UI elements:`, error);
  }
};


export const handleInputChange = (value, key, entityData, setEntityData) => {
  console.log("functions.handleInputChange: value= " + value + ", key= " + key);
  setEntityData({ ...entityData, [key]: value });
};

export const handleSubmit = async (e, isNewEntity, activeTab, entityData, entities, setEntities, selectedEntityIndex, setSelectedEntityIndex, uiElements, setEntityData, postData, updateData, setSearchTerm) => {
  e.preventDefault();

  const endpoint = isNewEntity ? activeTab : `${activeTab}/${entityData.id}`;
  const apiFunction = isNewEntity ? postData : updateData;

  try {
    const data = await apiFunction(endpoint, entityData);
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

export const handleNewEntity = async (activeTab, uiElements, postData) => {
  try {
    // Create an empty entity object with id set to null
    const emptyEntity = { id: null };

    // Filter UI elements for the active tab
    const filteredUiElements = uiElements.filter(element => element.entity === activeTab);

    // Initialize empty entity with properties from UI elements
    filteredUiElements.forEach(element => {
      emptyEntity[element.entityid] = '';
    });

    // Submit postData with the empty entity
    // const newEntity = await postData(activeTab, emptyEntity);

    const newEntity = emptyEntity;
    
    return newEntity;
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
