import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner } from 'grommet';
import { solveRecursion  } from '../api';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';

/*
* Name: RecursiveDefinitions.js
* Author: Parker Clark
* Description: Solver page for solving recursive definitions.
*/

const RecursiveDefinitions = () => {
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
      setError('Invalid input. Please enter a valid recursive statement.');
      setLoading(false);
      return;
    }

    setError('');
    try {
      const result = await solveRecursion(input);
      setOutput(result);
    } catch (err) {
      setError('An error occurred while solving the recursive definition.');
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
      <Box align="center" justify="center" pad="medium" background="white" style={{ position: 'relative', zIndex: 1, width: '55%', margin: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <PageContent align="center" skeleton={false}>
        <Box align="center" justify="center" pad={{ vertical: 'medium' }}>
          <Text size="xxlarge" weight="bold">
            Recursive Definitions Solver
          </Text>
        </Box>
        <Box align="center" justify="center">
          <Text size="large" margin="none" weight={500}>
            Topic: Recursive Definitions
          </Text>
        </Box>
        <Box align="center" justify="start" direction="column" cssGap={false} width={'large'}>
          <Text margin={{"bottom":"small"}} textAlign="center">
            This tool helps you solve recursive definitions.
          </Text>
          <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            A recursive definition is a way of defining a function or a sequence in terms of itself. It consists of base cases and recursive cases. The base cases provide the initial values, and the recursive cases define the values in terms of previous values.
          </Text>
          <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
          By analyzing recursive definitions, we can understand how sequences and functions are constructed and how they behave. This tool allows you to input a recursive definition and generate the corresponding sequence or function values.
          </Text>
          <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
            Enter your recursive definition below to generate its values and analyze its properties!
          </Text>
        </Box>
        <Card width="large" pad="medium" background={{"color":"light-1"}}>
          <CardBody pad="small">
            <TextInput 
              placeholder="Example: Enter your recursive definition here (e.g., a(n) = a(n-1) + 2)"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            {error && <Text color="status-critical">{error}</Text>}
          </CardBody>
          <CardFooter align="center" direction="row" flex={false} justify="center" gap="medium" pad={{"top":"small"}}>
            <Button label={loading ? <Spinner /> : "Solve"} onClick={handleSolve} />
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
      </Box>
    </Page>
  );
};

export default RecursiveDefinitions;