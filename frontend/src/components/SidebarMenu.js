import React from 'react';
import { Sidebar, Accordion, AccordionPanel, ResponsiveContext, Box, Text } from 'grommet';
import { FormDown, FormNext } from 'grommet-icons';
import AccordionPanelContent from './AccordionPanelContent';

/*
* Name: SidebarMenu.js
* Author: Parker Clark
* Description: Defines the SidebarMenu component for the main
*/

// Simple separator component
const Separator = () => (
  <Box
    height="1px"  // Keep this exactly 1px
    background="light-5"
    margin={{ vertical: "small" }}  // Increased from xsmall for better spacing
    style={{
      width: '100%',
      borderBottom: 'none',  // Ensure no extra borders
      boxShadow: 'none',     // No shadow effects
      padding: 0,            // No padding
      overflow: 'hidden'     // Prevent any overflow issues
    }}
  />
);
// Fixed CustomAccordionPanel to use AccordionPanel from grommet
const CustomAccordionPanel = ({ label, children }) => (
  <AccordionPanel
    header={({ active }) => (
      <Box 
        direction="row" 
        align="center" 
        justify="between"
        background={active ? 'light-2' : 'white'}
        pad={{ vertical: 'small', horizontal: 'medium' }}
        style={{ 
          borderRadius: '4px',
          fontWeight: 600,
          transition: 'all 0.2s',
          outline: 'none'
        }}
        focusIndicator={false}
      >
        <Text>{label}</Text>
        {active ? <FormDown /> : <FormNext />}
      </Box>
    )}
  >
    {children}
  </AccordionPanel>
);

const SidebarMenu = () => (
  <ResponsiveContext.Consumer>
    {(size) => (
      <Sidebar 
        align="start" 
        direction="row" 
        flex={false} 
        pad={size === 'small' ? 'xsmall' : 'small'}
        justify="start"
        style={{ 
          maxWidth: '100%', 
          overflowX: 'hidden'
        }}
      >
        <Accordion 
          animate={true} 
          multiple={false} 
          style={{ 
            width: '100%',
            fontSize: size === 'small' ? '14px' : '16px'
          }}
        >
          <CustomAccordionPanel label="1.1: Statements and Tautologies">
            <AccordionPanelContent 
              content={[{ label: "Well-Formed Formula (wff) to Truth Table", path: "/wff-truthtable" }]} 
              size={size}
            />
          </CustomAccordionPanel>
          
          <Separator />
          
          <CustomAccordionPanel label="1.2: Propositional Logic">
            <AccordionPanelContent 
              content={[{ label: "Propositional Logic Validator", path: "/propositional-logic" }]} 
              size={size}
            />
          </CustomAccordionPanel>
          
          <Separator />
          
          <CustomAccordionPanel label="3.1: Recursive Definitions">
            <AccordionPanelContent 
              content={[{ label: "Recursive Definition Solver", path: "/recursive-definitions" }]} 
              size={size}
            />
          </CustomAccordionPanel>
          
          <Separator />
          
          <CustomAccordionPanel label="4.1: Sets">
            <AccordionPanelContent 
              content={[
                { label: "Basic Set Functions", path: "/basic-set-functions" },
                { label: "Power Set", path: "/power-set" },
                { label: "Set Complement", path: "/set-complement" },
                { label: "Binary/Unary Operators", path: "/binary-unary-operators" },
                { label: "Cartesian Products", path: "/cartesian-products" }
              ]} 
              size={size}
            />
          </CustomAccordionPanel>
          
          <Separator />
          
          <CustomAccordionPanel label="5.1: Relations">
            <AccordionPanelContent 
              content={[
                { label: "Property Of Relations", path: "/properties-of-relations" },
                { label: "Closure Axioms", path: "/closure-axioms" },
                { label: "Equivalence Relations", path: "/equivalence-relations" },
                { label: "Partial Orderings", path: "/partial-orderings" },
                { label: "Hasse Diagram", path: "/hasse-diagram" }
              ]} 
              size={size}
            />
          </CustomAccordionPanel>
          
          <Separator />
          
          <CustomAccordionPanel label="5.2: Topological Sorting">
            <AccordionPanelContent 
              content={[
                { label: "Critical Path", path: "/critical-path" },
                { label: "PERT Diagrams", path: "/pert-diagrams" },
                { label: "Topological Sorting", path: "/topological-sorting" }
              ]} 
              size={size}
            />
          </CustomAccordionPanel>
          
          <Separator />
          
          <CustomAccordionPanel label="5.4: Functions">
            <AccordionPanelContent 
              content={[
                { label: "Permutations Of A Cycle", path: "/permutations-cycle" },
                { label: "Compositions of Permutations", path: "/compositions" },
                { label: "Permutations Expressed As Disjoint Cycles", path: "/disjoint-cycles" }
              ]} 
              size={size}
            />
          </CustomAccordionPanel>
          
          <Separator />
          
          <CustomAccordionPanel label="5.5: Order of Magnitude">
            <AccordionPanelContent 
              content={[
                { label: "Order of Magnitude", path: "/order-of-magnitude" },
                { label: "The Master Theorem", path: "/master-theorem" }
              ]} 
              size={size}
            />
          </CustomAccordionPanel>
          
          <Separator />
          
          <CustomAccordionPanel label="5.7: Matrices">
            <AccordionPanelContent 
              content={[
                { label: "Boolean Matrices", path: "/boolean-matrices" }
              ]} 
              size={size}
            />
          </CustomAccordionPanel>
          
          <Separator />
          
          <CustomAccordionPanel label="6.1: Graphs and Their Representations">
            <AccordionPanelContent 
              content={[
                { label: "Graphs", path: "/graphs" },
                { label: "Adjacency Matrixes & Adjacency Lists", path: "/adjacency-matrices-lists" },
                { label: "Weighted Graph Representations", path: "/weighted-graphs" }
              ]} 
              size={size}
            />
          </CustomAccordionPanel>
          
          <Separator />
          
          <CustomAccordionPanel label="6.2: Trees and Their Representations">
            <AccordionPanelContent 
              content={[
                { label: "Binary Trees and Their Properties", path: "/binary-trees" },
                { label: "Array To Tree", path: "/array-to-tree" },
                { label: "Tree To Array", path: "/tree-to-array" },
                { label: "Prefix, Postfix, In-Fix Notation", path: "/tree-notation" }
              ]} 
              size={size}
            />
          </CustomAccordionPanel>
          
          <Separator />
          
          <CustomAccordionPanel label="7.1: Directed Graphs, Binary Relations and Warshall's Algorithm">
            <AccordionPanelContent 
              content={[
                { label: "Warshall's Algorithm", path: "/warshalls-algorithm" }
              ]} 
              size={size}
            />
          </CustomAccordionPanel>
        </Accordion>
      </Sidebar>
    )}
  </ResponsiveContext.Consumer>
);

export default SidebarMenu;