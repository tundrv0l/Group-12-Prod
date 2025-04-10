import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, CardFooter, Button, Spinner, Collapsible } from 'grommet';
import { solvePermutationsCycle } from '../api';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';
import HomeButton from '../components/HomeButton';
import MatrixTable from '../components/PermutationsInput';
import MatrixToolbar from '../components/PermutatinsToolbar';
import PageTopScroller from '../components/PageTopScroller';
import { useDiagnostics } from '../hooks/useDiagnostics';
import { CircleInformation } from 'grommet-icons';

/*
* Name: PermutationsOfACycle.js
* Author: Parker Clark
* Description: Solver page for analyzing permutations of a cycle.
*/

const PermutationsOfACycle = () => {
  const [matrix, setMatrix] = React.useState([['']]);
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(false);

  const { trackResults } = useDiagnostics("PERMUTATIONS_CYCLE");
  
  // Sample permutation data
  const SAMPLE_MATRIX = [
    ['1', '2', '3', '4'],
    ['2', '3', '4', '1']
  ];
  
  const fillWithSample = () => {
    setMatrix(SAMPLE_MATRIX);
  };

  const handleSolvePermutations = async () => {

    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');
    
    // Start timing for performance tracking
    const startTime = performance.now();
  
    // Validate that the matrix has exactly 2 rows
    if (matrix.length !== 2) {
      setLoading(false);
      setError('Matrix must have exactly 2 rows.');
      return;
    }


    const renderOutput = (input) => {
      const results = typeof input === 'string' ? JSON.parse(input) : input;
      return Object.entries(results)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    };
  
    try {
      const result = await solvePermutationsCycle(matrix);
      
      // Tracking results for diagnostics
      trackResults(
        { matrix: matrix },
        result, 
        performance.now() - startTime
      );
  
      // Check if the response contains an error
      if (result.error) {
        throw new Error(result.error);
      }
  
      setOutput(renderOutput(result));
    } catch (err) {
      if (err.message.includes("Not a permutation")) {
        setError("Not a permutation. Please ensure your input is a valid bijection.");
        // Tracking failures for diagnostics
        trackResults(
          { matrix: matrix },
          { error: err.message || "Error solving PERT diagram" },
          performance.now() - startTime
        );
        return;
      } else {
        setError("An error occurred while generating the permutations.");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTopScroller>
    <Page>
      <Background />
      <Box align="center" justify="center" pad="medium" background="white" style={{ position: 'relative', zIndex: 1, width: '55%', margin: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <PageContent align="center" skeleton={false}>
          <Box align="start" style={{ position: 'absolute', top: 0, left: 0, padding: '10px', background: 'white', borderRadius: '8px' }}>
            <HomeButton />
          </Box>
          <Box align="center" justify="center" pad={{ vertical: 'medium' }}>
            <Text size="xxlarge" weight="bold">Permutations of a Cycle</Text>
          </Box>
          <Box align="center" justify="center">
            <Text size="large" margin="none" weight={500}>Topic: Functions</Text>
          </Box>
          <Box align="center" justify="start" direction="column" width='large'>
            <Text textAlign="center" margin={{"bottom":"small"}}>
              This tool helps you analyze permutations of a cycle in discrete mathematics.
            </Text>
            <Text textAlign="start" margin={{"bottom":"small"}} weight="normal">
              A permutation of a cycle is a rearrangement of the elements in a cyclic order. This tool allows you to input a cycle and generate its permutations.
            </Text>
            <Text textAlign="start" margin={{"bottom":"small"}} weight="normal">
              By analyzing permutations of a cycle, you can understand the different ways elements can be ordered within a cycle, which is useful in various applications such as cryptography, coding theory, and combinatorial optimization.
            </Text>
            <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
              Enter your cycle below to generate and analyze its permutations!
            </Text>
          </Box>

          <Card width="large" pad="medium" background={{"color":"light-1"}}>
            <CardBody pad="small">
            <Box direction="row" align="start" justify="start" margin={{ bottom: 'small' }} style={{ marginLeft: '-8px', marginTop: '-8px' }}>
              <Button icon={<CircleInformation />} onClick={() => setShowHelp(!showHelp)} plain />
            </Box>
            <Collapsible open={showHelp}>
              <Box pad="small" background="light-2" round="small" margin={{ bottom: "medium" }} width="large">
                <Text weight="bold" margin={{ bottom: "xsmall" }}>
                  Permutation Cycles:
                </Text>
                <Text>
                  A permutation is a bijective function from a set to itself. To input a permutation:
                </Text>
                <Text margin={{ top: "xsmall" }}>
                  1. First row: Enter the domain elements (e.g., 1 2 3 4)
                </Text>
                <Text>
                  2. Second row: Enter where each element maps to (e.g., 2 3 4 1)
                </Text>
                <Text margin={{ top: "xsmall" }}>
                  The example above represents the cycle (1 2 3 4) where 1→2, 2→3, 3→4, and 4→1.
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
              </Box>
            </Collapsible>
              <MatrixTable label="Input Matrix" matrix={matrix} setMatrix={setMatrix} />
              <MatrixToolbar matrix={matrix} setMatrix={setMatrix} combined addRemoveBoth />
            </CardBody>
            <CardFooter align="center" direction="row" justify="center" gap="medium" pad={{"top":"small"}}>
              <Button label={loading ? <Spinner /> : "Solve Permutations"} onClick={handleSolvePermutations} disabled={loading} />
            </CardFooter>
          </Card>

          {error && (
            <Text color="status-critical" margin={{"top":"small"}}>
              {error}
            </Text>
          )}

          <Card width="large" pad="medium" background={{"color":"light-2"}} margin={{"top":"medium"}}>
            <CardBody pad="small">
              <Text weight="bold">
                Output:
              </Text>
              <Box align="center" justify="center" pad={{"vertical":"small"}} background={{"color":"light-3"}} round="xsmall">
                <Text style={{ whiteSpace: 'pre-wrap' }}>
                  {output ? output: "Output will be displayed here!"}
                </Text>
              </Box>
            </CardBody>
          </Card>

          <ReportFooter />
        </PageContent>
      </Box>
    </Page>
    </PageTopScroller>
  );
};

export default PermutationsOfACycle;
