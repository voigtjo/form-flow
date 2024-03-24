// EntityTable.js
import React from 'react';
import { Table, TableContainer, Typography, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const EntityTable = ({ entities, onEdit, tableColumns, name}) => {


  return (
   
    <TableContainer>
       <Typography variant="h4" align="center">{name}s</Typography>
      <Table>
        <TableHead>
          <TableRow>
            {tableColumns?.map((column, index) => (
              <TableCell key={index}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(entities) && entities.map((entity, entityIndex) => (
            <TableRow key={entityIndex} onClick={() => onEdit(entityIndex)}>
              {tableColumns.map((column, columnIndex) => (
                <TableCell key={columnIndex}>{entity[column.props.id]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EntityTable;
