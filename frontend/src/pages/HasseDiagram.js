import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner, Collapsible } from 'grommet';
import { solveHasseDiagram } from '../api';
import { CircleInformation } from 'grommet-icons';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';
import HomeButton from '../components/HomeButton';
import { useDiagnostics } from '../hooks/useDiagnostics';

/*
* Name: HasseDiagram.js
* Author: Parker Clark
* Description: Solver page for hasse diagrams.
*/

const HasseDiagram = () => {
  const [set, setSet] = React.useState('');
  const [relation, setRelation] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(false);

  const { trackResults } = useDiagnostics("HASSE_DIAGRAM");

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

    // Start timing for performance tracking
    const startTime = performance.now();

    try { 
      // Do some conversion to display any backend errors
      let result = await solveHasseDiagram(set, relation);

      // Parse result if it is a string
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }
      
      // Check if there is an error key in the result
      const errorKey = Object.keys(result).find(key => key.toLowerCase().includes('error'));
      console.log(errorKey);
      if (errorKey) {

        // Track failed execution
        trackResults(
          { set, relation }, // Input data
          { error: result[errorKey] }, // Error result
          performance.now() - startTime // Execution time
        );
        setError(result[errorKey]);

      } else {

        // Track successful execution
        trackResults(
          { set, relation }, // Input data
          result, // Success result
          performance.now() - startTime // Execution time
        );
        setOutput(result);

        setOutput(result["Hasse Diagram"]);
      }
    } catch (err) {
      console.log(err);

      // Track exception
      trackResults(
        { set, relation }, // Input data
        { error: err.message || 'Unknown error' }, // Error result
        performance.now() - startTime // Execution time
      );

      setError('An error occurred while generating the Hasse Diagram.');
    } finally {
      setLoading(false);
    }
  };

  // Validate that set conforms to format
  const validateSet = (input) => {

    // Allow empty set {}
    if (input.trim() === '{}') {
      return true;
    }

    // Tests if input is in the form {a, b, c, 23}
    const setRegex = /^\{(\s*[a-zA-Z0-9]+\s*,)*\s*[a-zA-Z0-9]+\s*\}$/;
    return setRegex.test(input);
  };

  // Validate that relation conforms to format
  const validateRelation = (input, set) => {

    // Allow empty relation {}
    if (input.trim() === '{}') {
      return true;
    }

    // Tests if input is in the form {(a, b), (23, c)}
    const relationRegex = /^\{(\s*\(\s*[a-zA-Z0-9]+\s*,\s*[a-zA-Z0-9]+\s*\)\s*,)*\s*\(\s*[a-zA-Z0-9]+\s*,\s*[a-zA-Z0-9]+\s*\)\s*\}$/;
    if (!relationRegex.test(input)) {
      return false;
    }

    // If set is empty, no relation can be valid (except empty relation, already handled)
    if (set.trim() === '{}') {
      return false;
    }
    
    // Checks if all elements in the relation are in the set
    const setElements = set.replace(/[{}]/g, '').split(/\s*,\s*/).filter(element => element.trim() !== '');
    const relationElements = input.replace(/[{}()]/g, '').split(/\s*,\s*/).filter(element => element.trim() !== '');
  
    return relationElements.every(element => setElements.includes(element));
  };
  // Convert base64 image string to image element
  const renderOutput = () => {
    if (!output) {
      return "Output will be displayed here!";
    }

    // Parse out json object and return out elements one by one
    return (
      <Box>
        <img src={`data:image/png;base64,${output}`} alt="Hasse Diagram" />
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
              Hasse Diagram Generator
            </Text>
          </Box>
          <Box align="center" justify="center">
            <Text size="large" margin="none" weight={500}>
              Topic: Relations
            </Text>
          </Box>
          <Box align="center" justify="start" direction="column" cssGap={false} width='large'>
            <Text margin={{"bottom":"small"}} textAlign="center">
              This tool helps you generate and analyze Hasse diagrams.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
              A Hasse diagram is a graphical representation of a finite partially ordered set, where an edge between two elements indicates that one element covers the other. This tool allows you to input a partial ordering and generate its corresponding Hasse diagram.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
              By analyzing Hasse diagrams, you can visualize the hierarchical structure of a partial ordering, identify minimal and maximal elements, and understand the comparability of elements. This tool allows you to input a relation and generate the Hasse diagram to explore its properties.
            </Text>
            <Text textAlign="start" weight="normal" margin={{"bottom":"small"}}>
              Enter your relation below to generate and analyze the Hasse diagram!
            </Text>
            <Text color="#17A2B8" margin={{"bottom":"small"}} justify="center" align="center">
              Please allow a few seconds for the diagram to generate.
            </Text>
          </Box>
          <Card width="large" pad="medium" background={{"color":"light-1"}}>
            <CardBody pad="small">
              <Box margin={{bottom : "small" }}><Box direction="row" align="start" justify="start" margin={{ bottom: 'small' }} style={{ marginLeft: '-8px', marginTop: '-8px' }}>
                <Button icon={<CircleInformation />} onClick={() => setShowHelp(!showHelp)} plain />
              </Box>
              <Collapsible open={showHelp}>
                <Box pad="small" background="light-2" round="small" margin={{ bottom: "medium" }} width="large">
                  <Text>
                    To input a set, use the following format:
                  </Text>
                  <Text>
                    <strong>{'{a,b,c}'}</strong>
                  </Text>
                  <Text>
                    To input a relation, use the following format:
                  </Text>
                  <Text>
                    <strong>{'{(a,a),(b,b),(c,c),(a,b),(b,c),(a,c)}'}</strong>
                  </Text>
                  <Text style={{ fontStyle: 'italic' }}>
                    The set and relation must form a partial ordering, that is, they must be reflexive, antisymmetric, and transitive.
                  </Text>
                </Box>
              </Collapsible>
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

export default HasseDiagram;
