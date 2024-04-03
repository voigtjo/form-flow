import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EntityTable = ({ entities, tableColumns, activeTab, searchTerm, setSearchTerm }) => {
  console.log("EntityTable: activeTab= " + activeTab)
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate(); // Add useNavigate hook

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab, setSearchTerm]); // Include setSearchTerm in the dependency array

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedEntities = [...entities].sort((a, b) => {
    if (sortBy && a[sortBy] && b[sortBy]) { // Add null check for properties
      const columnA = a[sortBy].toString().toLowerCase();
      const columnB = b[sortBy].toString().toLowerCase();
  
      if (columnA < columnB) return sortDirection === 'asc' ? -1 : 1;
      if (columnA > columnB) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const sortedAndFilteredEntities = sortedEntities.filter(entity => {
    // Filter by search term
    const searchMatches = searchTerm === '' || Object.keys(entity).some(key => {
      if (key !== '_id' && key !== 'id') {
        const value = entity[key] ? entity[key].toString().toLowerCase() : ''; // Add null check
        return value.includes(searchTerm.toLowerCase());
      }
      return false;
    });

    return searchMatches;
  });

  const handleEdit = (entityId) => {
    console.log("handleEdit: activeTab= " + activeTab + ", entityId= " + entityId);
    // Navigate to EntityFormWrapper with the appropriate parameters
    navigate(`/${activeTab}/${entityId}`);
  };

  return (
    <Box pt={2}>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20 }}
      />
      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {tableColumns.map(column => (
                  <TableCell key={column.entityid} 
                    onClick={() => handleSort(column.entityid)}
                    sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {column.label}
                    {sortBy === column.entityid && (
                      <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                    )}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAndFilteredEntities.map((entity, index) => (
                <TableRow key={index}>
                  {tableColumns.map(column => (
                    <TableCell key={column.entityid}>{entity[column.entityid]}</TableCell>
                  ))}
                  <TableCell>
                    {/* Pass entityId to handleEdit function */}
                    <Button onClick={() => handleEdit(entity.id)} variant="outlined" color="primary">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default EntityTable;
