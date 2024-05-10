import React, { createContext, useContext, useState } from 'react';

const SectionsContext = createContext();

export const useSections = () => useContext(SectionsContext);

export const SectionsProvider = ({ children }) => {
    const [sections, setSections] = useState({
        adminOperations: false,
        adminEntities: false,
        entityFormsPanel: true,
        layoutPanel: true
    });

    return (
        <SectionsContext.Provider value={{ sections, setSections }}>
            {children}
        </SectionsContext.Provider>
    );
};
