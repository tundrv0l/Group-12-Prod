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
          { label: "Basic Set Functions", path: "/basic-set-functions" },
          { label: "Power Set", path: "/power-set" },
          { label: "Set Complement", path: "/set-complement" },
          { label: "Binary/Unary Operators", path: "/binary-unary-operators" },
          { label: "Cartesian Products", path: "/cartesian-products" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="4.4: Permutations and Combinations">
        <AccordionPanelContent content={[
          { label: "Compositions of Permutations", path: "/compositions" },
        ]} />
      </AccordionPanel>
      <AccordionPanel label="5.1: Relations">
        <AccordionPanelContent content={[
          { label: "Property Of Relations", path: "/properties-of-relations" },
          { label: "Closure Axioms", path: "/closure-axioms" },
          { label: "Equivalence Relations", path: "/equivalence-relations" },
          { label: "Partial Orderings", path: "/partial-orderings" },
          { label: "Hasse Diagram", path: "/hasse-diagram" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="5.2: Topological Sorting">
        <AccordionPanelContent content={[
          { label: "Critical Path", path: "/critical-path" },
          { label: "PERT Diagrams", path: "/pert-diagrams" },
          { label: "Topological Sorting", path: "/topological-sorting" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="5.4: Functions">
        <AccordionPanelContent content={[
          { label: "Permutations Of A Cycle", path: "permutations-cycle" },
          { label: "Permutations Expressed As Disjoint Cycles", path: "/disjoint-cycles" }
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
          { label: "Boolean Matrices", path: "/boolean-matrices" }]} />
      </AccordionPanel>
      <AccordionPanel label="6.1: Graphs and Their Representations">
        <AccordionPanelContent content={[
          { label: "Graphs", path: "/graphs" },
          { label: "Adjacency Matrixes & Adjacency Lists", path: "/adjacency-matrices-lists" },
          { label: "Weighted Graph Representations", path: "/weighted-graphs" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="6.2: Trees and Their Representations">
        <AccordionPanelContent content={[
          { label: "Binary Trees and Their Properties", path: "/binary-trees" },
          { label: "Array To Tree", path: "/array-to-tree" },
          { label: "Tree To Array", path: "/tree-to-array" },
          { label: "Prefix, Postfix, In-Fix Notation", path: "/tree-notation" }
        ]} />
      </AccordionPanel>
      <AccordionPanel label="7.1: Directed Graphs, Binary Relations and Warshall's Algorithm">
        <AccordionPanelContent content={[{ label: "Warshall's Algorithm", path: "/warshalls-algorithm" }]} />
      </AccordionPanel>
    </Accordion>
  </Sidebar>
);

export default SidebarMenu;