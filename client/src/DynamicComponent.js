import React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const DynamicComponent = ({ type, label, onChange, value, fullWidth, variant, entityid, options = [] }) => {
  const handleInputChange = (newValue) => {
    if (newValue instanceof Date || typeof newValue === 'string' || typeof newValue === 'number') {
      onChange(newValue, entityid);
    } else if (newValue.target.type === 'checkbox') {
      onChange(newValue.target.checked, entityid); // For checkboxes, handle checked state
    } else {
      onChange(newValue.target.value, entityid); // Handle event object for TextField and select
    }
  };

  const renderComponent = () => {
    switch (type) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <TextField
            type={type === 'email' ? 'email' : (type === 'number' ? 'number' : 'text')}
            fullWidth={fullWidth}
            variant={variant}
            label={label}
            onChange={handleInputChange}
            value={value || ''}
            autoComplete={type === 'email' ? "email" : undefined}
          />
        );
      case 'select':
        return (
          <TextField
            select
            label={label}
            fullWidth={fullWidth}
            variant={variant}
            value={value || ''}
            onChange={handleInputChange}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={value || false}
                onChange={handleInputChange}
                color="primary"
              />
            }
            label={label}
          />
        );
      case 'date':
        return (
          <DesktopDatePicker
            label={label}
            inputFormat="MM/dd/yyyy"
            value={value || null}
            onChange={handleInputChange}
            renderInput={(params) => <TextField {...params} fullWidth={fullWidth} variant={variant} />}
          />
        );
      default:
        return <p>Unsupported component type</p>;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {renderComponent()}
    </LocalizationProvider>
  );
};

export default DynamicComponent;
