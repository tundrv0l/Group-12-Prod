import React, { useRef } from 'react';
import { Box, Text, Button } from 'grommet';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { solveMasterTheorem } from '../api';
import { useDiagnostics } from '../hooks/useDiagnostics';
import SolverPage from '../components/SolverPage';
import MasterTheoremInput from '../components/MasterTheoremInput';
import LatexLine from '../components/LatexLine';

/*
* Name: MasterTheorem.js
* Author: Parker Clark, Jacob Warren
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
  
  const fillWithEdge = () => {
      const SAMPLE_A = "1";
      const SAMPLE_B = "2";
      const SAMPLE_C = "0";
    setA(SAMPLE_A);
    setB(SAMPLE_B);
    setC(SAMPLE_C);
  };

  const fillWithOne = () => {
      const SAMPLE_A = "4";
      const SAMPLE_B = "2";
      const SAMPLE_C = "3";
    setA(SAMPLE_A);
    setB(SAMPLE_B);
    setC(SAMPLE_C);
  };

  const fillWithTwo = () => {
      const SAMPLE_A = "4";
      const SAMPLE_B = "2";
      const SAMPLE_C = "2";
    setA(SAMPLE_A);
    setB(SAMPLE_B);
    setC(SAMPLE_C);
  };

  const fillWithThree = () => {
      const SAMPLE_A = "13";
      const SAMPLE_B = "2";
      const SAMPLE_C = "1";
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
        <Text>• a ≥ 1: Number of subproblems</Text>
        <Text>• b {">"} 1: Factor by which problem size is reduced</Text>
        <Text>• f(n) = n^c: Cost of dividing and combining solutions</Text>

        <Text margin={{ top: "medium" }} weight="bold">The three cases for classification:</Text>
        <Text>• Case 1: If log<sub>b</sub>(a) {"<"} c, then T(n) = Θ(n<sup>c</sup>)</Text>
        
        <Text>• Case 2: If log<sub>b</sub>(a) = c, then T(n) = Θ(n<sup>c</sup> log n)</Text>
        
        <Text>• Case 3: If log<sub>b</sub>(a) {">"} c, then T(n) = Θ(n<sup>log<sub>b</sub>(a)</sup>)</Text>

        <Box margin={{ top: 'medium' }} align="center">
          <Button 
            label="Fill with Edge Case" 
            onClick={fillWithEdge} 
            primary 
            size="small"
            border={{ color: 'black', size: '2px' }}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
          />
          <Button 
            label="Fill with Case 1" 
            onClick={fillWithOne} 
            primary 
            size="small"
            border={{ color: 'black', size: '2px' }}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
          />
          <Button 
            label="Fill with Case 2" 
            onClick={fillWithTwo} 
            primary 
            size="small"
            border={{ color: 'black', size: '2px' }}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
          />
          <Button 
            label="Fill with Case 3" 
            onClick={fillWithThree} 
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
      description="This tool applies the Master Theorem to recurrence relations."
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
          string="The Master Theorem is defined for recurrence relations of the form $$ S(1)\geq0 $$$$ S(n)=aS(\frac{n}{b})+n^c(\forall n\geq 2)$$ where $n=b^m$ for some $m\in\mathbb{Z}$, $a\in\mathbb{Z}_{\geq1}$, $b\in\mathbb{Z}_{>1}$, and $c\in\mathbb{R}_{>0}$." 
        />
        <LatexLine
          string="Enter your values for $a$, $b$, and $c$ below."
        />
      </div>
    ); 
}

export default MasterTheorem;
