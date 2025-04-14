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
import RelationProperties from './pages/RelationProperties';
import Partitions from './pages/Partitions';
import PERTDiagrams from './pages/PERTDiagrams';
import PermutationsOfACycle from './pages/PermutationsOfACycle';
import CompositionOfPermutations from './pages/CompositionsOfPermutations';
import DisjointCycles from './pages/DisjointCycles';
import OrderOfMagnitude from './pages/OrderOfMagnitude';
import MasterTheorem from './pages/MasterTheorem';
import BooleanMatrices from './pages/BooleanMatrices';
import GraphsPage from './pages/GraphsPage';
import AdjacencyMatricesLists from './pages/AdjacencyMatricesLists';
import WeightedGraphRepresentations from './pages/WeightedGraphRepresentations';
import BinaryTrees from './pages/BinaryTrees';
import ArrayToTree from './pages/ArrayToTree';
import TreeToArray from './pages/TreeToArray';
import TreeNotation from './pages/TreeNotation';
import WarshallsAlgorithm from './pages/WarshallsAlgorithm';


const App = () => (

  <Router>
    <AppLayout>
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
        <Route path="/properties-of-relations" element={<RelationProperties />} />
        <Route path="/partitions" element={<Partitions />} />
        <Route path="/pert-diagrams" element={<PERTDiagrams />} />
        <Route path="/permutations-cycle" element={<PermutationsOfACycle />} />
        <Route path="/compositions-of-permutations" element={<CompositionOfPermutations />} />
        <Route path="/compositions" element={<CompositionOfPermutations />} />
        <Route path="/disjoint-cycles" element={<DisjointCycles />} />
        <Route path="/order-of-magnitude" element={<OrderOfMagnitude />} />
        <Route path="/master-theorem" element={<MasterTheorem />} />
        <Route path="/boolean-matrices" element={<BooleanMatrices />} />
        <Route path="/graphs" element={<GraphsPage />} />
        <Route path="/adjacency-matrices-lists" element={<AdjacencyMatricesLists />} />
        <Route path="/weighted-graphs" element={<WeightedGraphRepresentations />} />
        <Route path="/binary-trees" element={<BinaryTrees />} />
        <Route path="/array-to-tree" element={<ArrayToTree />} />
        <Route path="/tree-to-array" element={<TreeToArray />} />
        <Route path="/tree-notation" element={<TreeNotation />} />
        <Route path="/warshalls-algorithm" element={<WarshallsAlgorithm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  </Router>
 
);

export default App;
