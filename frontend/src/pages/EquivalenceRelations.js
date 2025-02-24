import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner } from 'grommet';
import { solveEquivalenceRelations } from '../api';
import ReportFooter from '../components/ReportFooter';
import HomeButton from '../components/HomeButton';
import Background from '../components/Background';

/*
* Name: EquivalenceRelations.js
* Author: Parker Clark
* Description: Solver page for equivalence relations.
*/

const EquivalenceRelations = () => {
  const [set, setSet] = React.useState('');
  const [relation, setRelation] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');

    // Validate input
    const isValidSet = validateSet(set);
    const isValidRelation = validateRelation(relation, set);
     
    if (!isValidRelation || !isValidSet) {
      setError('Invalid input. Please enter a valid relation/set.');
      setLoading(false);
      return;
    }

    setError('');
    try {
      
      // Do some conversion to display any backend errors
      let result = await solveEquivalenceRelations(set, relation);

      // Parse result if it is a string
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }
      
      // Check if there is an error key in the result
      const errorKey = Object.keys(result).find(key => key.toLowerCase().includes('error'));
      console.log(errorKey);
      if (errorKey) {
        setError(result[errorKey]);
      } else {
        setOutput(result);
      }
    } catch (err) {
      console.log(err);
      setError('An error occurred while analyzing the closure axioms.');
    } finally {
      setLoading(false);
    }
  };

  // Validate that set conforms to format
  const validateSet = (input) => {

    // Tests if input is in the form {a, b, c, 23}
    const setRegex = /^\{(\s*[a-zA-Z0-9]+\s*,)*\s*[a-zA-Z0-9]+\s*\}$/;
    return setRegex.test(input);
  };

  // Validate that relation conforms to format
  const validateRelation = (input, set) => {

    // Tests if input is in the form {(a, b), (23, c)}
    const relationRegex = /^\{(\s*\(\s*[a-zA-Z0-9]+\s*,\s*[a-zA-Z0-9]+\s*\)\s*,)*\s*\(\s*[a-zA-Z0-9]+\s*,\s*[a-zA-Z0-9]+\s*\)\s*\}$/;
    if (!relationRegex.test(input)) {
      return false;
    }
    
    // Checks if all elements in the relation are in the set
    const setElements = set.replace(/[{}]/g, '').split(/\s*,\s*/);
    const relationElements = input.replace(/[{}()]/g, '').split(/\s*,\s*/);
  
    return relationElements.every(element => setElements.includes(element));
  };

  // Pretty print the output
  const renderOutput = () => {
    if (!output) {
      return "Output will be displayed here!";
    }

    // Parse out json object and return out elements one by one
    return (
      <Box>
        {Object.entries(output).map(([key, value]) => (
          <Text key={key}>{`${key}: ${value}`}</Text>
        ))}
      </Box>
    );
  };

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
            Equivalence Relations
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
            <Box margin={{bottom : "small" }}>
              <TextInput 
                placeholder="Example: Enter your set here (e.g., {a, b, c, 23})"
                value={set}
                onChange={(event) => setSet(event.target.value)}
              />
            </Box>
            <Box margin={{top : "small" }}>
              <TextInput 
                placeholder="Example: Enter your relation here (e.g., {(a, b), (23, c)})"
                value={relation}
                onChange={(event) => setRelation(event.target.value)}
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
            <Text weight="bold">
              Output:
            </Text>
            <Box align="center" justify="center" pad={{"vertical":"small"}} background={{"color":"light-3"}} round="xsmall">
              <Text>
                {renderOutput()}
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

export default EquivalenceRelations;