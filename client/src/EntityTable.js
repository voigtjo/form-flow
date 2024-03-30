import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';

const EntityTable = ({ entities, onEdit, tableColumns, name, searchTerm, setSearchTerm }) => {
  // Filter entities based on search term and filter column
  const filteredEntities = entities.filter(entity => {
    // Filter by search term
    const searchMatches = searchTerm === '' || Object.keys(entity).some(key => {
      if (key !== '_id' && key !== 'id') {
        const value = entity[key].toString().toLowerCase();
        return value.includes(searchTerm.toLowerCase());
      }
      return false;
    });
  
    return searchMatches;
  });

  return (
    <div>
      {/* Search Input */}
      <TextField
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableColumns.map(column => (
                <TableCell key={column.entityid} sx={{ fontWeight: 'bold' }}>{column.label}</TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntities.map((entity, index) => (
              <TableRow key={index}>
                {tableColumns.map(column => (
                  <TableCell key={column.entityid}>{entity[column.entityid]}</TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => onEdit(index)} variant="outlined" color="primary">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EntityTable;
