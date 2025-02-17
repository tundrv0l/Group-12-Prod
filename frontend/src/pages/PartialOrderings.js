import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner } from 'grommet';
import { solveEquivalenceRelations } from '../api';
import ReportFooter from '../components/ReportFooter';

/*
* Name: EquivalenceRelations.js
* Author: Parker Clark
* Description: Solver page for equivalence relations.
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
      const result = await solveEquivalenceRelations(input);
      setOutput(result);
    } catch (err) {
      setError('An error occurred while analyzing the closure axioms.');
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
                This tool helps you analyze equivalence relations.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
                An equivalence relation on a set is a relation that is reflexive, symmetric, and transitive. For example, a relation R on a set A is:
            </Text>
            <Box margin={{"bottom":"small"}} textAlign="start" weight="normal">
                <Text>- Reflexive if every element is related to itself, i.e., (a, a) ∈ R for all a ∈ A.</Text>
                <Text>- Symmetric if for every (a, b) ∈ R, (b, a) ∈ R.</Text>
                <Text>- Transitive if for every (a, b) ∈ R and (b, c) ∈ R, (a, c) ∈ R.</Text>
            </Box>
            <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
                Enter your relation below to analyze its properties and determine if it is an equivalence relation!
            </Text>
        </Box>
        <Card width="large" pad="medium" background={{"color":"light-1"}}>
          <CardBody pad="small">
            <TextInput 
              placeholder="Example: Enter your set notation here (e.g., {(1, 2), (2, 3)})"
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