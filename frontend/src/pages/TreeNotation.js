import React, { useState } from 'react';
import { Box, Text, TextInput, Button, Select, Tab, Tabs, TextArea, Image, Spinner } from 'grommet';
import { solveTreeNotation } from '../api';
import SolverPage from '../components/SolverPage';
import { useDiagnostics } from '../hooks/useDiagnostics';

/*
* Name: TreeNotation.js
* Author: Parker Clark
* Description: Comprehensive solver page for tree notation operations.
*/

const TreeNotation = () => {
  // Operation selection state
  const [operationType, setOperationType] = useState('build_tree');
  const [inputFormat, setInputFormat] = useState('level');
  const [traversalType, setTraversalType] = useState('preorder_inorder');
  
  // Input state
  const [primaryInput, setPrimaryInput] = useState('');
  const [secondaryInput, setSecondaryInput] = useState('');
  
  // Result state
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { trackResults } = useDiagnostics("TREE_NOTATION");

  // Sample data for different input types
  const SAMPLE_LEVEL_ORDER = "A B C D E None F";
  const SAMPLE_TABLE = "A B C\nB D E\nC F 0\nD 0 0\nE 0 0\nF 0 0";
  const SAMPLE_MATH_EXPR = "3*(x+4)";
  const SAMPLE_PREORDER = "A B D E C F";
  const SAMPLE_POSTORDER = "D E B F C A";
  const SAMPLE_INORDER = "D B E A C F";

  const fillWithSample = () => {
    if (operationType === 'build_tree') {
      switch (inputFormat) {
        case 'level':
          setPrimaryInput(SAMPLE_LEVEL_ORDER);
          break;
        case 'table':
          setPrimaryInput(SAMPLE_TABLE);
          break;
        case 'math':
          setPrimaryInput(SAMPLE_MATH_EXPR);
          break;
        default:
          break;
      }
    } else { // reconstruct_tree
      if (traversalType === 'preorder_inorder') {
        setPrimaryInput(SAMPLE_PREORDER);
        setSecondaryInput(SAMPLE_INORDER);
      } else { // postorder_inorder
        setPrimaryInput(SAMPLE_POSTORDER);
        setSecondaryInput(SAMPLE_INORDER);
      }
    }
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Tree Notation Help:
        </Text>
        {operationType === 'build_tree' ? (
          <>
            {inputFormat === 'level' && (
              <>
                <Text>
                  Enter nodes in level-order traversal (breadth-first). Separate nodes with spaces.
                  Use 'None' for empty nodes.
                </Text>
                <Text margin={{ top: "xsmall" }}>
                  Example: <strong>A B C D E None F</strong>
                </Text>
              </>
            )}
            {inputFormat === 'table' && (
              <>
                <Text>
                  Enter one node per line in the format: "node leftChild rightChild".
                  Use '0' to indicate no child.
                </Text>
                <Text margin={{ top: "xsmall" }}>
                  Example:<br/>
                  <pre style={{ background: '#f8f8f8', padding: '8px', borderRadius: '4px' }}>
                    A B C<br/>
                    B D E<br/>
                    C F 0<br/>
                    D 0 0<br/>
                    E 0 0<br/>
                    F 0 0
                  </pre>
                </Text>
              </>
            )}
            {inputFormat === 'math' && (
              <>
                <Text>
                  Enter a mathematical expression with operators (+, -, *, /, ^) and parentheses.
                </Text>
                <Text margin={{ top: "xsmall" }}>
                  Example: <strong>3*(x+4)</strong> or <strong>a+b*c</strong>
                </Text>
              </>
            )}
          </>
        ) : (
          <>
            <Text>
              Enter traversal values separated by spaces. Each node must appear in both traversals.
            </Text>
            <Box 
              margin={{ vertical: 'small' }} 
              pad="xsmall" 
              background="light-3" 
              round="xsmall"
            >
              <Text size="small" weight="bold" margin={{ bottom: 'xsmall' }}>Example Tree:</Text>
              <Text size="small">Tree in parentheses format: A(B(D,E),C(,F))</Text>
              <Text size="small" margin={{ top: 'xsmall' }}>Where each node is written as Node(LeftChild,RightChild)</Text>
            </Box>
            <Text>
              <Text weight="bold">Example traversals:</Text><br/>
              Preorder: A B D E C F<br/>
              Inorder: D B E A C F<br/>
              Postorder: D E B F C A
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
      </>
    );
  };

  const Input = () => {
    return (
      <Box>
        <Box margin={{ bottom: 'medium' }}>
          <Text margin={{ bottom: 'xsmall' }}>Select Operation:</Text>
          <Select
            options={[
              { label: 'Build Tree from Input', value: 'build_tree' },
              { label: 'Reconstruct Tree from Traversals', value: 'reconstruct_tree' }
            ]}
            value={operationType}
            labelKey="label"
            valueKey="value"
            onChange={({ value }) => {
              setOperationType(value.value);
              setPrimaryInput('');
              setSecondaryInput('');
              setResult(null);
            }}
          />
        </Box>

        {/* Conditional rendering based on operation type */}
        {operationType === 'build_tree' ? (
          <Box gap="small">
            <Box margin={{ bottom: 'small' }}>
              <Text margin={{ bottom: 'xsmall' }}>Input Format:</Text>
              <Select
                options={[
                  { label: 'Level-Order Traversal', value: 'level' },
                  { label: 'Left-Child Right-Child Table', value: 'table' },
                  { label: 'Mathematical Expression', value: 'math' }
                ]}
                value={inputFormat}
                labelKey="label"
                valueKey="value"
                onChange={({ value }) => {
                  setInputFormat(value.value);
                  setPrimaryInput('');
                }}
              />
            </Box>

            <Box>
              <Text margin={{ bottom: 'xsmall' }}>
                Enter {inputFormat === 'level' ? 'Level-Order Input' : 
                         inputFormat === 'table' ? 'Tree Table' : 'Mathematical Expression'}:
              </Text>
              {inputFormat === 'table' ? (
                <TextArea
                  placeholder={getPlaceholder()}
                  value={primaryInput}
                  onChange={(event) => setPrimaryInput(event.target.value)}
                  rows={6}
                />
              ) : (
                <TextInput 
                  placeholder={getPlaceholder()}
                  value={primaryInput}
                  onChange={(event) => setPrimaryInput(event.target.value)}
                />
              )}
            </Box>
          </Box>
        ) : (
          <Box gap="small">
            <Box margin={{ bottom: 'small' }}>
              <Text margin={{ bottom: 'xsmall' }}>Traversal Combination:</Text>
              <Select
                options={[
                  { label: 'Preorder + Inorder', value: 'preorder_inorder' },
                  { label: 'Postorder + Inorder', value: 'postorder_inorder' }
                ]}
                value={traversalType}
                labelKey="label"
                valueKey="value"
                onChange={({ value }) => {
                  setTraversalType(value.value);
                  setPrimaryInput('');
                  setSecondaryInput('');
                }}
              />
            </Box>

            <Box>
              <Text margin={{ bottom: 'xsmall' }}>
                {traversalType === 'preorder_inorder' ? 'Preorder' : 'Postorder'} Traversal:
              </Text>
              <TextInput 
                placeholder={getPlaceholder()}
                value={primaryInput}
                onChange={(event) => setPrimaryInput(event.target.value)}
              />
            </Box>
            
            <Box margin={{ top: 'small' }}>
              <Text margin={{ bottom: 'xsmall' }}>Inorder Traversal:</Text>
              <TextInput 
                placeholder={getSecondaryPlaceholder()}
                value={secondaryInput}
                onChange={(event) => setSecondaryInput(event.target.value)}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  const handleSolve = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    // Validate inputs based on selected operation
    const validation = validateInput();
    if (!validation.isValid) {
      setError(validation.error);
      setLoading(false);
      return;
    }
    
    // Map UI selections to backend operation choices
    let operation;
    if (operationType === 'build_tree') {
      if (inputFormat === 'level') operation = 'build_from_level';
      else if (inputFormat === 'table') operation = 'build_from_table';
      else if (inputFormat === 'math') operation = 'build_from_math';
    } else { // reconstruct_tree
      if (traversalType === 'preorder_inorder') operation = 'reconstruct_from_preorder';
      else operation = 'reconstruct_from_postorder';
    }
    
    const startTime = performance.now();
    
    try {
      // Make API call based on selected operation
      // Convert string operation to number for API compatibility
      const operationMap = {
        'build_from_level': 1,
        'build_from_table': 2,
        'reconstruct_from_preorder': 3,
        'reconstruct_from_postorder': 4,
        'build_from_math': 5
      };
      
      const response = await solveTreeNotation(primaryInput, secondaryInput, operationMap[operation]);
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      
      // Track results
      trackResults(
        { 
          operationType, 
          inputFormat: operationType === 'build_tree' ? inputFormat : traversalType,
          primaryInput,
          secondaryInput: operationType === 'reconstruct_tree' ? secondaryInput : undefined
        },
        data,
        performance.now() - startTime
      );
      
      setResult(data);
    } catch (err) {
      console.error('Error in tree notation solver:', err);
      setError('An error occurred while processing your input.');
      
      // Track exception
      trackResults(
        { 
          operationType, 
          inputFormat: operationType === 'build_tree' ? inputFormat : traversalType,
          primaryInput,
          secondaryInput: operationType === 'reconstruct_tree' ? secondaryInput : undefined
        },
        { error: err.message || 'Unknown error' },
        performance.now() - startTime
      );
    } finally {
      setLoading(false);
    }
  };

  const validateInput = () => {
    // Check for empty inputs
    if (!primaryInput.trim()) {
      return { isValid: false, error: 'Primary input cannot be empty.' };
    }
    
    if (operationType === 'reconstruct_tree' && !secondaryInput.trim()) {
      return { isValid: false, error: 'Both traversal inputs are required for tree reconstruction.' };
    }
    
    // For build tree operations, validate based on input format
    if (operationType === 'build_tree') {
      // Inside validateInput function, find the level-order validation section:

    if (inputFormat === 'level') {
      // Validate level-order input
      const nodes = primaryInput.split(/\s+/);
      
      if (nodes.length === 0) {
        return { isValid: false, error: 'Tree must have at least a root node.' };
      }

      const invalidNodes = nodes.filter(node => 
        node !== 'None' && !(/^[A-Za-z0-9]$/.test(node))  // Changed from + to require exactly one character
      );
      
      if (invalidNodes.length > 0) {
        return { 
          isValid: false, 
          error: `Invalid node value(s): ${invalidNodes.join(', ')}. Each node must be a single character or 'None'.` 
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
      }
      else if (inputFormat === 'table') {
        // Validate table input (from ArrayToTree.js)
        const lines = primaryInput.trim().split('\n');
        const seenNodes = new Set();
        const childNodes = new Set();
      
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          const tokens = line.split(/\s+/);
      
          if (tokens.length !== 3) {
            return { 
              isValid: false, 
              error: `Line ${i + 1}: Each line must have exactly 3 values (node, leftChild, rightChild).` 
            };
          }
      
          const [node, leftChild, rightChild] = tokens;
      
          if (!/^[a-zA-Z0-9]$/.test(node)) {
            return { 
              isValid: false, 
              error: `Line ${i + 1}: Node value "${node}" must be a single alphanumeric character.` 
            };
          }
      
          if (seenNodes.has(node)) {
            return { 
              isValid: false, 
              error: `Line ${i + 1}: Node "${node}" is defined multiple times.` 
            };
          }
          seenNodes.add(node);
      
          if (leftChild !== '0' && !/^[a-zA-Z0-9]$/.test(leftChild)) {
            return { 
              isValid: false, 
              error: `Line ${i + 1}: Left child "${leftChild}" must be a single alphanumeric character or '0'.` 
            };
          }
      
          if (rightChild !== '0' && !/^[a-zA-Z0-9]$/.test(rightChild)) {
            return { 
              isValid: false, 
              error: `Line ${i + 1}: Right child "${rightChild}" must be a single alphanumeric character or '0'.` 
            };
          }

          if (leftChild === node || rightChild === node) {
            return {
              isValid: false,
              error: `Line ${i + 1}: Node "${node}" cannot have itself as a child. This would create a cycle.`
            };
          }
      
          if (leftChild !== '0') childNodes.add(leftChild);
          if (rightChild !== '0') childNodes.add(rightChild);
        }
      
        if (lines.length > 0) {
          const firstNode = lines[0].trim().split(/\s+/)[0];
          if (childNodes.has(firstNode)) {
            return { 
              isValid: false, 
              error: `Invalid tree structure: Root node "${firstNode}" is also a child of another node.` 
            };
          }
        }
      }
      else if (inputFormat === 'math') {
        // Validate mathematical expression (from TreeToArray.js)
        if (!/^[0-9a-zA-Z+\-*/()^. ]+$/.test(primaryInput)) {
          return { 
            isValid: false, 
            error: 'Expression can only contain numbers, variables, operators (+, -, *, /, ^), and parentheses.' 
          };
        }
        
        let parenCount = 0;
        for (let char of primaryInput) {
          if (char === '(') parenCount++;
          else if (char === ')') parenCount--;
          
          if (parenCount < 0) {
            return { isValid: false, error: 'Unbalanced parentheses in expression.' };
          }
        }
        
        if (parenCount !== 0) {
          return { isValid: false, error: 'Unbalanced parentheses in expression.' };
        }
      }
    }
    else if (operationType === 'reconstruct_tree') {
      // Validate traversal inputs - ensure they're space-separated alphanumeric values
      const primaryValues = primaryInput.trim().split(/\s+/);
      const secondaryValues = secondaryInput.trim().split(/\s+/);
      
      // Check if any values are invalid
      const allValues = [...primaryValues, ...secondaryValues];
      const invalidValues = allValues.filter(val => !(/^[A-Za-z0-9]+$/.test(val)));
      
      if (invalidValues.length > 0) {
        return {
          isValid: false,
          error: `Invalid traversal value(s): ${invalidValues.join(', ')}. Use letters or numbers only.`
        };
      }
      
      // Check if traversals have the same length
      if (primaryValues.length !== secondaryValues.length) {
        return {
          isValid: false,
          error: 'Traversals must have the same number of nodes.'
        };
      }
      
      // Check if traversals contain the same set of nodes
      const primarySet = new Set(primaryValues);
      const secondarySet = new Set(secondaryValues);
      
      if (primarySet.size !== secondarySet.size || primaryValues.length !== primarySet.size) {
        return {
          isValid: false,
          error: 'Traversals must contain the same set of unique nodes.'
        };
      }
      
      for (const val of primaryValues) {
        if (!secondarySet.has(val)) {
          return {
            isValid: false,
            error: `Node '${val}' appears in one traversal but not the other.`
          };
        }
      }
    }
    
    return { isValid: true };
  };

  // Get placeholder text based on input options
  const getPlaceholder = () => {
    if (operationType === 'build_tree') {
      if (inputFormat === 'level') {
        return "Example: A B C D E None F (space-separated nodes in level order)";
      } else if (inputFormat === 'table') {
        return "Example:\nA B C\nB D E\nC F 0\nD 0 0\nE 0 0\nF 0 0";
      } else { // math
        return "Example: 3*(x+4) (mathematical expression)";
      }
    } else { // reconstruct_tree
      if (traversalType === 'preorder_inorder') {
        return "Example: A B D E C F (preorder traversal)";
      } else { // postorder_inorder
        return "Example: D E B F C A (postorder traversal)";
      }
    }
  };

  const getSecondaryPlaceholder = () => {
    return "Example: D B E A F C (inorder traversal)";
  };

  const renderOutput = () => {
    if (loading) {
      return <Spinner size="medium" />;
    }
    
    if (!result) {
      return <Text>Output will be displayed here!</Text>;
    }
    
    if (result.success === false) {
      return <Text color="status-critical">{result.error}</Text>;
    }
    
    return (
      <Box gap="medium">
        <Tabs width="100%">
          {/* Tree Visualization Tab */}
          <Tab title="Tree Visualization">
            <Box pad="small" width="100%">
              {result.image && (
                <Box width="100%">
                  <Text weight="bold" margin={{ bottom: 'small' }}>Tree Visualization:</Text>
                  <Box height="medium" width="100%" overflow="auto" background="white" pad="small" round="small">
                    <Box align="center" justify="center" height="100%">
                      <Image 
                        src={`data:image/png;base64,${result.image}`}
                        fit="contain"
                        alt="Binary tree visualization"
                        style={{ maxWidth: '100%' }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Tab>
          
          <Tab title="Traversals">
            <Box pad="small">
              {result.traversals && (
                <Box>
                  <Text weight="bold" margin={{ bottom: 'small' }}>Tree Traversals:</Text>
                  <Box background="white" pad="medium" round="small">
                    <Box direction="row" gap="medium" margin={{ bottom: 'xsmall' }}>
                      <Text weight="bold">Preorder:</Text>
                      <Text>{result.traversals.preorder.join(' ')}</Text>
                    </Box>
                    <Box direction="row" gap="medium" margin={{ bottom: 'xsmall' }}>
                      <Text weight="bold">Inorder:</Text>
                      <Text>{result.traversals.inorder.join(' ')}</Text>
                    </Box>
                    <Box direction="row" gap="medium" margin={{ bottom: 'xsmall' }}>
                      <Text weight="bold">Postorder:</Text>
                      <Text>{result.traversals.postorder.join(' ')}</Text>
                    </Box>
                    <Box direction="row" gap="medium">
                      <Text weight="bold">Level-order:</Text>
                      <Text>{result.traversals.levelOrder.join(' ')}</Text>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Tab>
        </Tabs>
      </Box>
    );
  };

  return (
    <SolverPage
      title="Tree Notations"
      topic="Trees And Their Representations"
      description="This tool helps you work with binary trees and their various representations."
      paragraphs={[
        "Binary trees can be represented in multiple formats, including level-order traversal, left-child right-child notation, and as expression trees for mathematical formulas.",
        "Tree traversal algorithms like preorder, inorder, postorder, and level-order provide different ways to visit all nodes in a tree. Certain traversal pairs (like preorder+inorder or postorder+inorder) contain enough information to uniquely reconstruct a binary tree.",
        "This tool allows you to either build a tree from different input formats or reconstruct a tree from traversal pairs. Enter your input below to visualize trees and analyze their traversals!"
      ]}
      InfoText={Info}
      InputComponent={Input}
      input_props={null}
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      render_output={renderOutput}
    />
  );
};

export default TreeNotation;