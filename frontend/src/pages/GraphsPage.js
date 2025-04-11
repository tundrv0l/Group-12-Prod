import React from 'react';
import { Box, Text, Button, Select, CheckBox } from 'grommet';
import { solveGraphs } from '../api';
import SolverPage from '../components/SolverPage';
import { useDiagnostics } from '../hooks/useDiagnostics';
import GraphInput from '../components/GraphInput';


/*
* Name: GraphsPage.js
* Author: Parker Clark
* Description: Solver page for graphs
*/

const GraphsPage = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [type, setType] = React.useState('UNDIRECTED');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isIsomorphic, setIsIsomorphic] = React.useState(false);
  const [secondInput, setSecondInput] = React.useState('');

  const { trackResults } = useDiagnostics("GRAPHS");

  const SAMPLE_GRAPH = "{(0, 1), (1, 2), (2, 0)}";  
  const SAMPLE_GRAPH_ISOMORPHIC = "{(3, 4), (4, 5), (5, 3)}";

  const fillWithSample = () => {
    setInput(SAMPLE_GRAPH);
    if (isIsomorphic) {
      setSecondInput(SAMPLE_GRAPH_ISOMORPHIC);
    }
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Graph Input:
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

        {isIsomorphic && (
          <Box margin={{ top: 'small' }}>
            <GraphInput
              value={secondInput}
              onChange={setSecondInput}
            />
          </Box>
        )}
        
        <Box align="center" justify="center" pad={{ vertical: 'small' }}>
          <Text margin={{ bottom: 'xsmall' }}>Graph Type:</Text>
          <Select
            options={['UNDIRECTED', 'DIRECTED']}
            value={type}
            onChange={({ option }) => setType(option)}
          />
        </Box>
        
        <Box align="center" justify="center" pad={{ vertical: 'small' }}>
          <CheckBox
            label="Check for Isomorphism"
            checked={isIsomorphic}
            onChange={(event) => setIsIsomorphic(event.target.checked)}
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

    // Validate second input if isomorphic check is enabled
    if (isIsomorphic) {
      const isValidSecondInput = validateInput(secondInput);
      if (!isValidSecondInput) {
        setError('Invalid second input. Please enter a valid expression.');
        setLoading(false);
        return;
      }
    }

    setError('');

    // Start timing for performance tracking
    const startTime = performance.now();

    try { 
      // Do some conversion to display any backend errors
      let result = await solveGraphs(input, type, isIsomorphic, secondInput);

      // Parse result if it is a string
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }
      
      // Check if there is an error key in the result
      const errorKey = Object.keys(result).find(key => key.toLowerCase().includes('error'));
      console.log(errorKey);
      if (errorKey) {

        // Track failed execution
        trackResults(
          { input: input, type: type, isIsomorphic: isIsomorphic, secondInput: secondInput },
          { error: result[errorKey] }, 
          performance.now() - startTime
        );

        setError(result[errorKey]);
      } else {

        // Track failed execution
        trackResults(
          { input: input, type: type, isIsomorphic: isIsomorphic, secondInput: secondInput },
          result, 
          performance.now() - startTime
        );

        setOutput(result["Graph"]);
      }
    } catch (err) {
      console.log(err);

      // Track exception
      trackResults(
        { input: input, type: type, isIsomorphic: isIsomorphic, secondInput: secondInput }, // Input data
        { error: err.message || 'Unknown error' }, // Error result
        performance.now() - startTime // Execution time
      );

      setError('An error occurred while generating the Graph.');
    } finally {
      setLoading(false);
    }
  };

  const validateInput = (input) => {
    // Update regex to allow alphanumeric characters (letters and numbers) for vertex names
    const graphRegex = /^\{\s*(\(\s*[a-zA-Z0-9]+\s*,\s*[a-zA-Z0-9]+\s*\)\s*,\s*)*(\(\s*[a-zA-Z0-9]+\s*,\s*[a-zA-Z0-9]+\s*\))\s*\}$/;
    return graphRegex.test(input);
  }

  // Convert base64 image string to image element
  const renderOutput = () => {
    if (!output) {
      return "Output will be displayed here!";
    }

    // Parse out json object and return out elements one by one
    return (
      <Box>
        <img src={`data:image/png;base64,${output}`} alt="Graph" style={{ maxWidth: '100%', height: 'auto' }} />
      </Box>
    );
  };

  return (
    <SolverPage
      title="Graphs"
      topic="Graphs And Their Representations"
      description="This tool helps you analyze graphs in discrete mathematics."
      paragraphs={[
        "Graphs are mathematical structures used to model pairwise relations between objects. A graph is made up of vertices (also called nodes) which are connected by edges. Graphs can be used to represent various real-world problems such as social networks, computer networks, and transportation systems.",
        "By analyzing graphs, you can understand the relationships and connections between different entities. This is useful in various applications such as network analysis, algorithm design, and optimization problems. This tool allows you to input a graph and explore its properties and representations.",
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

export default GraphsPage;