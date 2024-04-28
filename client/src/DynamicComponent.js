import React from 'react';
import { TextField, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';

const DynamicComponent = ({ type, label, onChange, value, fullWidth, variant, entityid, options = [] }) => {

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    onChange(newValue, entityid);
  };

  const renderComponent = () => {
    switch (type) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <TextField
            type={type}
            fullWidth={fullWidth}
            variant={variant}
            label={label}
            onChange={handleInputChange}
            value={value || ''}
            autoComplete={type === 'email' ? "email" : undefined}
          />
        );
      case 'uiTypeSelect':  // Dropdown for selecting attribute types
      case 'typeSelect':  // Dropdown for selecting attribute types
        return (
          <TextField
            select
            label={label}
            fullWidth={fullWidth}
            variant={variant}
            value={value}
            onChange={handleInputChange}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'entityRef': // Handle entity references (dropdown)
        return (
          <TextField
            select
            label={label}
            fullWidth={fullWidth}
            variant={variant}
            value={value}
            onChange={handleInputChange}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'entityIdRef':
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
            control={<Checkbox checked={!!value} onChange={(e) => handleInputChange(e)} color="primary" />}
            label={label}
          />
        );
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label={label}
              inputFormat="MM/dd/yyyy"
              value={value || null}
              onChange={(newDate) => onChange(newDate, entityid)}
              renderInput={(params) => <TextField {...params} fullWidth={fullWidth} variant={variant} />}
            />
          </LocalizationProvider>
        );
      default:
        return <p>Unsupported type</p>;
    }
  };

  return renderComponent();
};

export default DynamicComponent;
