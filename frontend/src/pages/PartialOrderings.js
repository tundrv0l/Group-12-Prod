import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner } from 'grommet';
import { solvePartialOrderings } from '../api';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';

/*
* Name: PartialOrderings.js
* Author: Parker Clark
* Description: Solver page for partial orderings.
*/

const PartialOrderings = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');

    // Validate input
    const isValid = validateInput(input);
    if (!isValid) {
      setError('Invalid input. Please enter a valid relations.');
      setLoading(false);
      return;
    }

    setError('');
    try {
      const result = await solvePartialOrderings(input);
      setOutput(result);
    } catch (err) {
      setError('An error occurred while analyzing the partial ordering.');
    } finally {
      setLoading(false);
    }
  }

  const validateInput = (input) => {
    // TODO: Change regex here based on input pattern
    const wffRegex = /^[A-Z](\s*->\s*[A-Z])?$/;
    return wffRegex.test(input);
  }

  return (
    <Page>
      <Background />
      <PageContent align="center" skeleton={false}>
        <Box align="center" justify="center" pad={{ vertical: 'medium' }}>
          <Text size="xxlarge" weight="bold">
            Partial Orderings
          </Text>
        </Box>
        <Box align="center" justify="center">
          <Text size="large" margin="none" weight={500}>
            Topic: Relations
          </Text>
        </Box>
        <Box align="center" justify="start" direction="column" cssGap={false} width='large'>
          <Text margin={{"bottom":"small"}} textAlign="center">
            This tool helps you analyze partial orderings in a relation.
          </Text>
          <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            A partial ordering is a binary relation over a set that is reflexive, antisymmetric, and transitive. This tool allows you to test if a given relation is a partial ordering and to explore its properties.
          </Text>
          <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            By analyzing partial orderings, you can identify hierarchical structures within sets, find minimal and maximal elements, and determine the comparability of elements. This tool allows you to input a relation and apply partial ordering analysis to generate the corresponding results.
          </Text>
          <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
            Enter your relation below to analyze partial orderings and explore the results!
          </Text>
        </Box>
        <Card width="large" pad="medium" background={{"color":"light-1"}}>
          <CardBody pad="small">
            <TextInput 
              placeholder="Example: Enter your relation here (e.g., {(1, 2), (2, 3)})"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            {error && <Text color="status-critical">{error}</Text>}
          </CardBody>
          <CardFooter align="center" direction="row" flex={false} justify="center" gap="medium" pad={{"top":"small"}}>
            <Button label={loading ? <Spinner /> : "Solve"} onClick={handleSolve} disabled={loading} />
          </CardFooter>
        </Card>
        <Card width="large" pad="medium" background={{"color":"light-2"}} margin={{"top":"medium"}}>
          <CardBody pad="small">
            <Text weight="bold">
              Output:
            </Text>
            <Box align="center" justify="center" pad={{"vertical":"small"}} background={{"color":"light-3"}} round="xsmall">
              <Text>
                {output ? JSON.stringify(output) : "Output will be displayed here!"}
              </Text>
            </Box>
          </CardBody>
        </Card>
        <ReportFooter />
      </PageContent>
    </Page>
  );
};

export default PartialOrderings;