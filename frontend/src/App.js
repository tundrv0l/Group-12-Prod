import React from 'react';
import { Grommet } from 'grommet';
import LandingPage from './pages/LandingPage';
import SolverPage from './pages/SolverPage';
import AppLayout from './components/AppLayout';

const App = () => (
  <AppLayout>
    <LandingPage />
  </AppLayout>
);

export default App;
