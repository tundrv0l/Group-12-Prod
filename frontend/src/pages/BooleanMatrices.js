import React from 'react';
import { Box, Text, Button, Select } from 'grommet';
import { solveBooleanMatrices } from '../api';
import MatrixOutput from '../components/MatrixOutput';
import SolverPage from '../components/SolverPage';
import MatrixTable from '../components/MatrixTable';
import MatrixToolbar from '../components/MatrixToolbar';
import { useDiagnostics } from '../hooks/useDiagnostics';

/*
* Name: BooleanMatrices.js
* Author: Parker Clark
* Description: Solver page for boolean matrices.
* Note: Each matrix will be parsed as a 2D array of strings.
*/

const MAX_MATRIX_DIMENSION = 10;

const BooleanMatrices = () => {
  const [matrix1, setMatrix1] = React.useState([['0']]);
  const [matrix2, setMatrix2] = React.useState([['0']]);
  const [operation, setOperation] = React.useState('MEET/JOIN');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { trackResults } = useDiagnostics("BOOLEAN_MATRICES");

  const SAMPLE_MATRIX1 = [
    ['1', '0', '1'],
    ['0', '1', '0'],
    ['1', '1', '0']
  ];
  
  const SAMPLE_MATRIX2 = [
    ['0', '1', '0'],
    ['1', '1', '1'],
    ['0', '0', '1']
  ];

  const fillWithSample = () => {
    setMatrix1(SAMPLE_MATRIX1);
    setMatrix2(SAMPLE_MATRIX2);
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Boolean Matrix Operations:
        </Text>
        <Text>
          Boolean matrices contain only 0s and 1s and are used for representing relations, graphs, and logical operations.
        </Text>
        <Text margin={{ top: "xsmall" }}>
          This tool supports two types of operations:
        </Text>
        <Text>• MEET/JOIN: Element-wise operations where Meet (∧) is the minimum and Join (∨) is the maximum of corresponding elements</Text>
        <Text>• PRODUCT: Boolean matrix multiplication with "OR" of "AND" products</Text>

        <Text margin={{ top: "xsmall" }} color="status-warning">
          Note: Matrices are limited to {MAX_MATRIX_DIMENSION}×{MAX_MATRIX_DIMENSION} dimensions.
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

    const ensureMaxSize = (matrix) => {
      // Limit the number of rows
      if (matrix.length > MAX_MATRIX_DIMENSION) {
        return matrix.slice(0, MAX_MATRIX_DIMENSION).map(row => 
          row.slice(0, MAX_MATRIX_DIMENSION)
        );
      }
      
      // Limit the number of columns
      return matrix.map(row => 
        row.length > MAX_MATRIX_DIMENSION ? row.slice(0, MAX_MATRIX_DIMENSION) : row
      );
    };

    // Create wrapped versions of the setMatrix functions
    const setMatrix1WithLimit = (newMatrix) => {
      setMatrix1(ensureMaxSize(newMatrix));
    };

    const setMatrix2WithLimit = (newMatrix) => {
      setMatrix2(ensureMaxSize(newMatrix));
    };

    return (
      <>
        <MatrixTable label="Boolean Matrix 1" matrix={matrix1} setMatrix={setMatrix1WithLimit} />
        <MatrixToolbar matrix={matrix1} setMatrix={setMatrix1WithLimit} maxDimension={MAX_MATRIX_DIMENSION} />
        <MatrixTable label="Boolean Matrix 2" matrix={matrix2} setMatrix={setMatrix2WithLimit} />
        <MatrixToolbar matrix={matrix2} setMatrix={setMatrix2WithLimit} maxDimension={MAX_MATRIX_DIMENSION} />
        
        <Box align="center" justify="center" pad={{ vertical: 'small' }}>
          <Select
            options={['MEET/JOIN', 'PRODUCT']}
            value={operation}
            onChange={({ option }) => setOperation(option)}
          />
        </Box>
      </>
    );
  };

  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');

    const validation = validateMatrices(matrix1, matrix2, operation);
    if (!validation.valid) {
      setError(validation.error);
      setLoading(false);
      return;
    }

    setError('');
    
    // Start timing for performance tracking
    const startTime = performance.now();

    try {
      const result = await solveBooleanMatrices(matrix1, matrix2, operation);

      // Tracking results for diagnostics
      trackResults(
        { matrix1: matrix1, matrix2: matrix2, operation: operation },
        result, 
        performance.now() - startTime
      )

      setOutput(result);
    } catch (err) {

      trackResults(
        { matrix1: matrix1, matrix2: matrix2, operation: operation },
        { error: err.message || "Error solving Boolean Matrices" },
        performance.now() - startTime
      );

      setError('An error occurred while generating the matrix.');
    } finally {
      setLoading(false);
    }
  }

  // Replace the validateMatrices function with this improved version:
  const validateMatrices = (matrix1, matrix2, operation) => {

    // Check if matrices contain only 0s and 1s
    if (matrix1.length > MAX_MATRIX_DIMENSION || matrix1[0].length > MAX_MATRIX_DIMENSION) {
      return { valid: false, error: `Matrix 1 exceeds maximum dimension of ${MAX_MATRIX_DIMENSION}×${MAX_MATRIX_DIMENSION}.` };
    }
    
    if (matrix2.length > MAX_MATRIX_DIMENSION || matrix2[0].length > MAX_MATRIX_DIMENSION) {
      return { valid: false, error: `Matrix 2 exceeds maximum dimension of ${MAX_MATRIX_DIMENSION}×${MAX_MATRIX_DIMENSION}.` };
    }

    // Check if matrices contain only 0s and 1s
    const isValidContent = matrix => matrix.every(row => row.every(cell => cell === '0' || cell === '1'));
    
    if (!isValidContent(matrix1)) {
      return { valid: false, error: 'Matrix 1 should only contain 0s and 1s.' };
    }
    
    if (!isValidContent(matrix2)) {
      return { valid: false, error: 'Matrix 2 should only contain 0s and 1s.' };
    }

    // Check dimensions based on operation
    if (operation === 'MEET/JOIN') {
      if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
        return { 
          valid: false, 
          error: 'For MEET/JOIN operations, both matrices must have the same dimensions.' 
        };
      }
    } else if (operation === 'PRODUCT') {
      if (matrix1[0].length !== matrix2.length) {
        return { 
          valid: false, 
          error: 'For PRODUCT operation, the number of columns in Matrix 1 must equal the number of rows in Matrix 2.' 
        };
      }
    }
    
    // If we got here, everything is valid
    return { valid: true };
  };

  const renderOutput = () => {
    if (!output) {
      return "Output will be displayed here.";
    }
    
    try {
      // Parse output if it's a JSON string
      const matrices = typeof output === 'string' ? JSON.parse(output) : output;
      return <MatrixOutput matrices={matrices} />;
    } catch (e) {
      console.error("Error rendering matrix output:", e);
      return "Error rendering matrices.";
    }
  };

  return (
    <SolverPage
      title="Boolean Matrices"
      topic="Matrices"
      description="This tool helps you generate and analyze Boolean matrices."
      paragraphs={[
        "A Boolean matrix is a matrix with entries from the Boolean domain {0, 1}. This tool allows you to input a Boolean matrix and perform various operations such as matrix multiplication, transposition, and finding the transitive closure.",
        "By analyzing Boolean matrices, you can solve problems in graph theory, computer science, and combinatorics. This tool allows you to input a Boolean matrix and explore its properties through different operations.",
        "Enter your Boolean matrix below to generate and analyze its properties!"
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

export default BooleanMatrices;