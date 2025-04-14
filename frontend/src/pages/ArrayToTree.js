import React, { useState } from 'react';
import { Box, Text, TextArea, Button, Spinner, Image, Table, TableHeader, TableBody, TableRow, TableCell, Tab, Tabs } from 'grommet';
import { solveArrayToTree } from '../api';
import SolverPage from '../components/SolverPage';
import { useDiagnostics } from '../hooks/useDiagnostics';
/*
* Name: ArrayToTree.js
* Description: Solver page for converting array representation to a binary tree.
*/

const ArrayToTree = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { trackResults } = useDiagnostics("ARRAY_TO_TREE");

  const SAMPLE_TREE = `A B C
B D E
C F 0
D 0 0
E 0 0
F 0 0`;

  const fillWithSample = () => {
    setInput(SAMPLE_TREE);
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Array to Tree Conversion:
        </Text>
        <Text textAlign="start" weight="normal">
          Enter each node in the format: "node left_child right_child"
        </Text>
        <ul style={{ margin: '0px 0px 8px 20px', padding: 0 }}>
          <li><Text>Each line represents one node and its children</Text></li>
          <li><Text>Use '0' to indicate no child (NULL)</Text></li>
          <li><Text>The first node is considered the root</Text></li>
        </ul>
        <Text>Example:</Text>
        <pre style={{ background: '#f8f8f8', padding: '8px', borderRadius: '4px', margin: '8px 0' }}>
          A B C<br />
          B D E<br />
          C F 0<br />
          D 0 0<br />
          E 0 0<br />
          F 0 0
        </pre>
        <Text margin={{ bottom: "xsmall" }}>
          This represents a tree where A is the root with children B and C, etc.
        </Text>
        
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
      <TextArea
        placeholder="Enter your tree table representation (e.g., 'A B C' on first line, etc.)"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={8}
        resize={false}
      />
    );
  };


  const handleSolve = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    if (!input.trim()) {
      setError('Input cannot be empty.');
      setLoading(false);
      return;
    }

    // Validate input
    const validation = validateInput(input);
    if (!validation.isValid) {
      setError(validation.error);
      setLoading(false);
      setResult(null);
      return;
    }
    
    const startTime = performance.now();
    
    try {
      const response = await solveArrayToTree(input);
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      
      // Track results
      trackResults(
        { input },
        data,
        performance.now() - startTime
      );
      
      setResult(data);
    } catch (err) {
      console.error('Error converting array to tree:', err);
      setError('An error occurred while processing your input.');
      
      // Track exception
      trackResults(
        { input },
        { error: err.message || 'Unknown error' },
        performance.now() - startTime
      );
    } finally {
      setLoading(false);
    }
  };

  const validateInput = (input) => {
    if (!input || !input.trim()) {
      return { isValid: false, error: 'Input cannot be empty.' };
    }
  
    const lines = input.trim().split('\n');
    const seenNodes = new Set();
    const childNodes = new Set();
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const tokens = line.split(/\s+/); // Split by any whitespace
  
      // Check if we have exactly 3 tokens per line
      if (tokens.length !== 3) {
        return { 
          isValid: false, 
          error: `Line ${i + 1}: Each line must have exactly 3 values (node, leftChild, rightChild).` 
        };
      }
  
      const [node, leftChild, rightChild] = tokens;
  
      // Check if node is a single alphanumeric character
      if (!/^[a-zA-Z0-9]$/.test(node)) {
        return { 
          isValid: false, 
          error: `Line ${i + 1}: Node value "${node}" must be a single alphanumeric character.` 
        };
      }
  
      // Check if node was already defined
      if (seenNodes.has(node)) {
        return { 
          isValid: false, 
          error: `Line ${i + 1}: Node "${node}" is defined multiple times.` 
        };
      }
      seenNodes.add(node);
  
      // Check left child format (single alphanumeric or '0')
      if (leftChild !== '0' && !/^[a-zA-Z0-9]$/.test(leftChild)) {
        return { 
          isValid: false, 
          error: `Line ${i + 1}: Left child "${leftChild}" must be a single alphanumeric character or '0'.` 
        };
      }
  
      // Check right child format (single alphanumeric or '0')
      if (rightChild !== '0' && !/^[a-zA-Z0-9]$/.test(rightChild)) {
        return { 
          isValid: false, 
          error: `Line ${i + 1}: Right child "${rightChild}" must be a single alphanumeric character or '0'.` 
        };
      }

      // Check for self-referencing nodes (cycle detection)
      if (leftChild === node || rightChild === node) {
        return {
          isValid: false,
          error: `Line ${i + 1}: Node "${node}" cannot have itself as a child. This would create a cycle.`
        };
      }
  
      // Track child nodes for later validation
      if (leftChild !== '0') childNodes.add(leftChild);
      if (rightChild !== '0') childNodes.add(rightChild);
    }
  
    // Optional: Check if there's a consistent tree structure
    // First node should be the root (not a child of any other node)
    if (lines.length > 0) {
      const firstNode = lines[0].trim().split(/\s+/)[0];
      if (childNodes.has(firstNode)) {
        return { 
          isValid: false, 
          error: `Invalid tree structure: Root node "${firstNode}" is also a child of another node.` 
        };
      }
    }
  
    // Check that all non-root nodes are children of some node
    for (let i = 1; i < lines.length; i++) {
      const node = lines[i].trim().split(/\s+/)[0];
      if (!childNodes.has(node)) {
        return { 
          isValid: false, 
          error: `Invalid tree structure: Node "${node}" is not connected to the tree.` 
        };
      }
    }
  
    return { isValid: true };
  };

  // Then replace the renderOutput function with this tabbed version
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
        
        {/* Table Representation Tab */}
        <Tab title="Table Representation">
          <Box pad="small">
            {result.table && result.table.length > 0 && (
              <Box>
                <Text weight="bold" margin={{ bottom: 'small' }}>Node-Child Relationship Table:</Text>
                <Box background="white" pad="small" round="small" overflow="auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell scope="col" border="bottom" background="light-2">
                          <Text weight="bold">Node</Text>
                        </TableCell>
                        <TableCell scope="col" border="bottom" background="light-2">
                          <Text weight="bold">Left Child</Text>
                        </TableCell>
                        <TableCell scope="col" border="bottom" background="light-2">
                          <Text weight="bold">Right Child</Text>
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.table.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell><Text>{row.node}</Text></TableCell>
                          <TableCell><Text>{row.leftChild}</Text></TableCell>
                          <TableCell><Text>{row.rightChild}</Text></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            )}
          </Box>
        </Tab>
        
        {/* Node Listing Tab */}
        <Tab title="Node Listing">
          <Box pad="small">
            {result.nodes && result.nodes.length > 0 && (
              <Box>
                <Text weight="bold" margin={{ bottom: 'small' }}>Nodes (BFS order):</Text>
                <Box background="white" pad="small" round="small">
                  <Text>{result.nodes.join(', ')}</Text>
                </Box>
              </Box>
            )}
          </Box>
        </Tab>
      </Tabs>
    );
  };

  

  return (
    <SolverPage
      title="Array Representation to Binary Tree"
      topic="Tree Representations"
      description="Convert a table-based array representation of a binary tree to its visual tree structure."
      paragraphs={[
        "While binary trees are naturally visualized as connected nodes, they are often stored in computer memory using array-based representations. These array formats are efficient for storage and certain operations, but can be difficult to interpret visually.",
        "The conversion process works by parsing the parent-child relationships defined in your array representation, then reconstructing the hierarchical structure of the tree. Each node from the array is placed in its proper position within the tree, connecting parent nodes to their children according to the relationships defined in your input.",
        "This tool uses the 'left-child right-child' notation where each node is represented as a row with three values: the node value, its left child (or 0 for none), and its right child (or 0 for none). Enter your array-based tree representation below to generate the corresponding visual tree structure!"
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

export default ArrayToTree;