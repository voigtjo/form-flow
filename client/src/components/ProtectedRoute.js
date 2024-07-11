import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ token, redirectPath = '/login' }) => {
  return token ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default ProtectedRoute;
