import React from 'react';
import { Box, Text, TextInput, Button } from 'grommet';
import { solveRecursion } from '../api';
import SolverPage from '../components/SolverPage';
import { useDiagnostics } from '../hooks/useDiagnostics';
import BaseCaseInput from '../components/BaseCaseInput';

/*
* Name: RecursiveDefinitions.js
* Author: Parker Clark
* Description: Solver page for solving recursive definitions.
*/

const RecursiveDefinitions = () => {
  const [formula, setFormula] = React.useState('');
  const [baseCases, setBaseCases] = React.useState([{ n: 0, value: '' }]);
  const [n, setN] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);;

  const { trackResults } = useDiagnostics("RECURSIVE_DEFINITIONS");

  const SAMPLE_FORMULA = "f(n-1) + f(n-2)";
  const SAMPLE_BASE_CASES = [
    { n: 0, value: "0" },
    { n: 1, value: "1" }
  ];
  const SAMPLE_N = "10";

  const fillWithSample = () => {
    setFormula(SAMPLE_FORMULA);
    setBaseCases(SAMPLE_BASE_CASES);
    setN(SAMPLE_N);
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Recursive Definitions:
        </Text>
        <Text weight="bold" margin={{ top: "small", bottom: "xsmall" }}>Recursive Formula:</Text>
        <Text>
          Enter a formula using f(n-1), f(n-2), etc. to reference previous terms.
        </Text>
        <Text margin={{ vertical: "xsmall" }}>
          <strong>Examples:</strong>
        </Text>
        <Text margin={{ bottom: "xsmall" }}>• <strong>2 * f(n-1) + 1</strong> - Each term is twice the previous term plus 1</Text>
        <Text margin={{ bottom: "xsmall" }}>• <strong>f(n-1) + f(n-2)</strong> - Fibonacci sequence (each term is the sum of the two preceding terms)</Text>
        <Text margin={{ bottom: "xsmall" }}>• <strong>3 * f(n-1) - 2</strong> - Each term is three times the previous term minus 2</Text>
        
        <Text weight="bold" margin={{ top: "medium", bottom: "xsmall" }}>Base Cases:</Text>
        <Text>
          Define initial values for your sequence. You can add multiple base cases as needed.
        </Text>
        <Text margin={{ vertical: "xsmall" }}>
          <strong>Examples:</strong>
        </Text>
        <Text margin={{ bottom: "xsmall" }}>• For Fibonacci: f(0) = 0, f(1) = 1, etc</Text>
        <Text margin={{ bottom: "xsmall" }}>• For geometric sequence: f(0) = 1, etc </Text>
        
        <Text weight="bold" margin={{ top: "medium", bottom: "xsmall" }}>Value of n:</Text>
        <Text>
          Enter the term number you want to calculate up to.
        </Text>
        <Text margin={{ bottom: "xsmall" }}>
          The solver will show all values from the base cases up to f(n).
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
        <Box margin={{ bottom: "small" }}>
          <TextInput 
            placeholder="Example: Enter your recursive formula here (e.g., 2 * f(n-1) + 1)"
            value={formula}
            onChange={(event) => setFormula(event.target.value)}
          />
        </Box>
        
        <BaseCaseInput
          baseCases={baseCases}
          onChange={setBaseCases}
        />
        
        <Box margin={{ top: "small" }}>
          <TextInput 
            placeholder="Example: Enter your value of 'n' to calculate (e.g., 5)"
            value={n}
            onChange={(event) => setN(event.target.value)}
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
  
    // Format base cases into the required string format
    const formattedBaseCases = baseCases
      .map(bc => `${bc.n}:${bc.value}`)
      .join(', ');
    
    const baseCase = `{${formattedBaseCases}}`;
  
    // Validate input
    const isValidFormula = validateFormula(formula);
    const isValidBaseCase = validateBaseCase(baseCase);
    const isValidN = validateN(n);
  
    if (!isValidFormula || !isValidBaseCase || !isValidN) {
      setError('Invalid input. Please enter a valid recursive statement.');
      setLoading(false);
      return;
    }
  
    setError('');
    const startTime = performance.now();
        
    try {
      // Log the request for debugging
      console.log("Sending request with:", { formula, baseCase, n });
      
      const result = await solveRecursion(formula, baseCase, n);
      console.log("Raw API result:", result);
      
      // Handle if result is already an object
      let parsedResult;
      if (typeof result === 'string') {
        try {
          parsedResult = JSON.parse(result);
        } catch (parseErr) {
          console.error("JSON parsing error:", parseErr);
          // If parsing fails, use the raw result
          parsedResult = { success: false, error: "Invalid result format" };
        }
      } else {
        parsedResult = result;
      }
      
      console.log("Processed result:", parsedResult);
      
      // Check if the response contains an error
      if (!parsedResult.success && parsedResult.error) {
        setError(`Calculation error: ${parsedResult.error}`);
        
        trackResults(
          { formula, baseCase, n },
          parsedResult,
          performance.now() - startTime
        );
      } else {
        setOutput(parsedResult);
        
        trackResults(
          { formula, baseCase, n },
          parsedResult,
          performance.now() - startTime
        );
      }
    } catch (err) {
      // Log the full error object for debugging
      console.error("Error in recursion solver:", err);
      
      // Track failed execution with networking/unexpected error
      trackResults(
        { formula, baseCase, n },
        { success: false, error: err.message || 'Unknown error' },
        performance.now() - startTime
      );
      
      setError(`API error: ${err.message || 'An unexpected error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const validateFormula = (input) => {
    // Regex to validate the recursive formula (e.g., 2 * f(n-1) + 1)
    const formulaRegex = /^[0-9+\-*/() f(n-\d)]+$/;
    return formulaRegex.test(input);
  }

  const validateBaseCase = (input) => {
    // Regex to validate the base case input (e.g., "0:1, 1:2")
    const baseCaseRegex = /^\{(\d+:\d+(\.\d+)?)(,\s*\d+:\d+(\.\d+)?)*\}$/;
    return baseCaseRegex.test(input);
  }

  const validateN = (input) => {
    // Regex to validate the value of n (e.g., 5)
    const nRegex = /^\d+$/;
    return nRegex.test(input);
  }

  const renderOutput = () => {
    if (!output) return "Output will be displayed here!";
    
    try {
      // Handle both string and object data formats
      const result = typeof output === 'string' ? JSON.parse(output) : output;
      
      // Format the result object into human-readable output
      if (result.success && result.results) {
        // Extract entries and sort them numerically by the n value in f(n)
        const entries = Object.entries(result.results);
        
        // Sort by extracting the numeric value from keys like "f(n)" or "n"
        entries.sort((a, b) => {
          // Extract numeric part from keys like "f(3)" -> 3
          const numA = parseInt(a[0].match(/\d+/)?.[0] || a[0]);
          const numB = parseInt(b[0].match(/\d+/)?.[0] || b[0]);
          return numA - numB;
        });
        
        // Format the sorted entries
        const steps = entries
          .map(([key, value]) => `${key} = ${value}`)
          .join('\n');
        
        return (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {steps}
          </pre>
        );
      } else if (result.error) {
        // Handle error messages from the backend
        return `Error: ${result.error}`;
      } else {
        // Fallback for other formats
        return JSON.stringify(result, null, 2);
      }
    } catch (e) {
      // If parsing fails, return the raw string
      console.error("Error rendering output:", e);
      return String(output);
    }
  };

  return (
    <SolverPage
      title="Recursive Definitions Solver"
      topic="Recursive Definitions"
      description="This tool helps you solve recursive definitions."
      paragraphs={[
        "A recursive definition is a way of defining a function or a sequence in terms of itself. It consists of base cases and recursive cases. The base cases provide the initial values, and the recursive cases define the values in terms of previous values.",
        "In this solver, you can enter your recursive formula, base cases, and the value of n to calculate. The solver will generate the values of the recursive function in terms of the recursive formula and base cases.",
        "Enter your recursive definition below to generate its values and analyze its properties!"
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

export default RecursiveDefinitions;