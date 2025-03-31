import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner } from 'grommet';
import { solveCompositions } from '../api';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';
import HomeButton from '../components/HomeButton';
import { useDiagnostics } from '../hooks/useDiagnostics';

/*
* Name: CompositionOfPermutations.js
* Author: Parker Clark
* Description: Solver page for ganalyzing permutations of a cycle.
*/

const CompositionOfPermutations = () => {
  const [setOne, setSetOne] = React.useState('');
  const [setTwo, setSetTwo] = React.useState('');
  const [perm, setPerm] = React.useState('');
  const [comp, setComp] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { trackResults } = useDiagnostics("COMPOSITION_PERMUTATIONS");

  const handleSolve = async () => {
    // Reset states
    setLoading(true);
    setPerm('');
    setComp('');
    setError('');

    // Start timing for performance tracking
    const startTime = performance.now();
  
    // Validate input
    const isValid = validateInput(setOne, setTwo);
    if (!isValid) {
      setError('Invalid input. Please enter 2 positive integers.');
      setLoading(false);
      return;
    }
    
    const isBigger = validateSizes(setOne, setTwo);
    if (!isBigger) {
      setError('Invalid input. Please ensure that the set has more items than is being selected.');
      setLoading(false);
      return;
    }
  
    try {
      const result = await solveCompositions({ setOne, setTwo });
  
      // If result is a JSON string, parse it
      const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
  
      // Ensure it contains the expected properties
      if (parsedResult && parsedResult.perm !== undefined && parsedResult.comp !== undefined) {
        setPerm(parsedResult.perm); // Assign the correct perm value
        setComp(parsedResult.comp); // Assign the correct comp value
      } else {
        setError('Invalid response structure.');
      }

    } catch (err) {

      trackResults(
        { setOne: setOne },
        { setTwo: setTwo },
        {error: err.message || "Error solving Composition of Permutations"},
        performance.now() - startTime
      )

      setError('An error occurred while generating the composition.');
    } finally {
      setLoading(false);
    }
  };

  const validateInput = (setOne, setTwo) => {
    // Convert inputs to numbers
    const numOne = Number(setOne);
    const numTwo = Number(setTwo);
  
    // Check if both values are positive integers
    return Number.isInteger(numOne) && Number.isInteger(numTwo) && numOne > 0 && numTwo > 0;
  };

  const validateSizes = (setOne, setTwo) => {
    return Number(setOne) >= Number(setTwo);
  }

  return (
    <Page>
      <Background />
      <Box align="center" justify="center" pad="medium" background="white" style={{ position: 'relative', zIndex: 1, width: '55%', margin: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <PageContent align="center" skeleton={false}>
          <Box align="start" style={{ position: 'absolute', top: 0, left: 0, padding: '10px', background: 'white', borderRadius: '8px' }}>
            <HomeButton />
          </Box>
          <Box align="center" justify="center" pad={{ vertical: 'medium' }}>
            <Text size="xxlarge" weight="bold">
              Composition Of Permutations
            </Text>
          </Box>
          <Box align="center" justify="center">
            <Text size="large" margin="none" weight={500}>
              Topic: Functions
            </Text>
          </Box>
          <Box align="center" justify="start" direction="column" cssGap={false} width='large'>
            <Text margin={{"bottom":"small"}} textAlign="center">
            When given a set of numbers, you can form multiple permutations by selecting a few or all of the elements from the set. A permutation refers to an arrangement of elements in a specific order. For example, consider the set (1,2,3). If we want to select 2 elements at a time, there are 6 possible permutations:
            </Text>
            <ul>
              <li>(1 2)</li>
              <li>(1 3)</li>
              <li>(2 1)</li>
              <li>(2 3)</li>
              <li>(3 1)</li>
              <li>(3 2)</li>
            </ul>
            <Text margin={{"bottom":"small"}} textAlign="center" weight="normal">
            The formula for calculating the number of permutations of r elements from a set of n elements is:
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="center" weight="normal">
              P(n, r) = n!/(n - r)!
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="center" weight="normal">
            Where n! (n factorial) is the product of all positive integers up to n, and r is the number of elements you want to arrange.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="center" weight="normal">
            In contrast, a combination refers to selecting elements where the order does not matter. For example, in combinations, (1 3) is considered the same as (3 1). The formula to calculate the number of combinations of r elements chosen from a set of n elements is:
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="center" weight="normal">
              C(n, r) = n!/((n - r)!(r!))
            </Text>
            <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
            Using the tool provided on this website, you can easily calculate the number of permutations and combinations. Simply enter the total number of elements in your set and the number of elements you want to select per permutation or combination. The tool will then compute the results for you based on the formulas above.
            </Text>
          </Box>
          <Card width="large" pad="medium" background={{"color":"light-1"}}>
            <CardBody pad="small">
            <Box margin={{bottom : "small" }}>
                <Text>
                  Set size:
                </Text>
                <TextInput 
                  placeholder="Example: Enter the size of your first set here (e.g., 5)"
                  value={setOne}
                  onChange={(event) => setSetOne(event.target.value)}
                />
              </Box>
              <Box margin={{top : "small" }}>
                <Text>
                  Number of elements:
                </Text>
                <TextInput 
                  placeholder="Example: Enter the number of elements (e.g., 3)"
                  value={setTwo}
                  onChange={(event) => setSetTwo(event.target.value)}
                />
              </Box>
              {error && <Text color="status-critical">{error}</Text>}
            </CardBody>
            <CardFooter align="center" direction="row" flex={false} justify="center" gap="medium" pad={{"top":"small"}}>
              <Button label={loading ? <Spinner /> : "Solve"} onClick={handleSolve} disabled={loading} />
            </CardFooter>
          </Card>
          <Card width="large" pad="medium" background={{"color":"light-2"}} margin={{"top":"medium"}}>
            <CardBody pad="small">
              <Box justify="start" direction="column" cssGap={false} width='large'>
                <Text weight="bold" textAlign="start" margin={{"bottom":"medium"}}>
                  Output:
                </Text>
                <Text>
                  Number of Permutations:
                </Text>
                <Box align="center" justify="center" pad={{"vertical":"small"}} background={{"color":"light-3"}} margin={{"bottom":"medium"}}>
                <Text>
                  {perm
                    ? Number(perm) >= 1e9
                      ? Number(perm).toExponential(3) // Use scientific notation with 3 decimal places
                      : Number(perm).toLocaleString() // Use standard number format with commas
                    : "Output will be displayed here!"}
                </Text>
                </Box>
                <Text>
                  Number of Combinations:
                </Text>
                <Box align="center" justify="center" pad={{"vertical":"small"}} background={{"color":"light-3"}} round="xsmall">
                <Text>
                  {comp
                    ? Number(comp) >= 1e9
                      ? Number(comp).toExponential(3) // Use scientific notation with 3 decimal places
                      : Number(comp).toLocaleString() // Use standard number format with commas
                    : "Output will be displayed here!"}
                </Text>
                </Box>
              </Box>
            </CardBody>
          </Card>
          <ReportFooter />
        </PageContent>
      </Box>
    </Page>
  );
};

export default CompositionOfPermutations;