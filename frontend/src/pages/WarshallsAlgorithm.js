import React, { useState } from 'react';
import { Box, Text, Button } from 'grommet';
import { solveWarshallsAlgorithm } from '../api';
import SolverPage from '../components/SolverPage';
import MatrixTable from '../components/MatrixTable';
import MatrixToolbar from '../components/WarshallToolbar';
import MatrixOutput from '../components/MatrixOutput';
import { useDiagnostics } from '../hooks/useDiagnostics';
/*
* Name: WarshallsAlgorithm.js
* Author: Parker Clark and Mathias Buchanan
* Description: Solver page for solving Warhsall's Algorithm problems.
*/

const WarshallsAlgorithm = () => {
  const [isCaveman, setIsCaveman] = useState(false);
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
        <MatrixToolbar matrix={matrix} setMatrix={setMatrix} combined addRemoveBoth />
      </Box>
    );
  };

  const betterText = [
    "Warshall's Algorithm is used to compute the transitive closure of a directed graph. The transitive closure determines which vertices are reachable from others, making the algorithm especially useful for applications like network analysis and pathfinding.",
    "The algorithm operates on the graph's adjacency matrix, iteratively updating it to reflect reachability. If a path exists from vertex i to vertex j through vertex k, the matrix is updated to show that j is reachable from i.",
    "While not the most efficient algorithm due to its time complexity of O(n³), Warshall's Algorithm is one of the simplest to understand. It systematically processes each row of the matrix: for each intermediate vertex, it updates the reachability information by combining (OR-ing) relevant rows.",
    "Enter your graph below to generate and analyze its transitive closure using Warshall's Algorithm!"
  ];

  const cavemanText = [
    "Soldiers! Comrades! Warriors of intellect and will! Today, we march not with rifles in hand—but with the sharpest weapon known to mankind: knowledge. And our battlefield? The graph. The map of connections. The unseen threads that bind every node to another in this complex world.",
  "In our arsenal stands a mighty tool—Warshall’s Algorithm! It is no ordinary tactic. No, this algorithm is the key to understanding reachability within any directed structure. When we unleash it, we uncover the true paths—those that lie hidden—showing us which vertices can be reached, and which stand alone. It is a weapon forged for network domination, for the unrelenting pursuit of pathfinding perfection.",
  "Warriors, it does not waver. It works tirelessly on the graph’s very soul—its adjacency matrix. With calculated precision, it scans, it updates, it conquers. If there exists a path from node i to node j through node k, the matrix shall reflect it—without mercy, without hesitation.",
  "Yes, it may not be the fastest—its steps may number in the cubes of n—but let no one question its clarity or simplicity. Warshall’s Algorithm does not stumble. It advances row by row, vertex by vertex, OR-ing together possibilities and building an empire of understanding from the ashes of chaos.",
  "Now I say to you—enter your graph! Feed it into the machine of reason! Watch as the transitive closure emerges from the fog of war!",
  "Victory at all costs!"
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

    // Check to make sure all cells are either 0 or 1
    const isValidMatrix = matrix.every(row => row.every(cell => cell === '0' || cell === '1'));

    return isSquareMatrix && isValidMatrix;
  };

  const toggleCaveman = () => {
    setIsCaveman(!isCaveman);
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
      paragraphs={isCaveman ? cavemanText : betterText}
      InfoText={Info}
      InputComponent={Input}
      input_props={null}
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      render_output={renderOutput}
      topRightButton={toggleCaveman}
    />
  );
};

export default WarshallsAlgorithm;