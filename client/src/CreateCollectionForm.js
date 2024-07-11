import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, List, ListItem } from '@mui/material';
import { createCollection, listCollections } from './api';

const CreateCollectionForm = ({ token }) => {
  const [collectionName, setCollectionName] = useState('');
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();

  const fetchCollections = async () => {
    try {
      const collections = await listCollections(token);
      setCollections(collections);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createCollection(collectionName, [], token);
      setCollectionName('');
      fetchCollections();
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Button onClick={() => navigate('/')} variant="contained" sx={{ mb: 2 }}>
        Back to Main
      </Button>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="collectionName"
          label="Collection Name"
          name="collectionName"
          autoFocus
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Create Collection
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Collections
      </Typography>
      <List>
        {collections.map((collection, index) => (
          <ListItem key={index}>{collection}</ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CreateCollectionForm;
