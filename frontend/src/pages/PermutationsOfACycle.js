import React from 'react';
import { Box, Text, Button } from 'grommet';
import { solvePermutationsCycle } from '../api';
import SolverPage from '../components/SolverPage';
import MatrixTable from '../components/PermutationsInput';
import MatrixToolbar from '../components/PermutatinsToolbar';
import { useDiagnostics } from '../hooks/useDiagnostics';

/*
* Name: PermutationsOfACycle.js
* Author: Parker Clark
* Description: Solver page for analyzing permutations of a cycle.
*/

const PermutationsOfACycle = () => {
  const [matrix, setMatrix] = React.useState([['']]);
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { trackResults } = useDiagnostics("PERMUTATIONS_CYCLE");
  
  // Sample permutation data
  const SAMPLE_MATRIX = [
    ['1', '2', '3', '4'],
    ['2', '3', '4', '1']
  ];

  
  const fillWithSample = () => {
    setMatrix(SAMPLE_MATRIX);
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Permutation Cycles:
        </Text>
        <Text>
          A permutation is a bijective function from a set to itself. To input a permutation:
        </Text>
        <Text margin={{ top: "xsmall" }}>
          1. First row: Enter the domain elements (e.g., 1 2 3 4)
        </Text>
        <Text>
          2. Second row: Enter where each element maps to (e.g., 2 3 4 1)
        </Text>
        <Text margin={{ top: "xsmall" }}>
          The example above represents the cycle (1 2 3 4) where 1→2, 2→3, 3→4, and 4→1.
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
        <MatrixTable label="Input Matrix" matrix={matrix} setMatrix={setMatrix} />
        <MatrixToolbar matrix={matrix} setMatrix={setMatrix} combined addRemoveBoth />
      </Box>
    );
  };

  const renderOutput = () => {
    if (!output) {
      return "Output will be displayed here!";
    }
    
    const results = typeof output === 'string' ? JSON.parse(output) : output;
    return Object.entries(results)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };


  const handleSolvePermutations = async () => {

    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');
    
    // Start timing for performance tracking
    const startTime = performance.now();
  
    // Validate that the matrix has exactly 2 rows
    if (matrix.length !== 2) {
      setLoading(false);
      setError('Matrix must have exactly 2 rows.');
      return;
    }

    try {
      const result = await solvePermutationsCycle(matrix);
      
      // Tracking results for diagnostics
      trackResults(
        { matrix: matrix },
        result, 
        performance.now() - startTime
      );
  
      // Check if the response contains an error
      if (result.error) {
        throw new Error(result.error);
      }
  
      setOutput(result);
    } catch (err) {
      if (err.message.includes("Not a permutation")) {
        setError("Not a permutation. Please ensure your input is a valid bijection.");
        // Tracking failures for diagnostics
        trackResults(
          { matrix: matrix },
          { error: err.message || "Error solving PERT diagram" },
          performance.now() - startTime
        );
        return;
      } else {
        setError("An error occurred while generating the permutations.");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SolverPage
      title="Permutations of a Cycle"
      topic="Functions"
      description="This tool helps you analyze permutations of a cycle in discrete mathematics."
      paragraphs={[
        "A permutation of a cycle is a rearrangement of the elements in a cyclic order. This tool allows you to input a cycle and generate its permutations.",
        "By analyzing permutations of a cycle, you can understand the different ways elements can be ordered within a cycle, which is useful in various applications such as cryptography, coding theory, and combinatorial optimization.",
        "Enter your cycle below to generate and analyze its permutations!"
      ]}
      InfoText={Info}
      InputComponent={Input}
      input_props={ null }
      error={error}
      handle_solve={handleSolvePermutations}
      loading={loading}
      render_output={renderOutput}
    />
  );
};

export default PermutationsOfACycle;
