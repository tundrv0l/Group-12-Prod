import React from 'react';
import { Box, Text, Button } from 'grommet';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { solveOrderOfMagnitude } from '../api';
import { useDiagnostics } from '../hooks/useDiagnostics';
import SolverPage from '../components/SolverPage';
import PolynomialInput from '../components/PolynomialInput';
import LatexLine from '../components/LatexLine';

/*
* Name: OrderOfMagnitude.js
* Author: Parker Clark, Jacob Warren
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

  const fillWithZero = () => {
      const SAMPLE_ORDER = "0";
      const SAMPLE_COEFFICIENTS = ["12"];
      const SAMPLE_COEFFICIENTS2 = ["1.5"];
    setOrder(SAMPLE_ORDER);
    setCoefficients(SAMPLE_COEFFICIENTS);
    setCoefficients2(SAMPLE_COEFFICIENTS2);
    setUseLog(false);
    setUseRoot(false);
  };

  const fillWithTwo = () => {
      const SAMPLE_ORDER = "2";
      const SAMPLE_COEFFICIENTS = ["2", "3", "1"];
      const SAMPLE_COEFFICIENTS2 = ["1", "0", "0"];
    setOrder(SAMPLE_ORDER);
    setCoefficients(SAMPLE_COEFFICIENTS);
    setCoefficients2(SAMPLE_COEFFICIENTS2);
    setUseLog(false);
    setUseRoot(false);
  };

  const fillWithFour = () => {
      const SAMPLE_ORDER = "4";
      const SAMPLE_COEFFICIENTS = ["3.2", "0", "2", "-3", "1"];
      const SAMPLE_COEFFICIENTS2 = ["0.5", "3", "1", "-1", "12"];
    setOrder(SAMPLE_ORDER);
    setCoefficients(SAMPLE_COEFFICIENTS);
    setCoefficients2(SAMPLE_COEFFICIENTS2);
    setUseLog(false);
    setUseRoot(false);
  };

  const fillWithBigConstant = () => {
      const SAMPLE_ORDER = "2";
      const SAMPLE_COEFFICIENTS = ["2", "3", "154344"];
      const SAMPLE_COEFFICIENTS2 = ["1", "0", "0"];
    setOrder(SAMPLE_ORDER);
    setCoefficients(SAMPLE_COEFFICIENTS);
    setCoefficients2(SAMPLE_COEFFICIENTS2);
    setUseLog(false);
    setUseRoot(false);
  };

  const fillWithBigLeading = () => {
      const SAMPLE_ORDER = "2";
      const SAMPLE_COEFFICIENTS = ["2424", "3", "4"];
      const SAMPLE_COEFFICIENTS2 = ["1", "0", "0"];
    setOrder(SAMPLE_ORDER);
    setCoefficients(SAMPLE_COEFFICIENTS);
    setCoefficients2(SAMPLE_COEFFICIENTS2);
    setUseLog(false);
    setUseRoot(false);
  };

  const fillWithRoot = () => {
      const SAMPLE_ORDER = "2";
      const SAMPLE_COEFFICIENTS = ["2424", "3", "4"];
      const SAMPLE_COEFFICIENTS2 = ["1", "0", "0"];
    setOrder(SAMPLE_ORDER);
    setCoefficients(SAMPLE_COEFFICIENTS);
    setCoefficients2(SAMPLE_COEFFICIENTS2);
    setUseLog(false);
    setUseRoot(true);
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Order of Magnitude Analysis:
        </Text>
        <Text margin={{ top: "xsmall" }}>
          To use this tool:
        </Text>
        <Text>1. Set the polynomial order (highest power of n)</Text>
        <Text>2. Enter coefficients for each term in both polynomials</Text>
        <Text>3. Click Analyze to compare their asymptotic behavior</Text>
        
        <Box margin={{ top: 'medium' }} align="center">
          <Button 
            label="Fill with Order 0" 
            onClick={fillWithZero} 
            primary 
            size="small"
            border={{ color: 'black', size: '2px' }}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
          />
          <Button 
            label="Fill with Order 2" 
            onClick={fillWithTwo} 
            primary 
            size="small"
            border={{ color: 'black', size: '2px' }}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
          />
          <Button 
            label="Fill with Order 4" 
            onClick={fillWithFour} 
            primary 
            size="small"
            border={{ color: 'black', size: '2px' }}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
          />
          <Button 
            label="Fill with Large Constant" 
            onClick={fillWithBigConstant} 
            primary 
            size="small"
            border={{ color: 'black', size: '2px' }}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
          />
          <Button 
            label="Fill with Large Leading Coefficient" 
            onClick={fillWithBigLeading} 
            primary 
            size="small"
            border={{ color: 'black', size: '2px' }}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
          />
          <Button 
            label="Fill with Rooted" 
            onClick={fillWithRoot} 
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
      description="This tool helps you prove that two polynomials have the same order of magnitude."
      DescriptionComponent={Description}
      InfoText = {Info}
      InputComponent={Input}
      input_props={null}
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      render_output={renderOutput}
    />
  );
};

const Description = () => {
    return (
      <div style={{textAlign: "left"}}>
        <LatexLine
          string="Two functions, $f$ and $f$, mapping to and from the non-negative real numbers have the same order of magnitude ($f=\Theta(g))\iff\exists n_0,c_1,c_2\in\mathbb{R}^+$ such that $\forall x\geq n_0$, $c_1g(x)\geq f(x)\geq c_2g(x)$." 
        />
        <Text weight="bold" margin={{"bottom": "small"}}>Polynomials</Text>
        <LatexLine
          string="This solver proves that two polynomials (with positive leading coefficients) of the same order are of the same order of magnitude." 
        />
        <LatexLine
          string="Enter your $f$ and $g$ below, both can be placed inside a square root with the check box."
        />
      </div>
    ); 
}

export default OrderOfMagnitude;
