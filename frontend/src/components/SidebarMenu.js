import React from 'react';
import { Sidebar, Accordion, AccordionPanel } from 'grommet';
import AccordionPanelContent from './AccordionPanelContent';

/*
* Name: SidebarMenu.js
* Author: Parker Clark
* Description: Defines the SidebarMenu component for the main
*/

const SidebarMenu = () => (
  <Sidebar align="start" direction="row" flex={false} gap="large" pad="small" justify="start">
    <Accordion>
      <AccordionPanel label="1.1: Statements and Tautologies">
        <AccordionPanelContent content={[{ label: "Well-Formed Formula (wff) to Truth Table", path: "/wff-truthtable" }]} />
      </AccordionPanel>
      <AccordionPanel label="1.2: Propositional Logic">
        <AccordionPanelContent content={[{ label: "Propositional Logic Validator", path: "/propositional-logic" }]} />
      </AccordionPanel>
      <AccordionPanel label="3.1: Recursive Definitions">
        <AccordionPanelContent content={[{ label: "Recursive Definition Solver", path: "/recursive-definitions" }]} />
      </AccordionPanel>
      <AccordionPanel label="4.1: Sets">
        <AccordionPanelContent content={[
          { label: "Basic Set Functions", path: "/sets/basic-functions" },
          { label: "Power Set", path: "/sets/power-set" },
          { label: "Set Complement", path: "/sets/set-complement" },
          { label: "Binary/Unary Operators", path: "/sets/binary-unary-operators" },
          { label: "Cartesian Products", path: "/sets/cartesian-products" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="5.1: Relations">
        <AccordionPanelContent content={[
          { label: "Property Of Relations", path: "/relations/property" },
          { label: "Closure Axioms", path: "/relations/closure-axioms" },
          { label: "Equivalence Relations", path: "/relations/equivalence" },
          { label: "Partial Orderings", path: "/relations/partial-orderings" },
          { label: "Hasse Diagram", path: "/relations/hasse-diagram" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="5.2: Topological Sorting">
        <AccordionPanelContent content={[
          { label: "Critical Path", path: "/topological-sorting/critical-path" },
          { label: "PERT Diagrams", path: "/topological-sorting/pert-diagrams" },
          { label: "Topological Sorting", path: "/topological-sorting/solver" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="5.4: Functions">
        <AccordionPanelContent content={[
          { label: "Permutations Of A Cycle", path: "/functions/permutations-cycle" },
          { label: "Compositions of Permutations", path: "/functions/compositions" },
          { label: "Permutations expressed as Disjoint Cycles", path: "/functions/disjoint-cycles" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="5.5: Order of Magnitude">
        <AccordionPanelContent content={[
          { label: "Order of Magnitude", path: "/order-of-magnitude" },
          { label: "The Master Theorem", path: "/master-theorem" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="5.7: Matrices">
        <AccordionPanelContent content={[
          { label: "Boolean Matrices", path: "/matrices/boolean" },
          { label: "Boolean Matrice Operations (Meet, Join, Product)", path: "/matrices/operations" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="6.1: Graphs and Their Representations">
        <AccordionPanelContent content={[
          { label: "Graphs", path: "/graphs" },
          { label: "Adjacency Matrixes & Adjacency Lists", path: "/graphs/adjacency" },
          { label: "Weighted Graph Representations", path: "/graphs/weighted" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="6.2: Trees and Their Representations">
        <AccordionPanelContent content={[
          { label: "Binary Trees and their Properties", path: "/trees/binary" },
          { label: "Array To Tree", path: "/trees/array-to-tree" },
          { label: "Tree To Array", path: "/trees/tree-to-array" },
          { label: "Prefix, Postfix, In-Fix Notation", path: "/trees/notation" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="7.1: Directed Graphs, Binary Relations and Warshall's Algorithm">
        <AccordionPanelContent content={[{ label: "Warshall's Algorithm", path: "/warshalls-algorithm" }]} />
      </AccordionPanel>
    </Accordion>
  </Sidebar>
);

export default SidebarMenu;