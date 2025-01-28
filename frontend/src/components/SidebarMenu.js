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
        <AccordionPanelContent content={["Well-Formed Formula (wff) to Truth Table"]} />
      </AccordionPanel>
      <AccordionPanel label="1.2: Propositional Logic">
        <AccordionPanelContent content={["Propositional Logic Validator"]} />
      </AccordionPanel>
      <AccordionPanel label="3.1: Recursive Definitions">
        <AccordionPanelContent content={["Recursive Definition Solver"]} />
      </AccordionPanel>
      <AccordionPanel label="4.1: Sets">
        <AccordionPanelContent content={["Basic Set Functions", "Power Set", "Set Complement", "Binary/Unary Operators", "Cartesian Products"]} />
      </AccordionPanel>
      <AccordionPanel label="5.1: Relations">
        <AccordionPanelContent content={["Property Of Relations", "Closure Axioms", "Equivalence Relations", "Partial Orderings", "Hasse Diagram"]} />
      </AccordionPanel>
      <AccordionPanel label="5.2: Topological Sorting">
        <AccordionPanelContent content={["Critical Path", "PERT Diagrams", "Topological Sorting"]} />
      </AccordionPanel>
      <AccordionPanel label="5.4: Functions">
        <AccordionPanelContent content={["Permutations Of A Cycle", "Compositions of Permutations", "Permutations expressed as Disjoint Cycles"]} />
      </AccordionPanel>
      <AccordionPanel label="5.5: Order of Magnitude">
        <AccordionPanelContent content={["Order of Magnitude", "The Master Theorem"]} />
      </AccordionPanel>
      <AccordionPanel label="5.7: Matrices">
        <AccordionPanelContent content={["Boolean Matrices", "Boolean Matrice Operations (Meet, Join, Product)"]} />
      </AccordionPanel>
      <AccordionPanel label="6.1: Graphs and Their Representations">
        <AccordionPanelContent content={["Graphs", "Adjacency Matrixes & Adjacency Lists", "Weighted Graph Representations"]} />
      </AccordionPanel>
      <AccordionPanel label="6.2: Trees and Their Representations">
        <AccordionPanelContent content={["Binary Trees and their Properties", "Array To Tree", "Tree To Array", "Prefix, Postfix, In-Fix Notation"]} />
      </AccordionPanel>
      <AccordionPanel label="7.1: Directed Graphs, Binary Relations and Warshall's Algorithm">
        <AccordionPanelContent content={["Warshall's Algorithm"]} />
      </AccordionPanel>
    </Accordion>
  </Sidebar>
);

export default SidebarMenu;