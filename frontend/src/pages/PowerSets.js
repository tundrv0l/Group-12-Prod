import React, { useState } from 'react';
import { Box, Text, Button, Heading } from 'grommet';
import { solvePowerSet } from '../api';
import SolverPage from '../components/SolverPage';
import { useDiagnostics } from '../hooks/useDiagnostics';
import PowerSetInput from '../components/PowerSetInput';

/*
* Name: PowerSets.js
* Author: Parker Clark
* Description: Solver page for solving power sets.
*/

const PowerSets = () => {
  const [sets, setSets] = useState([""]);
  const [iterations, setIterations] = useState(1);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { trackResults } = useDiagnostics("POWER_SET");

  const SAMPLE_SET = "{1, 2, 3}";
  
  const fillWithSample = () => {
    setSets([SAMPLE_SET]);
    setIterations(1);
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Power Sets:
        </Text>
        <Text>The power set of a set S is the set of all subsets of S, including the empty set and S itself.</Text>
        <Text margin={{ vertical: "xsmall" }}>
          <strong>For example:</strong> If S = {"{a, b}"}, then the power set of S is {"{{}, {a}, {b}, {a, b}}"}
        </Text>
        
        <Heading level={5} margin={{ vertical: "xsmall" }} weight="bold">Set Notation Guidelines</Heading>
        <Text>Enter sets using curly braces with comma-separated elements:</Text>
        <Text margin={{ top: "xsmall" }}>
          <strong>{"{1, 2, 3}"}</strong> - Set containing numbers 1, 2, and 3
        </Text>
        <Text><strong>{"{a, b, c}"}</strong> - Set containing elements a, b, and c</Text>
        <Text><strong>{"∅"}</strong> or <strong>{"{}"}</strong> - Empty set</Text>
        
        <Heading level={5} margin={{ vertical: "xsmall" }} weight="bold">Power Set Iterations</Heading>
        <Text>You can calculate the power set multiple times (iteratively):</Text>
        <Text margin={{ top: "xsmall" }}>
          <strong>1 iteration:</strong> P(S) = The regular power set of S
        </Text>
        <Text><strong>2 iterations:</strong> P(P(S)) = The power set of the power set of S</Text>
        <Text><strong>3 iterations:</strong> P(P(P(S))) = The power set applied three times</Text>
        
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
      <PowerSetInput
        sets={sets}
        iterations={iterations}
        error={error}
        onSetsChange={setSets}
        onIterationsChange={setIterations}
      />
    );
  };

  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');

    // Validate input
    if (!validateInput()) {
      setLoading(false);
      return;
    }

    // Start timing for performance tracking
    const startTime = performance.now();

    try {
      // Create payload for input to send to the API
      const payload = {
        sets: sets.reduce((acc, setValue, index) => {
          // Just use numbers as set names
          acc[`${index + 1}`] = setValue;
          return acc;
        }, {}),
        iterations: parseInt(iterations)
      };
      const result = await solvePowerSet(payload);
      setOutput(result);

        // Track successful execution with timing
      trackResults(
        payload,
        result,
        performance.now() - startTime
      );

    } catch (err) {
      setError('An error occurred while calculating the power set.');

      // Track failed execution with timing
      trackResults(
        { sets, iterations },
        { error: err.message || 'Unknown error' },
        performance.now() - startTime
      );

    } finally {
      setLoading(false);
    }
  };

  // Update the validateInput function to work with simple array
  const validateInput = () => {
    // Check if all sets have values
    for (let i = 0; i < sets.length; i++) {
      const setValue = sets[i];
      
      if (!setValue.trim()) {
        setError(`Set ${i + 1} must have a value.`);
        return false;
      }
      
      // Basic validation for set notation
      if (!validateSetNotation(setValue)) {
        setError(`Set ${i + 1} has invalid format. Use format like {1, 2, 3} or ∅.`);
        return false;
      }
    }
    
    // Validate iterations
    const iterValue = parseInt(iterations);
    if (isNaN(iterValue) || iterValue < 1 || iterValue > 3) {
      setError('Iterations must be a number between 1 and 3.');
      return false;
    }
    
    return true;
  };

  const validateSetNotation = (value) => {
    // Accept empty set
    if (value === "∅" || value === "{}") {
      return true;
    }
    
    // Check if it starts with { and ends with }
    if (!value.startsWith("{") || !value.endsWith("}")) {
      return false;
    }
    
    return true;
  };

  const formatSetNotation = (text) => {
    if (typeof text !== 'string') return text;
    // Add space after commas in set notation
    return text.replace(/,/g, ', ');
  };

  const renderOutput = (data) => {
    if (!data) return <Text>Output will be displayed here!</Text>;
    
    try {
      // Handle if data is a string
      const result = typeof data === 'string' ? JSON.parse(data) : data;
      
      return (
        <Box width="100%" fill="horizontal">
          {result.iterations && (
            <Box direction="row" margin={{ bottom: "medium" }}>
              <Text weight="bold" margin={{ right:"xsmall"}}>Iterations: </Text>
              <Text>{result.iterations}</Text>
            </Box>
          )}
          
          {result.original_sets && Object.entries(result.original_sets).map(([name, value]) => (
            <Box key={name} direction="row" margin={{ bottom: "small" }}>
              <Text weight="bold" margin={{ right:"xsmall"}}>{name.startsWith('Set') ? name : `Set ${name}`}: </Text>
              <Text>{formatSetNotation(value)}</Text>
            </Box>
          ))}
          
          {result.power_sets && Object.entries(result.power_sets).map(([iteration, powerSet]) => (
            <Box key={iteration} margin={{ top: "medium" }} width="100%">
              <Text weight="bold">{iteration}: </Text>
              <Box background="light-1" pad="small" margin={{ top: "xsmall" }} round="small" width="100%">
                {typeof powerSet === 'object' ? (
                  <Box>
                    {powerSet.notation && (
                      <Box direction="row" margin={{ bottom: "small" }}>
                        <Text weight="bold" margin={{ right: "xsmall" }}>Notation:</Text>
                        <Text>{powerSet.notation}</Text>
                      </Box>
                    )}

                    {powerSet.cardinality && (
                      <Box direction="row" margin={{ bottom: "small" }}>
                        <Text weight="bold" margin={{ right: "xsmall" }}>Cardinality:</Text>
                        <Text>{powerSet.cardinality}</Text>
                      </Box>
                    )}
                    
                    {powerSet.elements && (
                      <Box margin={{ top: "small" }}>
                        <Text weight="bold">Elements: </Text>
                        <Box 
                          background="light-2" 
                          pad="small" 
                          margin={{ top: "xsmall" }} 
                          round="small"
                          style={{ maxHeight: '200px', overflowY: 'auto' }}
                        >
                          {Array.isArray(powerSet.elements) ? 
                            powerSet.elements.map((elem, i) => (
                              <Text key={i} margin={{ bottom: "xxsmall" }}>{formatSetNotation(elem)}</Text>
                            )) 
                            : 
                            <Text>{formatSetNotation(String(powerSet.elements))}</Text>
                          }
                        </Box>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Text>{formatSetNotation(String(powerSet))}</Text>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      );
    } catch (e) {
      return <Text>{String(data)}</Text>;
    }
  };

  return (
    <SolverPage
      title="Power Sets"
      topic="Sets"
      description="This tool helps you generate and analyze power sets."
      paragraphs={[
        "A power set is the set of all subsets of a set, including the empty set and the set itself. For example, the power set of {A, B} is {{}, {A}, {B}, {A, B}}.",
        "By generating power sets, you can explore all possible combinations of elements within a set. This tool allows you to input a set and generate its power set to analyze the relationships between its subsets.",
        "Enter your set notation below to generate its power set and analyze the results!"
      ]}
      InfoText={Info}
      InputComponent={Input}
      input_props={null}
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      render_output={() => output ? renderOutput(output) : "Output will be displayed here!"}
    />
  );
};

export default PowerSets;