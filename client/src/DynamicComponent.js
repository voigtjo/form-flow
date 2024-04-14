import React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';

const DynamicComponent = ({ type, label, onChange, value, fullWidth, variant, entityid }) => {
  const handleInputChange = (newValue) => {
    if (newValue instanceof Date || typeof newValue === 'string' || typeof newValue === 'number') {
      onChange(newValue, entityid); // Directly handle changes for dates and numbers.
    } else {
      onChange(newValue.target.value, entityid); // Handle event object for TextField.
    }
  };

  const renderComponent = () => {
    switch (type) {
      case 'text':
        return (
          <TextField
            fullWidth={fullWidth}
            variant={variant}
            label={label}
            onChange={handleInputChange}
            value={value || ''}
          />
        );
      case 'email':
        return (
          <TextField
            fullWidth={fullWidth}
            variant={variant}
            label={label}
            type="email"
            onChange={handleInputChange}
            value={value || ''}
            autoComplete="email"  // Helps browsers identify the field as an email field for autofilling
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
      case 'number':
        return (
          <TextField
            fullWidth={fullWidth}
            variant={variant}
            label={label}
            type="number"
            onChange={handleInputChange}
            value={value || ''}
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
