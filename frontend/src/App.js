import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import WFFSolverPage from './pages/WFFSolverPage';
import PropositionalLogic from './pages/PropositionalLogicSolver';
import ReportForm from './pages/ReportForm';
import AppLayout from './components/AppLayout';
import NotFound from './pages/NotFound';
import RecursiveDefinitions from './pages/RecursiveDefinitions';
import BasicSetFunctions from './pages/BasicSetFunctions';
import PowerSets from './pages/PowerSets';
import SetComplement from './pages/SetComplement';
import BinaryUnaryOperators from './pages/BinaryUnaryOperators';
import CartesianProducts from './pages/CartesianProducts';
import RelationProperties from './pages/RelationProperties';
import ClosureAxioms from './pages/ClosureAxioms';
import EquivalenceRelations from './pages/EquivalenceRelations';

const App = () => (
  <AppLayout>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/wff-truthtable" element={<WFFSolverPage />} />
        <Route path="/propositional-logic" element={<PropositionalLogic />} />
        <Route path="/report-form" element={<ReportForm />} />
        <Route path="/recursive-definitions" element={<RecursiveDefinitions />} />
        <Route path="/basic-set-functions" element={<BasicSetFunctions />} />
        <Route path="/power-set" element={<PowerSets />} />
        <Route path="/set-complement" element={<SetComplement />} />
        <Route path="/binary-unary-operators" element={<BinaryUnaryOperators />} />
        <Route path="/cartesian-products" element={<CartesianProducts />} />
        <Route path="/properties-of-relations" element={<RelationProperties />} />
        <Route path="/closure-axioms" element={<ClosureAxioms />} />
        <Route path="/equivalence-relations" element={<EquivalenceRelations />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </AppLayout>
);

export default App;