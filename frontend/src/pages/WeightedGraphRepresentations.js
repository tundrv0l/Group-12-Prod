import React, { useState } from 'react';
import { Box, Text, Button, Select, Collapsible, Tab, Tabs } from 'grommet';
import { solveWeightedGraphs } from '../api';
import { CircleInformation } from 'grommet-icons';
import SolverPage from '../components/SolverPage';
import AdjacencyMatrix from '../components/AdjacencyMatrix';
import AdjacencyList from '../components/AdjacencyList';
import { useDiagnostics } from '../hooks/useDiagnostics';
import WeightedGraphInput from '../components/WeightedGraphInput';

/*
* Name: WeightedGraphRepresentations.js
* Author: Parker Clark
* Description: Solver page for weighted graphs. Also includes AdjacencyMatrix and AdjacencyList component
*/

const WeightedGraphRepresentations = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [type, setType] = React.useState('UNDIRECTED');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Initialize diagnostic hook
  const { trackResults } = useDiagnostics("WEIGHTED_GRAPHS");

  // Sample data for "Fill with Sample" button
  const SAMPLE_GRAPH = "{(0, 1; 4), (1, 2; 2), (2, 0; 3)}";
  
  const fillWithSample = () => {
    setInput(SAMPLE_GRAPH);
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

    const startTime = performance.now();

    try {
      const result = await solveWeightedGraphs(input, type);
      const parsedResult = JSON.parse(result);
      console.log(parsedResult);
      
      // Track successful execution with timing
      trackResults(
        { formula: input }, // Input data
        parsedResult,       // Result data
        performance.now() - startTime      // Execution time in ms
      );
      
      setOutput(parsedResult);
    } catch (err) {
      // Track failed execution with timing
      trackResults(
        { formula: input },
        { error: err.message || 'Unknown error' },
        performance.now() - startTime
      );
      
      setError('An error occurred while generating the weighted graph.');
    } finally {
      setLoading(false);
    }
  }

  // Create a custom input component with help panel
  const WeightedGraphInputWithHelp = () => {
    const [showHelp, setShowHelp] = useState(false);
    
    return (
      <Box>
        <Box direction="row" align="start" justify="start" margin={{ bottom: 'small' }} style={{ marginLeft: '-8px', marginTop: '-8px' }}>
          <Button icon={<CircleInformation />} onClick={() => setShowHelp(!showHelp)} plain />
        </Box>
        
        <Collapsible open={showHelp}>
          <Box pad="small" background="light-2" round="small" margin={{ bottom: "medium" }} width="large">
            <Text>
              To input a weighted graph, use the following format:
            </Text>
            <Text>
              <strong>{'{(x1, y1; w1), (x2, y2; w2), ...}'}</strong>
            </Text>
            <Text>
              For example: <strong>{'{(0, 1; 4), (1, 2; 2), (2, 0; 3)}'}</strong>
            </Text>
            <Text>
              Each tuple represents a connection between two vertices with a weight. So (0, 1; 4) represents an edge between vertex 0 and vertex 1 with a weight of 4.
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
          </Box>
        </Collapsible>
        
        <WeightedGraphInput 
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

  const validateInput = (input) => {
    // Updated regex to allow alphanumeric characters (letters and numbers) for vertex names
    const graphRegex = /^\{\s*(\(\s*[a-zA-Z0-9]+\s*,\s*[a-zA-Z0-9]+\s*;\s*\d+\s*\)\s*,\s*)*(\(\s*[a-zA-Z0-9]+\s*,\s*[a-zA-Z0-9]+\s*;\s*\d+\s*\))\s*\}$/;
    return graphRegex.test(input);
  }

  // Render output for graph image, adjacency matrix, and adjacency list
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
      title="Weighted Graph Representations"
      topic="Graphs And Their Representations"
      description="This tool helps you analyze weighted graphs in discrete mathematics."
      paragraphs={[
        "Weighted graphs are a type of graph where each edge has an associated numerical value, called a weight. These weights can represent various quantities such as distances, costs, or capacities, depending on the context of the problem.",
        "In a weighted graph, the vertices (or nodes) are connected by edges that have weights. This allows for more detailed modeling of real-world problems, such as finding the shortest path in a transportation network, optimizing network flows, or analyzing social networks.",
        "By analyzing weighted graphs, you can understand the relationships and connections between different entities, taking into account the significance of the connections. This is useful in various applications such as network analysis, algorithm design, and optimization problems. This tool allows you to input a weighted graph and explore its properties and representations.",
        "Enter your weighted graph below to generate and analyze its properties using this tool!"
      ]}
      InputComponent={WeightedGraphInputWithHelp}
      input_props={null}
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      render_output={renderOutput}
    />
  );
};

export default WeightedGraphRepresentations;