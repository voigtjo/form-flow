// api.js

const BASE_URL = 'http://localhost:5050'; // Replace this with your actual API base URL

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
    //console.log("url=" + `${BASE_URL}/${entity}/${id}`);
    const response = await fetch(`${BASE_URL}/${entity}/${id}`);
    const data = await response.json();
    //console.log("data:");
    //console.log(data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${entity} by ID ${id}:`, error);
    throw error;
  }
};

export const postData = async (endpoint, body) => {
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
    console.log(`${entity} with ID ${id} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting ${entity} with ID ${id}:`, error);
    throw error;
  }
};

// Add other API functions as needed
