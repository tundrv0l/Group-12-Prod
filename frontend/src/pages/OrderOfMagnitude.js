import React, { useState } from 'react';
import { Box, Text, Button, Collapsible } from 'grommet';
import { CircleInformation } from 'grommet-icons';
import { solveOrderOfMagnitude } from '../api';
import SolverPage from '../components/SolverPage';
import PolynomialInput from '../components/PolynomialInput';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { useDiagnostics } from '../hooks/useDiagnostics';

/*
* Name: OrderOfMagnitude.js
* Author: Parker Clark
* Description: Solver page for analyzing order of magnitude.
*/

const OrderOfMagnitude = () => {

  // Default order on page to 2
  const [order, setOrder] = React.useState('2');
  const [coefficients, setCoefficients] = React.useState([]);
  const [coefficients2, setCoefficients2] = React.useState([]);
  const [useLog, setUseLog] = React.useState(false);
  const [useRoot, setUseRoot] = React.useState(false);
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Reference to the PolynomialInput field for validation
  const polynomialInputRef = React.useRef(null);

  // Track diagnostics
  const { trackResults } = useDiagnostics("ORDER_OF_MAGNITUDE");

  // Sample data for the "Fill with Sample" button
  const SAMPLE_ORDER = "2";
  const SAMPLE_COEFFICIENTS = ["2", "3", "1"];  // 2n² + 3n + 1
  const SAMPLE_COEFFICIENTS2 = ["1", "0", "0"];  // n²

  const fillWithSample = () => {
    setOrder(SAMPLE_ORDER);
    setCoefficients(SAMPLE_COEFFICIENTS);
    setCoefficients2(SAMPLE_COEFFICIENTS2);
    setUseLog(false);
    setUseRoot(false);
  };

  // Create a custom input component that includes the help collapsible
  const OrderMagnitudeInputWithHelp = () => {
    const [showHelp, setShowHelp] = useState(false);
    
    return (
      <Box>
        <Box direction="row" align="start" justify="start" margin={{ bottom: 'small' }} style={{ marginLeft: '-8px', marginTop: '-8px' }}>
          <Button icon={<CircleInformation />} onClick={() => setShowHelp(!showHelp)} plain />
        </Box>
        
        <Collapsible open={showHelp}>
          <Box pad="small" background="light-2" round="small" margin={{ bottom: "medium" }} width="large">
            <Text weight="bold" margin={{ bottom: "xsmall" }}>
              Order of Magnitude Analysis:
            </Text>
            <Text>
              Order of magnitude helps compare the asymptotic growth rates of functions as their inputs become very large.
            </Text>
            <Text margin={{ top: "xsmall" }}>
              To use this tool:
            </Text>
            <Text>1. Set the polynomial order (highest power of n)</Text>
            <Text>2. Enter coefficients for each term in both polynomials</Text>
            <Text>3. Click Analyze to compare their asymptotic behavior</Text>
            
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

        <PolynomialInput
          order={order}
          setOrder={setOrder}
          coefficients={coefficients}
          setCoefficients={setCoefficients}
          coefficients2={coefficients2} 
          setCoefficients2={setCoefficients2}
          useLog={useLog}
          setUseLog={setUseLog}
          useRoot={useRoot}
          setUseRoot={setUseRoot}
          setError={setError}
          ref={polynomialInputRef}
          label1="First Polynomial (f)"
          label2="Second Polynomial (g)"
        />
      </Box>
    );
  };

  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');

    // Validate inputs using the reference to the component's validation method
    if (polynomialInputRef.current && !polynomialInputRef.current.validate()) {
      setLoading(false);
      return;
    }

    setError('');

    // Define a 'payload' or input 'collection' to call API.
    const payload = {
      order: parseInt(order, 10),
      coefficients1: coefficients.map(c => parseFloat(c)),
      coefficients2: coefficients2.map(c => parseFloat(c)),
      useLog,
      useRoot
    };


    // Start timing for performance tracking
    const startTime = performance.now();

    try {
      
      // Call the backend solver with the payload
      const result = await solveOrderOfMagnitude(payload);

      // Track successful execution
      trackResults(
        payload, // Input data
        result, // Success result
        performance.now() - startTime // Execution time
      );

      setOutput(result);
    } catch (err) {

      trackResults(
        {payload: payload}, // Input data
        { error: err.message || 'Unknown error' }, // Error result
        performance.now() - startTime // Execution time
      );

      setError('An error occurred while calculating the Order of Magnitude.');

    } finally {
      setLoading(false);
    }
  };

  const renderOutput = () => {
    // If no output, return a default message
    if (!output) {
      return "Output will be displayed here!";
    }
  
    try {
      // Parse JSON if it's a string
      let result;
      if (typeof output === 'string') {
        try {
          result = JSON.parse(output);
        } catch (e) {
          // If not valid JSON, use the string directly
          result = output;
        }
      } else {
        result = output;
      }
  
      // Extract the LaTeX content
      let latexContent;
      if (typeof result === 'object' && result !== null && result.Result) {
        // Format the equation with proper LaTeX delimiters
        latexContent = `$${result.Result}$`;
      } else {
        // Fallback to string representation
        latexContent = `$${typeof result === 'string' ? result : JSON.stringify(result)}$`;
      }
      console.log(latexContent);
      // Return the LaTeX component directly (not wrapped in Text)
      return <Latex>{latexContent}</Latex>;
    } catch (err) {
      console.error("Error rendering LaTeX:", err);
      return `Error: ${err.message}`;
    }
  };

  return (
    <SolverPage
      title="Order Of Magnitude"
      topic="Order of Magnitude"
      description="This tool helps you analyze the order of magnitude in discrete mathematics."
      paragraphs={[
        "The order of magnitude is a way to express the scale or size of a value in powers of ten. This tool allows you to input a polynomial function and determine its order of magnitude.",
        "By analyzing the order of magnitude, you can understand the relative size of functions and compare their growth rates. This is useful in various applications such as algorithm analysis and computational complexity.",
        "Enter your polynomial function below to analyze its order of magnitude!"
      ]}
      InputComponent={OrderMagnitudeInputWithHelp}
      input_props={null}
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      render_output={renderOutput}
    />
  );
};

export default OrderOfMagnitude;