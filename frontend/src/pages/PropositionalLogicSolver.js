import React from 'react';
import ReportFooter from '../components/ReportFooter';
import { Page, PageContent, PageHeader, Box, Text, Card, CardBody, TextInput, CardFooter, Button } from 'grommet';
import { solvePropositionalLogic  } from '../api';

/*
* Name: PropositionalLogicSolver.js
* Author: Parker Clark
* Description: Solver page for the propositional logic solver.
*/

const PropositionalLogicSolver = () => {
  const [hypotheses, setHypotheses] = React.useState('');
  const [conclusion, setConclusion] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSolve = async () => {

    // Validate input
    const isValidHypotheses = validateInput(hypotheses);
    const isValidConclusion = validateInput(conclusion);

    if (!isValidHypotheses || !isValidConclusion) {
      setError('Invalid input. Please enter a valid propositional logic statement.');
      return;
    }

    setError('');
    const result = await solvePropositionalLogic({ hypotheses, conclusion });
    setOutput(result);
  }

  const validateInput = (input) => {
    const wffRegex = /^[A-Z](\s*->\s*[A-Z])?$/;
    return wffRegex.test(input);
  }

  return (
    <Page>
      <PageContent align="center" skeleton={false}>
        <PageHeader title="Propositional Logic Solver" level="2" margin="small" />
        <Box align="center" justify="center">
          <Text size="large" margin="none" weight={500}>
            Topic: Propositional Logic
          </Text>
        </Box>
        <Box align="center" justify="start" direction="column" cssGap={false}>
          <Text margin={{"bottom":"small"}} textAlign="center">
            This tool helps you analyze propositional logic statements and their truth values
          </Text>
          <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            Propositional logic is a branch of logic that deals with statements that can be either true or false. These statements are combined using logical operators such as AND, OR, NOT, and IMPLIES to form more complex expressions. By evaluating these expressions, we can determine their validity, consistency, and logical relationships.
          </Text>
          <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            A truth table systematically lists all possible truth values of a logical expression based on its components. This helps in verifying logical equivalences, identifying contradictions, and understanding how different logical statements interact.
          </Text>
          <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
            Enter your propositional logic hypotheses and conclusion below to generate its validity.
          </Text>
        </Box>
        <Card width="large" pad="medium" background={{"color":"light-1"}}>
          <CardBody pad="small">
            <Box margin={{bottom : "small" }}>
              <TextInput 
                placeholder="Example: Enter your hypotheses here (e.g., A > B)"
                value={hypotheses}
                onChange={(event) => setHypotheses(event.target.value)}
              />
            </Box>
            <Box margin={{top : "small" }}>
              <TextInput 
                placeholder="Example: Enter your conclusion here (e.g., B)"
                value={conclusion}
                onChange={(event) => setConclusion(event.target.value)}
              />
            </Box>
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

export default PropositionalLogicSolver;