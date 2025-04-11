import React, { useRef } from 'react';
import { Box, Text, Button } from 'grommet';
import { solveMasterTheorem } from '../api';
import SolverPage from '../components/SolverPage';
import MasterTheoremInput from '../components/MasterTheoremInput';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { useDiagnostics } from '../hooks/useDiagnostics';
/*
* Name: MasterTheorem.js
* Author: Parker Clark
* Description: Solver page for analyzing the Master's Theorem.
*/

const MasterTheorem = () => {
  const [a, setA] = React.useState('');
  const [b, setB] = React.useState('');
  const [c, setC] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  // Create a ref to access the validation method
  const inputRef = useRef();

  // Diagnostics tracking
  const { trackResults } = useDiagnostics("MASTER_THEOREM");

  // Sample data for the "Fill with Sample" button
  const SAMPLE_A = "2";
  const SAMPLE_B = "2";
  const SAMPLE_C = "1";
  
  const fillWithSample = () => {
    setA(SAMPLE_A);
    setB(SAMPLE_B);
    setC(SAMPLE_C);
  };

 

  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');

    // Validate inputs using the reference to the component's validation method
    if (inputRef.current && !inputRef.current.validate()) {
      setLoading(false);
      return;
    }

    setError('');

    // Define payload with parameter values
    const payload = {
      a: parseInt(a, 10),
      b: parseInt(b, 10),
      c: parseFloat(c)
    };

    // Start timing for performance tracking
    const startTime = performance.now();

    try {
      const result = await solveMasterTheorem(payload);

      // Track successful execution
      trackResults(
        payload,
        result,
        performance.now() - startTime
      );

      setOutput(result);
    } catch (err) {
      // Track failed execution
      trackResults(
        payload,
        { error: err.message || 'Unknown error' },
        performance.now() - startTime
      );

      setError('An error occurred while analyzing the Master Theorem.');
    } finally {
      setLoading(false);
    }
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          The Master Theorem:
        </Text>
        <Text>
          The Master Theorem is used for solving recurrence relations of the form: T(n) = aT(n/b) + f(n)
        </Text>
        <Text margin={{ top: "xsmall" }}>
          Where:
        </Text>
        <Text>• a ≥ 1: Number of subproblems</Text>
        <Text>• b {">"} 1: Factor by which problem size is reduced</Text>
        <Text>• f(n) = n^c: Cost of dividing and combining solutions</Text>

        <Text margin={{ top: "medium" }} weight="bold">The three cases for classification:</Text>
        <Text>• Case 1: If log<sub>b</sub>(a) {"<"} c, then T(n) = Θ(n<sup>c</sup>)</Text>
        
        <Text>• Case 2: If log<sub>b</sub>(a) = c, then T(n) = Θ(n<sup>c</sup> log n)</Text>
        
        <Text>• Case 3: If log<sub>b</sub>(a) {">"} c, then T(n) = Θ(n<sup>log<sub>b</sub>(a)</sup>)</Text>

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
      <MasterTheoremInput
        ref={inputRef}
        a={a}
        setA={setA}
        b={b}
        setB={setB}
        c={c}
        setC={setC}
        setError={setError}
      />
    );
  };

  // Function to render the output with LaTeX
  const renderOutput = () => {
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
          result = output;
        }
      } else {
        result = output;
      }

      // Extract the LaTeX content
      let latexContent;
      if (typeof result === 'object' && result !== null && result.Result) {
        latexContent = `$${result.Result}$`;
      } else {
        latexContent = `$${typeof result === 'string' ? result : JSON.stringify(result)}$`;
      }

      return <Latex>{latexContent}</Latex>;
    } catch (err) {
      console.error("Error rendering LaTeX:", err);
      return `Error: ${err.message}`;
    }
  };

  return (
    <SolverPage
      title="The Master Theorem"
      topic="Order of Magnitude"
      description="This tool helps you analyze the Master Theorem in discrete mathematics."
      paragraphs={[
        "The Master Theorem provides a straightforward way to determine the asymptotic behavior of recurrence relations that arise in the analysis of divide-and-conquer algorithms. This tool allows you to input a recurrence relation and determine its asymptotic complexity.",
        "By analyzing recurrence relations using the Master Theorem, you can understand the time complexity of algorithms and compare their efficiency. This is useful in various applications such as algorithm design, computational complexity, and performance analysis.",
        "Enter the parameters of your recurrence relation below to analyze its asymptotic complexity using the Master Theorem!"
      ]}
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

export default MasterTheorem;