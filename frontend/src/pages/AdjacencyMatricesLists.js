import React from 'react';
import { Box, Text, Button, Select, Tab, Tabs } from 'grommet';
import { solveAdjacencyMatricesLists } from '../api';
import SolverPage from '../components/SolverPage';
import AdjacencyMatrix from '../components/AdjacencyMatrix';
import AdjacencyList from '../components/AdjacencyList';
import { useDiagnostics } from '../hooks/useDiagnostics';
import GraphInput from '../components/GraphInput';
/*
* Name: AdjacencyMatricesLists.js
* Author: Parker Clark
* Description: Solver page for adjacency matrices and adjacency lists.
*/

const AdjacencyMatricesLists = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [type, setType] = React.useState('UNDIRECTED');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { trackResults } = useDiagnostics("ADJACENCY_MATRICES_LISTS");

  // Sample graph data for "Fill with Sample" button
  const SAMPLE_GRAPH = "{(0, 1), (1, 2), (2, 0)}";
  
  const fillWithSample = () => {
    setInput(SAMPLE_GRAPH);
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Graph Input Format:
        </Text>
        <Text>
          To input a graph, use the following format:
        </Text>
        <Text>
          <strong>{'{(x1, y1), (x2, y2), ...}'}</strong>
        </Text>
        <Text>
          For example: <strong>{'{(0, 1), (1, 2), (2, 0)}'}</strong>
        </Text>
        <Text>
          Each tuple represents a connection between two vertices. So (0, 1) represents an edge between vertex 0 and vertex 1.
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
      <Box>
        <GraphInput 
          value={input}
          onChange={setInput}
        />
        
        <Box align="center" justify="center" pad={{ vertical: 'small' }}>
          <Text margin={{ bottom: 'xsmall' }}>Graph Type:</Text>
          <Select
            options={['UNDIRECTED', 'DIRECTED']}
            value={type}
            onChange={({ option }) => setType(option)}
          />
        </Box>
      </Box>
    );
  };

  const handleSolve = async () => {
    // Empty output and error messages
      setLoading(true);
      setOutput('');
      setError('');
  
      // Validate input
      const isValid = validateInput(input);
      if (!isValid) {
        setError('Invalid input. Please enter a valid expression.');
        setLoading(false);
        return;
      }
  
      setError('');

      // Start timing for performance tracking
      const startTime = performance.now();

      try { 
        // Do some conversion to display any backend errors
        let result = await solveAdjacencyMatricesLists(input, type);
  
        // Parse result if it is a string
        if (typeof result === 'string') {
          result = JSON.parse(result);
        }
        
        // Check if there is an error key in the result
        const errorKey = Object.keys(result).find(key => key.toLowerCase().includes('error'));
        console.log(errorKey);
        if (errorKey) {

          trackResults(
            { input, type }, // Input data
            { error: result[errorKey] }, // Error result
            performance.now() - startTime // Execution time
          );

          setError(result[errorKey]);
        } else {

          trackResults(
            { input, type }, // Input data
            result, // Success result
            performance.now() - startTime // Execution time
          );

          setOutput(result);
        }
      } catch (err) {
        console.log(err);

        trackResults(
          { input, type }, // Input data
          { error: err.message || 'Unknown error' }, // Error result
          performance.now() - startTime // Execution time
        );

        setError('An error occurred while generating the Graph.');
      } finally {
        setLoading(false);
      }
    };

  const validateInput = (input) => {
    // Regular expression to match 'coordinate' pairs in the form of {(x1, y1), (x2, y2), ...}
    const graphRegex = /^\{\s*(\(\s*\d+\s*,\s*\d+\s*\)\s*,\s*)*(\(\s*\d+\s*,\s*\d+\s*\))\s*\}$/;
    return graphRegex.test(input);
  }

  // Render output for graph image, adjacency matrix, and adjacency list
  const renderOutput = () => {
    if (!output.Graph && !output.Matrix && !output.List) {
      return "Output will be displayed here!";
    }

    return (
        <Box>
          <Tabs>
            <Tab title="Graph Visualization">
              <Box pad="small">
                {output.Graph && (
                  <Box align="center" justify="center" pad={{ vertical: 'small' }} background={{ color: 'white' }} round="small">
                    <img src={`data:image/png;base64,${output.Graph}`} alt="Graph" style={{ maxWidth: '100%', height: 'auto' }} />
                  </Box>
                )}
              </Box>
            </Tab>
            
            <Tab title="Matrix Representation">
              <Box pad="small">
                {output.Matrix && (
                  <Box align="center" justify="center" pad={{ vertical: 'small' }} background={{ color: 'white' }} round="small">
                    <AdjacencyMatrix matrix={output.Matrix} />
                  </Box>
                )}
              </Box>
            </Tab>
            
            <Tab title="List Representation">
              <Box pad="small">
                {output.List && (
                  <Box align="center" justify="center" pad={{ vertical: 'small' }} background={{ color: 'white' }} round="small">
                    <AdjacencyList list={output.List} />
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
      title="Adjacency Matrices and Adjacency Lists"
      topic="Graphs And Their Representations"
      description="This tool helps you analyze graphs using adjacency matrices and adjacency lists."
      paragraphs={[
        "Adjacency matrices and adjacency lists are two common ways to represent graphs. An adjacency matrix is a 2D array of size VxV where V is the number of vertices in a graph. Each cell in the matrix represents an edge between two vertices. If there is an edge between vertex i and vertex j, the cell at row i and column j will be 1 (or the weight of the edge), otherwise, it will be 0.",
        "An adjacency list, on the other hand, is an array of lists. The size of the array is equal to the number of vertices. Each element of the array is a list that contains all the vertices that are adjacent to the corresponding vertex. This representation is more space-efficient for sparse graphs.",
        "By analyzing graphs using adjacency matrices and lists, you can understand the relationships and connections between different entities. This is useful in various applications such as network analysis, algorithm design, and optimization problems. This tool allows you to input a graph and explore its properties and representations.",
        "Enter your graph below to generate and analyze its properties using this tool!"
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

export default AdjacencyMatricesLists;