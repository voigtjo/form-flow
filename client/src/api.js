// api.js

const BASE_URL = 'http://localhost:5050'; // Replace this with your actual API base URL

export const fetchUiElements = async (entity) => {
  try {
    const response = await fetch(`${BASE_URL}/ui-elements/${entity}`);
    const data = await response.json();
    console.log(`UI elements fetched for entity=:${entity}: `, data);
    return data;
  } catch (error) {
    console.error(`Error fetching UI elements for ${entity}:`, error);
    throw error;
  }
};

export const fetchData = async (tab) => {
  const url = tab === 'user' ? 'http://localhost:5050/user' : `http://localhost:5050/${tab}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching ${tab} data: ${error.message}`);
  }
};

export const fetchEntityById = async (entity, id) => {
  try {
    const response = await fetch(`${BASE_URL}/${entity}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${entity} by ID ${id}:`, error);
    throw error;
  }
};

export const createCollection = async (collectionName, attributes) => {
  try {
    console.log("createCollection: collectionName= " + collectionName);
    const response = await fetch(`${BASE_URL}/create-collection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ collectionName, attributes }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Collection created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
};

export const listCollections = async () => {
  try {
    const response = await fetch(`${BASE_URL}/list-collections`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const collectionNames = await response.json();
    return collectionNames;
  } catch (error) {
    console.error("Error listing collections:", error);
    throw error;
  }
};


export const reinitializeSchemas = async () => {
  try {
    console.log("reinitialize schemas...");
    const response = await fetch(`${BASE_URL}/reinitialize-schemas`, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Schemas reinitialized:", data);
    return data;
  } catch (error) {
    console.error("Error reinitializing schemas:", error);
    throw error;
  }
};




export const postData = async (endpoint, body) => {
  console.log("api.postData: endpoint= " + endpoint + ", body.json= " + JSON.stringify(body));
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// Update the updateData function
export const updateData = async (endpoint, body) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const updatedData = await response.json();
    return updatedData;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    throw error;
  }
};

export const deleteData = async (entity, id) => {
  try {
    const response = await fetch(`${BASE_URL}/${entity}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete ${entity} with ID ${id}`);
    }
  } catch (error) {
    console.error(`Error deleting ${entity} with ID ${id}:`, error);
    throw error;
  }
};

// Add other API functions as needed
