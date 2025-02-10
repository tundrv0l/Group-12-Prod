import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import WFFSolverPage from './pages/WFFSolverPage';
import PropositionalLogic from './pages/PropositionalLogicSolver';
import ReportForm from './pages/ReportForm';
import AppLayout from './components/AppLayout';
import NotFound from './pages/NotFound';
import RecursiveDefinitions from './pages/RecursiveDefinitions';

const App = () => (
  <AppLayout>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/wff-truthtable" element={<WFFSolverPage />} />
        <Route path="/propositional-logic" element={<PropositionalLogic />} />
        <Route path="/report-form" element={<ReportForm />} />
        <Route path="/recursive-definitions" element={<RecursiveDefinitions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </AppLayout>
);

export default App;