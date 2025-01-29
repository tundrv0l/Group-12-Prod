import React from 'react';
import LandingPage from './pages/LandingPage';
import WFFSolverPage from './pages/WFFSolverPage';
import AppLayout from './components/AppLayout';
import { Router } from './router/Router';
import Routes from './router/Routes';
import Route from './router/Route';

const App = () => (
  <AppLayout>
    <Router>
      <Routes>
        <Route path="/" Component={LandingPage} />
        <Route path="/wff-truthtable" Component={WFFSolverPage} />
      </Routes>
    </Router>
  </AppLayout>
);

export default App;
