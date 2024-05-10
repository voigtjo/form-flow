import React from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const Multiselector = ({ sections, setSections }) => {
    const handleSectionToggle = (section) => {
        setSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <FormGroup>
            <FormControlLabel
                control={<Checkbox checked={sections.adminOperations} onChange={() => handleSectionToggle('adminOperations')} />}
                label="Admin Operations"
            />
            <FormControlLabel
                control={<Checkbox checked={sections.adminEntities} onChange={() => handleSectionToggle('adminEntities')} />}
                label="Admin Entities"
            />
            <FormControlLabel
                control={<Checkbox checked={sections.entityFormsPanel} onChange={() => handleSectionToggle('entityFormsPanel')} />}
                label="Entity Forms Panel"
            />
            <FormControlLabel
                control={<Checkbox checked={sections.layoutPanel} onChange={() => handleSectionToggle('layoutPanel')} />}
                label="Layout Panel"
            />
        </FormGroup>
    );
};

export default Multiselector;
