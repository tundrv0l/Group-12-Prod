import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner} from 'grommet';
import { solveWFF } from '../api';
import ReportFooter from '../components/ReportFooter';
import TruthTable from '../components/TruthTable';

/*
* Name: WFFSolverPage.js
* Author: Parker Clark
* Description: Solver page for the WFF to Truth Table.
*/

const WFFSolverPage = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState(null);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput(null);
    setError('');

    // Validate input
    const isValid = validateInput(input);
    if (!isValid) {
      setError('Invalid input. Please enter a valid logical statement.');
      setLoading(false);
      return;
    }

    setError('');
    
    try {
      const result = await solveWFF(input);
      setOutput(JSON.parse(result));
    } catch (err) {
      setError('An error occurred while solving the WFF.');
    } finally {
      setLoading(false);
    }
  }

  const validateInput = (input) => {
    // AI Generated regex to match well-formed formulas (WFFs) in propositional logic. Includes some other functions to validate proper form.

    // Regular expression to validate WFF general form, including operators, NOT, and parentheses.
    // Will match input like: (A v B) -> (C ^ D), A v B, A -> B, not A, A', (A v not B) ^ (C ^ D'), etc.
    const wffRegex = /^(\(*\s*(not\s*)?[A-Z]('|¬)?\s*\)*(\s*(->|v|\^|<>|V)\s*\(*\s*(not\s*)?[A-Z]('|¬)?\s*\)*)*(\s*(->|v|\^|<>|V)\s*\(*\s*(not\s*)?[A-Z]('|¬)?\s*\)*)*)+|\(\s*.*\s*\)('|¬)$/;
    // Check for balanced parentheses and at least one operator
    const balancedParentheses = (input.match(/\(/g) || []).length === (input.match(/\)/g) || []).length;

    // Check for at least one operator in the input
    const containsOperator = /->|v|\^|<>|V|not/.test(input);

    // Reject single pair of parentheses. Backend doesn't handle input like: (A V B), but does support A V B
    const singlePairParentheses = /^\([^()]*\)$/.test(input);

    // Allow single negated variables like ¬A, A', and not A
    const singleNegatedVariable = /^(not\s*)?[A-Z]('|¬)?$/.test(input);

    // Allow negated expressions with parentheses like (A V B)'
    const negatedExpressionWithParentheses = /^\(\s*.*\s*\)('|¬)$/.test(input);

    return (wffRegex.test(input) && balancedParentheses && containsOperator && !singlePairParentheses) || singleNegatedVariable || negatedExpressionWithParentheses;
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
        <Box align="center" justify="start" direction="column" cssGap={false} width={'large'}>
          <Text margin={{"bottom":"small"}} textAlign="center">
            This tool helps you work with well-formed formulas (wffs) and truth tables.
          </Text>
          <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            A WFF is a valid expression in propositional logic that is constructed using logical operators (like AND, OR, NOT, IMPLIES) and propositions (like A, B, C). These formulas strictly adhere to the syntax rules of logic, making them suitable for mathematical reasoning.
          </Text>
          <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            A truth table is a systematic way to list all possible truth values for a given logical expression. It shows how the truth value of the entire formula depends on the truth values of its components. Truth tables are especially useful for verifying tautologies (statements that are always true) or contradictions (statements that are always false).
          </Text>
          <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
            Enter your logical statement below to generate its truth table and analyze its properties! Use uppercase letters for variables (A-Z), logical operators (AND: ^, OR: v, NOT: not, IMPLIES: -{'>'}, IFF: {'<>'}), and parentheses for grouping. Negate expressions with ' or 'not'.
          </Text>
        </Box>
        <Card width="large" pad="medium" background={{"color":"light-1"}}>
          <CardBody pad="small">
            <TextInput 
              placeholder="Example: Enter your formula here (e.g., A V B)"
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
              {output ? <TruthTable headers={output.headers} rows={output.rows} /> : <Text>Output will be displayed here!</Text>}
            </Box>
          </CardBody>
        </Card>
        <ReportFooter />
      </PageContent>
    </Page>
  );
};

export default WFFSolverPage;