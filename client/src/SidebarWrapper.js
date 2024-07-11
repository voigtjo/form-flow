import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import queryString from 'query-string'; // Import queryString library
import * as functions from './functions'; // Import functions
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation hook
import { reinitializeSchemas } from './api'; // Ensure listCollections is correctly imported

const SidebarWrapper = ({ sections, token }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const queryParams = queryString.parse(location.search); // Parse query parameters
  const [searchTerm, setSearchTerm] = useState('');
  const [uiElements, setUiElements] = useState([]);
  const [activeTab, setActiveTab] = useState(queryParams.activeTab || 'user'); // Set active tab from query parameter, default to 'user'
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to track sidebar visibility

  useEffect(() => {
    functions.fetchUiElementsData(activeTab, setUiElements, setSearchTerm, token);
    setSearchTerm('');
  }, [activeTab, token]);

  const handleReinitializeClick = () => {
    reinitializeSchemas(token)
      .then(() => {
        alert('Schemas reinitialized successfully');
      })
      .catch((error) => {
        console.error("Failed to reinitialize schemas:", error);
        alert('Failed to reinitialize schemas');
      });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div style={{ width: 300 }}> {/* Adjust width as necessary */}
      <Sidebar
        navigateToCreateCollection={() => navigate("/create-collection-form")}
        handleReinitializeClick={handleReinitializeClick}
        handleTabChange={handleTabChange}
        uiElements={uiElements}
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        sections={sections}
      />
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>Toggle Sidebar</button>
    </div>
  );
};

export default SidebarWrapper;
