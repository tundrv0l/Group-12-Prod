import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner } from 'grommet';
import { solveWarshallsAlgorithm } from '../api';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';
import HomeButton from '../components/HomeButton';

/*
* Name: WarshallsAlgorithm.js
* Author: Parker Clark
* Description: Solver page for solving Warhsall's Algorithm problems.
*/

const WarshallsAlgorithm = () => {
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
      setError('Invalid input. Please enter a valid expression.');
      setLoading(false);
      return;
    }

    setError('');
    try {
      const result = await solveWarshallsAlgorithm(input);
      setOutput(result);
    } catch (err) {
      setError('An error occurred while generating the solution.');
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
          <Box align="start" style={{ position: 'absolute', top: 0, left: 0, padding: '10px', background: 'white', borderRadius: '8px' }}>
            <HomeButton />
          </Box>
          <Box align="center" justify="center" pad={{ vertical: 'medium' }}>
            <Text size="xxlarge" weight="bold">
            Warhsall's Algorithm Solver
            </Text>
          </Box>
          <Box align="center" justify="center">
            <Text size="large" margin="none" weight={500}>
              Topic: Directed Graphs, Binary Relations, and Warhsall's Algorithm
            </Text>
          </Box>
          <Box align="center" justify="start" direction="column" cssGap={false} width='large'>
            <Text margin={{"bottom":"small"}} textAlign="center">
            This tool helps you analyze graphs using Warshall's Algorithm in discrete mathematics.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            Warshall's Algorithm is used to find the transitive closure of a directed graph. The transitive closure of a graph is a measure of which vertices are reachable from other vertices. This algorithm is useful in various applications such as finding the reachability of nodes in a network.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            In Warshall's Algorithm, we start with the adjacency matrix of the graph. The algorithm iteratively updates the matrix to reflect the reachability of vertices. If there is a path from vertex i to vertex j through vertex k, the algorithm updates the matrix to indicate that vertex j is reachable from vertex i.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            By analyzing graphs using Warshall's Algorithm, you can understand the reachability and connectivity of different nodes in a graph. This is useful in various applications such as network analysis, algorithm design, and optimization problems. This tool allows you to input a graph and explore its transitive closure using Warshall's Algorithm.
            </Text>
            <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
            Enter your graph below to generate and analyze its transitive closure using Warshall's Algorithm!
            </Text>
          </Box>
          <Card width="large" pad="medium" background={{"color":"light-1"}}>
            <CardBody pad="small">
              <TextInput 
                placeholder="Example: Enter your tree here (e.g., [1, 2, 3, 4, 5, 6, 7])"
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
      </Box>
    </Page>
  );
};

export default WarshallsAlgorithm;