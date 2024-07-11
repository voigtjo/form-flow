import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainPage from './MainPage';
import EntityFormWrapper from './EntityFormWrapper';
import CreateCollectionForm from './CreateCollectionForm';
import LayoutRenderer from './LayoutRenderer';
import SidebarWrapper from './SidebarWrapper';
import EntityTableWrapper from './EntityTableWrapper';
import { SectionsProvider } from './SectionsProvider';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const layout = [
    [
      { size: 6, color: 'red', content: 'Tile 1' },
      { size: 6, color: 'blue', content: 'Tile 2' }
    ],
    [
      { size: 4, color: 'green', content: 'Tile 3' },
      { size: 4, color: 'yellow', content: 'Tile 4' },
      { size: 4, color: 'purple', content: 'Tile 5' }
    ]
  ];

  const [sections, setSections] = useState({
    adminOperations: false,
    adminEntities: false,
    entityFormsPanel: true,
    layoutPanel: true
  });

  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <SectionsProvider>
      <Container>
        <Typography variant="h3" align="center">Form Flow</Typography>
        <Router>
          {token ? (
            <Button onClick={handleLogout} variant="contained" color="secondary">
              Logout
            </Button>
          ) : (
            <>
              <Button component={Link} to="/login" variant="contained" color="primary">
                Login
              </Button>
              <Button component={Link} to="/register" variant="contained" color="primary">
                Register
              </Button>
            </>
          )}
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute token={token} />}>
              <Route path="/" element={<MainPage sections={sections} setSections={setSections} token={token} />} />
              <Route path="/create-collection-form" element={<CreateCollectionForm token={token} />} />
              <Route path="/layout-renderer" element={<LayoutRenderer layout={layout} />} />
              <Route path="/sidebar" element={<SidebarWrapper token={token} sections={sections} />} />
              <Route path="/:entity/:entityId" element={<EntityFormWrapper token={token} />} />
              <Route path="/:entity/" element={<EntityFormWrapper token={token} />} />
              <Route path="/list/:entity/" element={<EntityTableWrapper token={token} />} />
            </Route>
          </Routes>
        </Router>
      </Container>
    </SectionsProvider>
  );
};

export default App;
