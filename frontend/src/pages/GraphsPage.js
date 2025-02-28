import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner, Select, CheckBox } from 'grommet';
import { solveGraphs } from '../api';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';
import HomeButton from '../components/HomeButton';

/*
* Name: GraphsPage.js
* Author: Parker Clark
* Description: Solver page for graphs
*/

const GraphsPage = () => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [type, setType] = React.useState('UNDIRECTED');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isIsomorphic, setIsIsomorphic] = React.useState(false);
  const [secondInput, setSecondInput] = React.useState('');

  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');

    // Validate input
    const isValid = validateInput(input);
    if (!isValid) {
      setError('Invalid input. Please enter a valid expression.');
      setLoading(false);
      return;
    }

    // Validate second input if isomorphic check is enabled
    if (isIsomorphic) {
      const isValidSecondInput = validateInput(secondInput);
      if (!isValidSecondInput) {
        setError('Invalid second input. Please enter a valid expression.');
        setLoading(false);
        return;
      }
    }


    setError('');
    try {
      const result = await solveGraphs(input, type, isIsomorphic, secondInput);
      setOutput(result);
    } catch (err) {
      setError('An error occurred while generating the graph.');
    } finally {
      setLoading(false);
    }
  }

  const validateInput = (input) => {
    // TODO: Change regex here based on input pattern
    const wffRegex = /^[A-Z](\s*->\s*[A-Z])?$/;
    return wffRegex.test(input);
  }

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
              Graphs
            </Text>
          </Box>
          <Box align="center" justify="center">
            <Text size="large" margin="none" weight={500}>
              Topic: Graphs And Their Representations
            </Text>
          </Box>
          <Box align="center" justify="start" direction="column" cssGap={false} width='large'>
          <Text margin={{"bottom":"small"}} textAlign="center">
            This tool helps you analyze graphs in discrete mathematics.
          </Text>
          <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            Graphs are mathematical structures used to model pairwise relations between objects. A graph is made up of vertices (also called nodes) which are connected by edges. Graphs can be used to represent various real-world problems such as social networks, computer networks, and transportation systems.
          </Text>
          <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            By analyzing graphs, you can understand the relationships and connections between different entities. This is useful in various applications such as network analysis, algorithm design, and optimization problems. This tool allows you to input a graph and explore its properties and representations.
          </Text>
          <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
            Enter your graph below to generate and analyze its properties using this tool!
          </Text>
          </Box>
          <Card width="large" pad="medium" background={{"color":"light-1"}}>
            <CardBody pad="small">
              <TextInput 
                placeholder="Example: Enter your graph here (e.g., {(A, B), (B, C), (C, A)})"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              {isIsomorphic && (
              <Box margin={{ top: 'small' }}>
                <TextInput
                  placeholder="Example: Enter your second graph here (e.g., {(X, Y), (Y, Z), (Z, X)})"
                  value={secondInput}
                  onChange={(event) => setSecondInput(event.target.value)}
                />
              </Box>
            )}
              {error && <Text color="status-critical">{error}</Text>}
            </CardBody>
            <Box align="center" justify="center" pad={{ vertical: 'small' }}>
              <Select
                options={['UNDIRECTED', 'DIRECTED']}
                value={type}
                onChange={({ option }) => setType(option)}
              />
            </Box>
            <Box align="center" justify="center" pad={{ vertical: 'small' }}>
              <CheckBox
                label="Check for Isomorphism"
                checked={isIsomorphic}
                onChange={(event) => setIsIsomorphic(event.target.checked)}
              />
            </Box>
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

export default GraphsPage;