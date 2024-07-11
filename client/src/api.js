import axios from 'axios';

const BASE_URL = 'http://localhost:5050'; // Replace this with your actual API base URL

const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const fetchAttributesByEntity = async (entity, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/attributes/${entity}`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching attributes for ${entity}:`, error);
    throw error;  // Re-throw to allow the calling context to handle it
  }
};

export const fetchUiElements = async (entity, token) => {
  console.log(`fetchUiElements: token= `, token);
  try {
    const response = await axios.get(`${BASE_URL}/ui-elements/${entity}`, {
      headers: getAuthHeaders(token),
    });
    console.log(`UI elements fetched for entity=:${entity}: `, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching UI elements for ${entity}:`, error);
    throw error;
  }
};



export const fetchData = async (endpoint, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    if (!response.ok) {
      throw new Error(`fetchData - HTTP error! status: ${response.status}`, BASE_URL, endpoint);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint} data:`, error);
    throw error;
  }
};

export const fetchEntityById = async (entity, id, token) => {
  try {
    const url = `${BASE_URL}/${entity}/${id}`;
    const response = await axios.get(url, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entity} by ID ${id}:`, error);
    throw error;
  }
};

export const createCollection = async (collectionName, attributes, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-collection`, 
    { collectionName, attributes },
    {
      headers: getAuthHeaders(token),
    });
    console.log("Collection created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
};

export const listCollections = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/list-collections`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error listing collections:", error);
    throw error;
  }
};

export const reinitializeSchemas = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/reinitialize-schemas`, {
      headers: getAuthHeaders(token),
    });
    console.log("Schemas reinitialized:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error reinitializing schemas:", error);
    throw error;
  }
};

export const postData = async (endpoint, body, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/${endpoint}`, body, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const updateData = async (endpoint, body, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/${endpoint}`, body, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    throw error;
  }
};

export const deleteData = async (entity, id, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${entity}/${id}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.status === 200) {
      throw new Error(`Failed to delete ${entity} with ID ${id}`);
    }
  } catch (error) {
    console.error(`Error deleting ${entity} with ID ${id}:`, error);
    throw error;
  }
};

// Add other API functions as needed
