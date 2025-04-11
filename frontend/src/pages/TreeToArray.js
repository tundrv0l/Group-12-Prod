import React, { useState } from 'react';
import { Box, Text, TextInput, Button, Select, Tab, Tabs, Collapsible } from 'grommet';
import { solveTreeToArray } from '../api';
import { CircleInformation } from 'grommet-icons';
import SolverPage from '../components/SolverPage';
import { useDiagnostics } from '../hooks/useDiagnostics';
import TreeToArrayOutput from '../components/TreeToArrayOutput';

/*
* Name: TreeToArray.js
* Author: Parker Clark
* Description: Solver page for converting binary tree to array.
*/

const TreeToArray = () => {

  const [input, setInput] = React.useState('');
  const [treeType, setTreeType] = React.useState('regular');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [treeData, setTreeData] = React.useState(null);

  const { trackResults } = useDiagnostics("TREE_TO_ARRAY");

  const SAMPLE_REGULAR_TREE = "A B C D E None F";
  const SAMPLE_MATH_EXPRESSION = "3*(x+4)";

  const fillWithSample = () => {
    setInput(treeType === 'regular' ? SAMPLE_REGULAR_TREE : SAMPLE_MATH_EXPRESSION);
  };
  
  const TreeInputWithHelp = () => {
    const [showHelp, setShowHelp] = useState(false);
    
    return (
      <Box>
        <Box direction="row" align="start" justify="start" margin={{ bottom: 'small' }} style={{ marginLeft: '-8px', marginTop: '-8px' }}>
          <Button icon={<CircleInformation />} onClick={() => setShowHelp(!showHelp)} plain />
        </Box>
        
        <Collapsible open={showHelp}>
          <Box pad="small" background="light-2" round="small" margin={{ bottom: "medium" }} width="large">
            <Text weight="bold" margin={{ bottom: "xsmall" }}>
              Tree Input Format:
            </Text>
            {treeType === 'regular' ? (
              <>
                <Text>
                  Enter nodes in level-order traversal (breadth-first).
                </Text>
                <Text>
                  Each node should be a single character. Use 'None' for empty nodes.
                </Text>
                <Text>
                  Example: <strong>A B C D E None F</strong>
                </Text>
                <Text margin={{ top: "xsmall" }}>
                  This creates a tree with A as root, B and C as children of A, D and E as children of B, and F as the right child of C.
                </Text>
              </>
            ) : (
              <>
              <Text>
                  Enter a mathematical expression using operators and values.
                </Text>
                <Text>
                  Supported operators: +, -, *, /, ^ (exponentiation)
                </Text>
                <Text>
                  Example: <strong>3*(x+4)</strong>
                </Text>
                <Text margin={{ top: "xsmall" }}>
                  This generates an expression tree representing the mathematical formula.
                </Text>
              </>
            )}
            
            <Box margin={{ top: 'medium' }} align="center">
              <Button 
                label="Fill with Sample" 
                onClick={fillWithSample} 
                primary 
                size="small"
                border={{ color: 'black', size: '2px' }}
                pad={{ vertical: 'xsmall', horizontal: 'small' }}
              />
            </Box>
          </Box>
        </Collapsible>

        <Box margin={{ bottom: 'small' }}>
          <Text margin={{ bottom: 'xsmall' }}>Select Tree Type:</Text>
          <Select
            options={[
              { label: 'Regular Binary Tree (Level Order)', value: 'regular' },
              { label: 'Mathematical Expression', value: 'mathematical' }
            ]}
            value={treeType}
            labelKey="label"
            valueKey="value"
            onChange={({ value }) => setTreeType(value.value)}
          />
        </Box>
        
        <TextInput 
          placeholder={getPlaceholder()}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </Box>
    );
  };

  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');
    setTreeData(null); // Clear previous tree data
  
    // Validate the input first
    const validation = validateInput(input, treeType);
    if (!validation.isValid) {
      setError(validation.error);
      setLoading(false);
      return;
    }
  
    // Determine the choice value based on tree type
    const choice = treeType === 'regular' ? 1 : 2;
  
    // Start timing for performance tracking
    const startTime = performance.now();
  
    try {
      // Call the API
      const response = await solveTreeToArray(input, choice);
      
      // Parse JSON if it's a string
      let result;
      try {
        result = typeof response === 'string' ? JSON.parse(response) : response;
      } catch (e) {
        setError('Invalid response format from server');
        return;
      }
  
      // Check for success flag or error in the result
      if (!result.success) {
        const errorMessage = result.error || 'An unknown error occurred';
        
        // Track failed execution
        trackResults(
          { input, treeType },
          { error: errorMessage },
          performance.now() - startTime
        );
  
        setError(errorMessage);
        return;
      }
  
      // Success path - track results
      trackResults(
        { input, treeType },
        { success: true, type: result.type },
        performance.now() - startTime
      );
  
      // Store the image and full data for the visualizer
      setOutput(result.image);
      setTreeData(result);
      
    } catch (err) {
      console.error("Error in tree-to-array solver:", err);
      
      // Track exception
      trackResults(
        { input, treeType },
        { error: err.message || 'Unknown error' },
        performance.now() - startTime
      );
  
      setError('An error occurred while generating the array representation.');
    } finally {
      setLoading(false);
    }
  };

  // Get placeholder text based on tree type
  const getPlaceholder = () => {
    if (treeType === 'regular') {
      return "Example: A B C D E None (space separated nodes in level order)";
    } else {
      return "Example: 2+(3+5-7) (mathematical expression)";
    }
  };

  // Update the renderOutput function
  const renderOutput = () => {
    if (!output && !treeData) {
      return <Text>Output will be displayed here!</Text>;
    }

    return (
      <Tabs>
        {/* Tree Visualization Tab */}
        <Tab title="Tree Visualization">
          <Box pad="small">
            {output && (
              <Box>
                <Text weight="bold" margin={{ bottom: 'small' }}>Tree Structure:</Text>
                <Box background="white" pad="small" round="small">
                  <img 
                    src={`data:image/png;base64,${output}`} 
                    alt="Tree structure visualization" 
                    style={{ maxWidth: '100%', height: 'auto' }} 
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Tab>

        {/* Pointer Diagram Tab */}
        <Tab title="Memory Representation">
          <Box pad="small">
            {treeData && treeData.pointerDiagram && (
              <Box>
                <Text weight="bold" margin={{ bottom: 'small' }}>
                  Pointer Memory Representation:
                </Text>
                <Box background="white" pad="small" round="small">
                  <img 
                    src={`data:image/png;base64,${treeData.pointerDiagram}`} 
                    alt="Pointer memory representation" 
                    style={{ maxWidth: '100%', height: 'auto' }} 
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Tab>

        {/* Array Representation Tab */}
        <Tab title="Array Representation">
          <Box pad="small">
            {treeData && treeData.childArray && (
              <Box>
                <Box background="white" pad="small" round="small">
                  <TreeToArrayOutput
                    childArray={treeData.childArray}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Tab>
      </Tabs>
    );
  };

  // Validate the input based on the tree type
  const validateInput = (input, treeType) => {
    if (!input || input.trim() === '') {
      return { isValid: false, error: 'Input cannot be empty.' };
    }

    if (treeType === 'regular') {
      // Existing validation for regular binary tree level representation
      const nodes = input.split(/\s+/);
      
      // Check if we have at least a root
      if (nodes.length === 0) {
        return { isValid: false, error: 'Tree must have at least a root node.' };
      }

      // Check for invalid node values (allowing single letters, numbers, or 'None')
      const invalidNodes = nodes.filter(node => 
        node !== 'None' && !(/^[A-Za-z0-9]$/.test(node)) 
      );
      
      if (invalidNodes.length > 0) {
        return { 
          isValid: false, 
          error: `Invalid node value(s): ${invalidNodes.join(', ')}. Use single letters, numbers, or 'None'.` 
        };
      }

      // Check for duplicate nodes (excluding 'None')
      const uniqueNodes = new Set();
      const duplicates = [];
      
      for (const node of nodes) {
        if (node !== 'None') {
          if (uniqueNodes.has(node)) {
            duplicates.push(node);
          } else {
            uniqueNodes.add(node);
          }
        }
      }
      
      if (duplicates.length > 0) {
        return { 
          isValid: false, 
          error: `Duplicate node value(s): ${duplicates.join(', ')}. Each node must be unique.` 
        };
      }

      return { isValid: true };
      
    } else if (treeType === 'mathematical') {
      // Enhanced validation for mathematical expression
      
      // Check if it contains the "None" keyword which would indicate a level-order input
      if (input.includes('None')) {
        return { 
          isValid: false, 
          error: 'Your input appears to be a level-order tree format. Please select "Regular Binary Tree" option instead.' 
        };
      }
      
      // Check if it looks like space-separated single characters (typical of level-order format)
      const tokens = input.split(/\s+/);
      if (tokens.length > 2 && tokens.every(token => token.length === 1 && /^[A-Za-z0-9]$/.test(token))) {
        return { 
          isValid: false, 
          error: 'Your input appears to be single characters separated by spaces. For math expressions, use operators like +, -, *, / between values.' 
        };
      }
      
      // Check that it contains at least one operator for a valid expression
      if (!/[+\-*/^]/.test(input)) {
        return { 
          isValid: false, 
          error: 'Mathematical expression must contain at least one operator (+, -, *, /, ^).' 
        };
      }
      
      // Basic validation for mathematical expression characters
      if (!/^[0-9a-zA-Z+\-*/()^. ]+$/.test(input)) {
        return { 
          isValid: false, 
          error: 'Expression can only contain numbers, operators (+, -, *, /, ^), and parentheses.' 
        };
      }
      
      // Check for balanced parentheses
      let parenCount = 0;
      for (let char of input) {
        if (char === '(') parenCount++;
        else if (char === ')') parenCount--;
        
        if (parenCount < 0) {
          return { isValid: false, error: 'Unbalanced parentheses in expression.' };
        }
      }
      
      if (parenCount !== 0) {
        return { isValid: false, error: 'Unbalanced parentheses in expression.' };
      }
      
      return { isValid: true };
    }
    
    return { isValid: false, error: 'Invalid tree type.' };
  };

  return (
    <SolverPage
      title="Tree to Array Representations"
      topic="Trees And Their Representations"
      description="This tool helps you convert binary trees to their array representations."
      paragraphs={[
        "While binary trees are often visualized with nodes and connecting lines, they can also be represented using arrays. Array representations provide efficient storage and access methods for tree structures and are fundamental in many computational applications.",
        "There are two common array representations for binary trees: Left Child-Right Child Representation and Pointer Memory Representation. The first uses a table with three columns for each node (Node Value, Left Child, Right Child), while the second visualizes how trees are stored in memory using pointers.",
        "Array representations have practical advantages in certain algorithms and memory-constrained environments. They can simplify tree operations, provide constant-time access to nodes, and reduce the overhead of storing explicit pointer data structures.",
        "Enter your binary tree below to generate both the visual tree and its equivalent array representations!"
      ]}
      InputComponent={TreeInputWithHelp}
      input_props={null}  // We're accessing state directly in the component
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      render_output={renderOutput}
    />
  );
};

export default TreeToArray;