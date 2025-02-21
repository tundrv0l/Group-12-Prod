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
import PartialOrderings from './pages/PartialOrderings';
import HasseDiagram from './pages/HasseDiagram';
import CriticalPaths from './pages/CriticalPaths';
import PERTDiagrams from './pages/PERTDiagrams';
import TopologicalSorting from './pages/TopologicalSorting';
import PermutationsOfACycle from './pages/PermutationsOfACycle';
import CompositionOfPermutations from './pages/CompositionsOfPermutations';
import DisjointCycles from './pages/DisjointCycles';
import OrderOfMagnitude from './pages/OrderOfMagnitude';
import MasterTheorem from './pages/MasterTheorem';

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
        <Route path="/partial-orderings" element={<PartialOrderings />} />
        <Route path="/hasse-diagram" element={<HasseDiagram />} />
        <Route path="/critical-path" element={<CriticalPaths />} />
        <Route path="/pert-diagrams" element={<PERTDiagrams />} />
        <Route path="/topological-sorting" element={<TopologicalSorting />} />
        <Route path="/permutations-cycle" element={<PermutationsOfACycle />} />
        <Route path="/compositions" element={<CompositionOfPermutations />} />
        <Route path="/disjoint-cycles" element={<DisjointCycles />} />
        <Route path="/order-of-magnitude" element={<OrderOfMagnitude />} />
        <Route path="/master-theorem" element={<MasterTheorem />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </AppLayout>
);

export default App;