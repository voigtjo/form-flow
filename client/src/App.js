import React, { useState, useEffect } from 'react';
import EntityForm from './EntityForm';
import EntityTable from './EntityTable';
import { Container, Typography, Grid, Button } from '@mui/material';

const BASE_URL = 'http://localhost:5050';

const App = () => {
  const [entityData, setEntityData] = useState({});
  const [entities, setEntities] = useState([]);
  const [selectedEntityIndex, setSelectedEntityIndex] = useState(null);
  const [uiElements, setUiElements] = useState([]);
  const [activeTab, setActiveTab] = useState('user'); // default tab

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${activeTab}`);
        const data = await response.json();
        setEntities(data);
        console.log(`Data received for ${activeTab}:`, data);
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      }
    };
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const fetchUiElements = async () => {
      try {
        const response = await fetch(`${BASE_URL}/ui-elements`);
        const data = await response.json();
        setUiElements(data);
        initializeEntityData(data.filter(element => element.entity === activeTab));
      } catch (error) {
        console.error(`Error fetching UI elements:`, error);
      }
    };
    fetchUiElements();
  }, [activeTab]);

  const initializeEntityData = (data) => {
    const initialEntityData = data.reduce((acc, curr) => {
      acc[curr.props.id] = '';
      return acc;
    }, { id: null });
    setEntityData(initialEntityData);
  };

  const handleInputChange = (value, key) => {
    setEntityData({ ...entityData, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isNewEntity = entityData.id === null;

    fetch(isNewEntity ? `${BASE_URL}/${activeTab}` : `${BASE_URL}/${activeTab}/${entityData.id}`, {
      method: isNewEntity ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entityData),
    })
      .then(response => response.json())
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
            acc[curr.props.id] = '';
            return acc;
          }, { id: null });
          setEntityData(initialEntityData);
        }
      })
      .catch(error => console.error(`Error saving ${activeTab}:`, error));
  };

  const handleEdit = (index) => {
    setEntityData(entities[index]);
    setSelectedEntityIndex(index);
  };

  const handleClear = () => {
    // Initialize entityData with values from ui-elements if available
    const filteredElements = uiElements.filter(element => element.entity === activeTab);
    if (filteredElements.length > 0) {
      const initialEntityData = filteredElements.reduce((acc, curr) => {
        acc[curr.props.id] = '';
        return acc;
      }, { id: null });
      setEntityData(initialEntityData);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Container>
      <Typography variant="h2" align="center">Form Flow</Typography>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          {Array.from(new Set(uiElements.map(element => element.entity))).map((tab, index) => (
            <Button
              key={index}
              onClick={() => handleTabChange(tab)}
              variant={activeTab === tab ? 'contained' : 'outlined'}
              color="primary"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Form
            </Button>
          ))}
        </Grid>
        <Grid item xs={9}>
          {uiElements.filter(element => element.entity === activeTab).length > 0 && (
            <EntityForm
              id={entityData.id}
              components={uiElements.filter(element => element.entity === activeTab)}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onClear={handleClear}
              data={entityData}
              name={activeTab}
            />
          )}
          {uiElements.filter(element => element.entity === activeTab).length > 0 && (
            <EntityTable entities={entities} onEdit={handleEdit} tableColumns={uiElements.filter(element => element.entity === activeTab)} name={activeTab}/>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
