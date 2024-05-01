import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EntityTable = ({
  entities, 
  tableColumns, 
  activeTab, 
  searchTerm, 
  setSearchTerm, 
  selectedEntity,
  setSelectedEntity,
  entityOptions
}) => {
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab, setSearchTerm]);

  const maxCols = Math.max(...tableColumns.map(col => parseInt(col.x_pos, 10)));

  const computeOrder = (column) => {
    const yPos = parseInt(column.y_pos, 10);
    const xPos = parseInt(column.x_pos, 10);
    return (yPos - 1) * maxCols + xPos;
  };

  const sortedColumns = [...tableColumns].sort((a, b) => computeOrder(a) - computeOrder(b));

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedEntities = [...entities].sort((a, b) => {
    if (sortBy && a[sortBy] && b[sortBy]) {
      const columnA = a[sortBy].toString().toLowerCase();
      const columnB = b[sortBy].toString().toLowerCase();

      if (columnA < columnB) return sortDirection === 'asc' ? -1 : 1;
      if (columnA > columnB) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const sortedAndFilteredEntities = sortedEntities.filter(entity => {
    return searchTerm === '' || Object.keys(entity).some(key => {
      if (key !== '_id' && key !== 'id') {
        const value = entity[key] ? entity[key].toString().toLowerCase() : '';
        return value.includes(searchTerm.toLowerCase());
      }
      return false;
    });
  });

  const handleEdit = (entityId) => {
    navigate(`/${activeTab}/${entityId}`);
  };

  return (
    <Box pt={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: 20, flexGrow: 1 }}
        />
        {['attribute', 'uielement'].includes(activeTab) && (
          <TextField
            select
            label="Select Entity"
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            style={{ width: 200 }}
          >
            <MenuItem value="">None</MenuItem>
            {entityOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {sortedColumns.map(column => (
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
                {sortedColumns.map(column => (
                  <TableCell key={column.entityid}>{entity[column.entityid]}</TableCell>
                ))}
                <TableCell>
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
  );
};

export default EntityTable;