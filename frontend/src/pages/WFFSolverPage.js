import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button } from 'grommet';
import { solveWFF  } from '../api';
import ReportFooter from '../components/ReportFooter';

/*
* Name: WFFSolverPage.js
* Author: Parker Clark
* Description: Solver page for the WFF to Truth Table.
*/

const WFFSolverPage = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSolve = async () => {

    // Empty output and error messages
    setOutput('');
    setError('');

    // Validate input
    const isValid = validateInput(input);
    if (!isValid) {
      setError('Invalid input. Please enter a valid logical statement.');
      return;
    }

    setError('');
    const result = await solveWFF(input);
    setOutput(result);
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
            WFF to Truth Table Solver
          </Text>
        </Box>
        <Box align="center" justify="center">
          <Text size="large" margin="none" weight={500}>
            Topic: Statement And Tautologies
          </Text>
        </Box>
        <Box align="center" justify="start" direction="column" cssGap={false}>
          <Text margin={{"bottom":"small"}} textAlign="center">
            This tool helps you work with well-formed formulas (wffs) and truth tables.
          </Text>
          <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            A WFF is a valid expression in propositional logic that is constructed using logical operators (like AND, OR, NOT, IMPLIES) and propositions (like P, Q, R). These formulas strictly adhere to the syntax rules of logic, making them suitable for mathematical reasoning.
          </Text>
          <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            A truth table is a systematic way to list all possible truth values for a given logical expression. It shows how the truth value of the entire formula depends on the truth values of its components. Truth tables are especially useful for verifying tautologies (statements that are always true) or contradictions (statements that are always false).
          </Text>
          <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
            Enter your logical statement below to generate its truth table and analyze its properties!
          </Text>
        </Box>
        <Card width="large" pad="medium" background={{"color":"light-1"}}>
          <CardBody pad="small">
            <TextInput 
              placeholder="Example: Enter your formula here (e.g., P -> Q)"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            {error && <Text color="status-critical">{error}</Text>}
          </CardBody>
          <CardFooter align="center" direction="row" flex={false} justify="center" gap="medium" pad={{"top":"small"}}>
            <Button label="Solve" onClick={handleSolve} />
          </CardFooter>
        </Card>
        <Card width="large" pad="medium" background={{"color":"light-2"}} margin={{"top":"medium"}}>
          <CardBody pad="small">
            <Text weight="bold">
              Output:
            </Text>
            <Box align="center" justify="center" pad={{"vertical":"small"}} background={{"color":"light-3"}} round="xsmall">
              <Text style={{whiteSpace: 'pre-wrap'}}>
                {output ? output : "Output will be displayed here!"}
              </Text>
            </Box>
          </CardBody>
        </Card>
        <ReportFooter />
      </PageContent>
    </Page>
  );
};

export default WFFSolverPage;