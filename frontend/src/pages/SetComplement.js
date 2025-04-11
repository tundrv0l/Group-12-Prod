import React, { useState } from 'react';
import { Box, Text, Button } from 'grommet';
import { solveSetComplement } from '../api';
import SolverPage from '../components/SolverPage';
import { useDiagnostics } from '../hooks/useDiagnostics';
import SetComplementInput from '../components/SetComplementInput';

/*
* Name: SetComplement.js
* Author: Parker Clark
* Description: Solver page for calculating set complements.
*/

const SetComplement = () => {
  const [universalSet, setUniversalSet] = useState('');
  const [subset, setSubset] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { trackResults } = useDiagnostics("SET_COMPLEMENT");

  const SAMPLE_UNIVERSAL_SET = "{1, 2, 3, 4, 5}";
  const SAMPLE_SUBSET = "{1, 3}";

  const fillWithSample = () => {
    setUniversalSet(SAMPLE_UNIVERSAL_SET);
    setSubset(SAMPLE_SUBSET);
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Set Complement:
        </Text>
        <Text margin={{ bottom: "xsmall" }} weight="bold">Set Notation Examples:</Text>
        <Text>• Empty set: ∅ or {"{}"}</Text>
        <Text>• Set with elements: {"{1, 2, 3}"} or {"{a, b, c}"}</Text>
        <Text>• Universal set example: {"{1, 2, 3, 4, 5}"}</Text>
        <Text>• Subset example: {"{1, 3}"}</Text>
        <Text>• Resulting complement: {"{2, 4, 5}"}</Text>
        
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
      <SetComplementInput
        universalSet={universalSet}
        subset={subset}
        error={error}
        onUniversalSetChange={setUniversalSet}
        onSubsetChange={setSubset}
      />
    );
  };

  const handleSolve = async () => {
    setLoading(true);
    setOutput('');
    setError('');

    // Validate inputs
    if (!validateInput()) {
      setLoading(false);
      return;
    }

    // Start timing for performance tracking
    const startTime = performance.now();

    try {
      const result = await solveSetComplement({
        universal_set: universalSet,
        subset: subset
      });

      // Diagnostics tracking
      trackResults(
        { universalSet, subset },
        result,
        performance.now() - startTime
      );

      setOutput(result);
    } catch (err) {
      trackResults(
        { universalSet, subset },
        { error: err.message || "Error solving Set Complement" },
        performance.now() - startTime
      );

      setError('An error occurred while finding the set\'s complement.');
    } finally {
      setLoading(false);
    }
  };

  const validateInput = () => {
    if (!universalSet.trim()) {
      setError('Please enter the universal set.');
      return false;
    }

    if (!subset.trim()) {
      setError('Please enter the subset.');
      return false;
    }

    // Basic set notation validation
    const setRegex = /^(\{.*\}|∅)$/;
    
    if (!setRegex.test(universalSet)) {
      setError('Universal set must be in proper set notation: {1, 2, 3} or ∅');
      return false;
    }

    if (!setRegex.test(subset)) {
      setError('Subset must be in proper set notation: {1, 2, 3} or ∅');
      return false;
    }

    return true;
  };

  // React is weird to handle the inf symbol, so replace it with unicode.
  const formatMathNotation = (text) => {
    if (typeof text !== 'string') return text;
    return text.replace(/\(-oo/g, '(-∞').replace(/oo\)/g, '∞)');
  };

  // Format the output for display
  const renderOutput = () => {
    if (!output) return "Output will be displayed here!";
    
    try {
      // Handle if data is a string
      const result = typeof output === 'string' ? JSON.parse(output) : output;
      
      return (
        <Box>
          {/* Handle multiple complement formats */}
          {result.complement_A && (
            <Box direction="row" margin={{ bottom: "small" }}>
              <Text weight="bold" margin={{ right: "small" }}>Set Notation Complement:</Text>
              <Text>{formatMathNotation(result.complement_A)}</Text>
            </Box>
          )}

          {result.complement_B && (
            <Box direction="row" margin={{ bottom: "small" }}>
              <Text weight="bold" margin={{ right: "small" }}>Interval Notation Complement:</Text>
              <Text>{formatMathNotation(result.complement_B)}</Text>
            </Box>
          )}
        </Box>
      );
    } catch (e) {
      return String(output);
    }
  };

  return (
    <SolverPage
      title="Set Complements"
      topic="Sets"
      description="This tool helps you generate and analyze set complements."
      paragraphs={[
        "The complement of a set A, denoted by A', is the set of all elements in the universal set that are not in A. For example, if the universal set is {1, 2, 3, 4, 5} and set A is {1, 2, 3}, then the complement of A is {4, 5}.",
        "By finding the complement of a set, you can determine which elements are excluded from the set within the context of the universal set. This tool allows you to input a set and the universal set to generate the complement of the set.",
        "Enter your universal set and subset below to generate the complement!"
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

export default SetComplement;