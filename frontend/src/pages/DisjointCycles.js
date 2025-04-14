import React from 'react';
import { Box, Text, TextInput, Button} from 'grommet';
import { solveDisjointCycles } from '../api';
import SolverPage from '../components/SolverPage';
import { useDiagnostics } from '../hooks/useDiagnostics';

/*
* Name: DisjointCycles.js
* Author: Parker Clark
* Description: Solver page for analyzing disjoint cycles.
*/

const DisjointCycles = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { trackResults } = useDiagnostics("DISJOINT_CYCLES");

  // Sample disjoint cycles data
  const SAMPLE_INPUT = "(1 2 3)(4 5)";
  
  const fillWithSample = () => {
    setInput(SAMPLE_INPUT);
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Disjoint Cycles:
        </Text>
        <Text>
          To input permutations as disjoint cycles, use the following format:
        </Text>
        <Text>
          <strong>(a b c)(d e f)...</strong>
        </Text>
        <Text>
          For example: <strong>(1 2 3)(4 5)</strong>
        </Text>
        <Text>
          This represents two disjoint cycles: one that maps 1→2→3→1 and another that maps 4→5→4.
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

  // Input component
  const Input = () => {
    return (
      <TextInput 
        placeholder="Example: Enter your permutations here (e.g., (1 2 3)(4 5))"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
    );
  };

  const renderOutput = () => {
    if (!output) {
      return "Output will be displayed here!";
    }
    
    // If output is already a formatted string, return it directly
    if (typeof output === 'string') {
      return output;
    }
    
    // Otherwise parse and format the object
    const results = output;
    return Object.entries(results)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };
            
  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');

    // Validate input
    const isValid = validateInput(input);
    if (!isValid) {
      setError('Invalid input. Please enter a valid permutation.');
      setLoading(false);
      return;
    }

    const formatOutput = (input) => {
      const results = typeof input === 'string' ? JSON.parse(input) : input;
      return Object.entries(results)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    };

    setError('');

    // Start timing for performance tracking
    const startTime = performance.now();

    try {
      const result = await solveDisjointCycles(input);

      trackResults(
        { input: input },
        result, 
        performance.now() - startTime
      );

      setOutput(formatOutput(result));

    } catch (err) {

      trackResults(
        { input: input },
        { error: err.message || "Error solving Disjoint Cycle" },
        performance.now() - startTime
      );

      setError('An error occurred while generating the Disjoint Cycle.');
    } finally {
      setLoading(false);
    }
  }

  const validateInput = (input) => {
    // Reject input if it contains a plus sign
    if (/\+/.test(input)) {
      return false;
    }
  
    // Improved regex to match cycles with space or comma separators
    const regex = /\(\s*([a-zA-Z0-9]+(?:\s*,\s*|\s+)[a-zA-Z0-9]+(?:(?:\s*,\s*|\s+)[a-zA-Z0-9]+)*)\s*\)/g;
  
    // Remove composition symbols before matching
    const cleanedInput = input.replace(/\s*∘\s*/g, ' '); // Unicode composition symbol only
  
    // Find all matches
    const matches = cleanedInput.match(regex);
  
    // Check if there are at least two valid cycles
    return matches && matches.length >= 2;
  };

  return (
    <SolverPage
    title="Disjoint Cycles"
    topic="Functions"
    description="This tool helps you analyze permutations as disjoint cycles in discrete mathematics."
    paragraphs={[
      "A permutation can be decomposed into a product of disjoint cycles. This tool allows you to input a permutation and generate its disjoint cycle representation.",
      "By analyzing permutations as disjoint cycles, you can understand the structure of permutations and how elements are mapped within cycles. This is useful in various applications such as group theory, cryptography, and combinatorial optimization.",
      "Enter your permutation below to generate and analyze its disjoint cycles!"
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

export default DisjointCycles;