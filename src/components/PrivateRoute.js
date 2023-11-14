import React, { useEffect } from 'react';
import { Route, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ path, element, isAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Route path={path} element={element} /> : null;
};

export default PrivateRoute;