import React from 'react';
import { TextField, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';

const DynamicComponent = ({ type, label, onChange, value, fullWidth, variant, entityid, options = [] }) => {

  const handleInputChange = (newValue) => {
    if (newValue instanceof Date || typeof newValue === 'string' || typeof newValue === 'number') {
      onChange(newValue, entityid);
    } else if (newValue.target.type === 'checkbox') {
      onChange(newValue.target.checked, entityid);
    } else {
      onChange(newValue.target.value, entityid);
    }
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
          if (options.length === 0) {
            return <TextField label={label} fullWidth={fullWidth} variant={variant} disabled />;
          }
          return (
            <TextField
                select
                label={label}
                fullWidth={fullWidth}
                variant={variant}
                value={value || ''}  // Ensure there's a valid fallback
                onChange={(e) => onChange(e.target.value, entityid)}
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
            control={<Checkbox checked={value || false} onChange={handleInputChange} color="primary" />}
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
        return <p></p>;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {renderComponent()}
    </LocalizationProvider>
  );
};

export default DynamicComponent;
