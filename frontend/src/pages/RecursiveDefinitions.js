import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner } from 'grommet';
import { solveRecursion } from '../api';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';

/*
* Name: RecursiveDefinitions.js
* Author: Parker Clark
* Description: Solver page for solving recursive definitions.
*/

const RecursiveDefinitions = () => {
  const [formula, setFormula] = React.useState('');
  const [baseCaseInput, setBaseCaseInput] = React.useState('');
  const [n, setN] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');

    // Validate input
    const baseCase = `{${baseCaseInput}}`;
    const isValidFormula = validateFormula(formula);
    const isValidBaseCase = validateBaseCase(baseCase);
    const isValidN = validateN(n);

    console.log(isValidFormula, isValidBaseCase, isValidN);
    if (!isValidFormula || !isValidBaseCase || !isValidN) {
      setError('Invalid input. Please enter a valid recursive statement.');
      setLoading(false);
      return;
    }

    setError('');
    try {
      const response = await solveRecursion({ formula, baseCase, n });
      if (response.success) {
        const formattedOutput = formatOutput(response.results);
        setOutput(formattedOutput);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('An error occurred while solving the recursive definition.');
    } finally {
      setLoading(false);
    }
  }

  const validateFormula = (input) => {
    // Regex to validate the recursive formula (e.g., 2 * f(n-1) + 1)
    const formulaRegex = /^[0-9+\-*/() f(n-\d)]+$/;
    return formulaRegex.test(input);
  }

  const validateBaseCase = (input) => {
    // Regex to validate the base case input (e.g., "0:1, 1:2")
    const baseCaseRegex = /^\{(\d+:\d+(\.\d+)?)(,\s*\d+:\d+(\.\d+)?)*\}$/;
    return baseCaseRegex.test(input);
  }

  const validateN = (input) => {
    // Regex to validate the value of n (e.g., 5)
    const nRegex = /^\d+$/;
    return nRegex.test(input);
  }

  const formatOutput = (results) => {
    return Object.entries(results)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
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
              <Box margin={{bottom : "small" }}>
                <TextInput 
                  placeholder="Example: Enter your recursive formula here (e.g., 2 * f(n-1) + 1)"
                  value={formula}
                  onChange={(event) => setFormula(event.target.value)}
                />
              </Box>
              <Box margin={{top : "small" }}>
                <TextInput 
                  placeholder='Example: Enter your base cases here (e.g., "0:1, 1:2")'
                  value={baseCaseInput}
                  onChange={(event) => setBaseCaseInput(event.target.value)}
                />
              </Box>
              <Box margin={{top : "small" }}>
                <TextInput 
                  placeholder="Example: Enter your value of f(n) to calculate (e.g., 5)"
                  value={n}
                  onChange={(event) => setN(event.target.value)}
                />
              </Box>
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
                  {output ? <pre>{output}</pre> : "Output will be displayed here!"}
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