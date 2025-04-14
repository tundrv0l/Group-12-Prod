import React from 'react';
import { Box, Text, Button } from 'grommet';
import { solveWarshallsAlgorithm } from '../api';
import SolverPage from '../components/SolverPage';
import MatrixTable from '../components/MatrixTable';
import WarshallToolbar from '../components/WarshallToolbar';
import MatrixOutput from '../components/MatrixOutput';
import { useDiagnostics } from '../hooks/useDiagnostics';
/*
* Name: WarshallsAlgorithm.js
* Author: Parker Clark and Mathias Buchanan
* Description: Solver page for solving Warhsall's Algorithm problems.
*/

const MAX_MATRIX_DIMENSION = 10;

const WarshallsAlgorithm = () => {
  const [matrix, setMatrix] = React.useState([['0']]);
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Add diagnostics
  const { trackResults } = useDiagnostics("WARSHALLS_ALGORITHM");

  // Sample matrix for "Fill with Sample" button
  const SAMPLE_MATRIX = [
    ['0', '1', '0', '1'],
    ['0', '0', '1', '0'],
    ['0', '0', '0', '1'],
    ['0', '0', '0', '0']
  ];
  
  const fillWithSample = () => {
    setMatrix(SAMPLE_MATRIX);
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Warshall's Algorithm:
        </Text>
        <Text>
          To input a matrix for Warshall's algorithm:
        </Text>
        <Text margin={{ top: "xsmall" }}>
          • Enter a square adjacency matrix with only 0s and 1s
        </Text>
        <Text>
          • 1 represents an edge from vertex i to vertex j
        </Text>
        <Text>
          • 0 represents no edge between vertices
        </Text>
        <Text margin={{ top: "xsmall" }}>
          The algorithm will compute the transitive closure of the graph, showing all possible paths between vertices.
        </Text>

        <Text margin={{ top: "medium" }} color="status-warning">
          Important: Matrices are limited to {MAX_MATRIX_DIMENSION}×{MAX_MATRIX_DIMENSION} dimensions for performance reasons.
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
      <Box style={{ marginBottom: '20px' }}>
        <MatrixTable label="Adjacency Matrix" matrix={matrix} setMatrix={setMatrix} />
        <WarshallToolbar matrix={matrix} setMatrix={setMatrix} combined addRemoveBoth maxDimension={MAX_MATRIX_DIMENSION} />
      </Box>
    );
  };

  const getNormalParagraphs = () => [
    "Warshall's Algorithm is used to compute the transitive closure of a directed graph. The transitive closure determines which vertices are reachable from others, making the algorithm especially useful for applications like network analysis and pathfinding.",
    "The algorithm operates on the graph's adjacency matrix, iteratively updating it to reflect reachability. If a path exists from vertex i to vertex j through vertex k, the matrix is updated to show that j is reachable from i.",
    "While not the most efficient algorithm due to its time complexity of O(n³), Warshall's Algorithm is one of the simplest to understand. It systematically processes each row of the matrix: for each intermediate vertex, it updates the reachability information by combining (OR-ing) relevant rows.",
    "Enter your graph below to generate and analyze its transitive closure using Warshall's Algorithm!"
  ];

  const getCavemanParagraphs = () => [
    "This tool analyzes graphs using Warshall's Algorithm which is definitely what any advanced starship crew would use unless you're using the Force to guide you through graph theory which honestly makes more sense than some ancient Vulcan logic no offense to logic but like come on",
    "Warshall's Algorithm calculates the transitive closure of a directed graph which means it figures out which planets no nodes are reachable from others like plotting warp paths or maybe charting connections in the Jedi Council archive except this doesn't involve any holocrons or dilithium just matrices so stop yelling",
    "You start with an adjacency matrix then go row by row column by column whatever it updates itself to show if there's a path from i to j through k and yes that sounds like a transporter buffer protocol but it's also literally how droids map their target reach no it's math pure math no Force ghosts involved just logic and OR operations",
    "It's got a time complexity of O(n³) which isn't ideal but neither is getting tractor-beamed into a cube or accidentally jumping into a binary star system so it's fine it works okay each step combines reachability info like merging nav charts or scanning for subspace anomalies or mind-merging with an ancient being that lives inside a matrix metaphorically not literally although that would be cool too"
  ];

  const handleSolve = async () => {
    setLoading(true);
    setOutput('');
    setError('');

    // Validate input
    if (!validateMatrices(matrix)) {
      setError('Invalid input. Please ensure the matrix only contains 0s and 1s and is square.');
      setLoading(false);
      return;
    }

    const startTime = performance.now();
    
    try {
      const result = await solveWarshallsAlgorithm(matrix);
      const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
      
      // Track successful execution with timing
      trackResults(
        { matrix }, // Input data
        parsedResult, // Result data
        performance.now() - startTime // Execution time in ms
      );
      
      setOutput(parsedResult);
    } catch (err) {
      // Track failed execution with timing
      trackResults(
        { matrix },
        { error: err.message || 'Unknown error' },
        performance.now() - startTime
      );
      
      setError('An error occurred while solving Warshall\'s algorithm.');
    } finally {
      setLoading(false);
    }
  };

  const validateMatrices = (matrix) => {
    // Check for empty matrix
    if (!matrix || matrix.length === 0) {
      return false;
    }
    
    // Check if the matrix is square
    const columns = matrix[0].length;
    const isSquareMatrix = matrix.length === columns;
    
    // Check if the matrix exceeds maximum dimensions
    if (matrix.length > MAX_MATRIX_DIMENSION || columns > MAX_MATRIX_DIMENSION) {
      setError(`Matrix exceeds maximum dimension of ${MAX_MATRIX_DIMENSION}×${MAX_MATRIX_DIMENSION}.`);
      return false;
    }

    // Check to make sure all cells are either 0 or 1
    const isValidMatrix = matrix.every(row => row.every(cell => cell === '0' || cell === '1'));

    return isSquareMatrix && isValidMatrix;
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
      title="Warshall's Algorithm Solver"
      topic="Directed Graphs and Binary Relations"
      description="This tool helps you analyze graphs using Warshall's Algorithm, a fundamental concept in discrete mathematics."
      paragraphs={getNormalParagraphs()}
      alternative_paragraphs={getCavemanParagraphs()}
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

export default WarshallsAlgorithm;