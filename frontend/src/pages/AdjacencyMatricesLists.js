import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner } from 'grommet';
import { solveAdjacencyMatricesLists } from '../api';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';
import HomeButton from '../components/HomeButton';

/*
* Name: AdjacencyMatricesLists.js
* Author: Parker Clark
* Description: Solver page for adjacency matrices and adjacency lists.
*/

const AdjacencyMatricesLists = () => {
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
      const result = await solveAdjacencyMatricesLists(input);
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
              Adjacency Matrices and Adjacency Lists
            </Text>
          </Box>
          <Box align="center" justify="center">
            <Text size="large" margin="none" weight={500}>
              Topic: Graphs And Their Representations
            </Text>
          </Box>
          <Box align="center" justify="start" direction="column" cssGap={false} width='large'>
            <Text margin={{"bottom":"small"}} textAlign="center">
            This tool helps you analyze graphs using adjacency matrices and adjacency lists.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            Adjacency matrices and adjacency lists are two common ways to represent graphs. An adjacency matrix is a 2D array of size VxV where V is the number of vertices in a graph. Each cell in the matrix represents an edge between two vertices. If there is an edge between vertex i and vertex j, the cell at row i and column j will be 1 (or the weight of the edge), otherwise, it will be 0.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            An adjacency list, on the other hand, is an array of lists. The size of the array is equal to the number of vertices. Each element of the array is a list that contains all the vertices that are adjacent to the corresponding vertex. This representation is more space-efficient for sparse graphs.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            By analyzing graphs using adjacency matrices and lists, you can understand the relationships and connections between different entities. This is useful in various applications such as network analysis, algorithm design, and optimization problems. This tool allows you to input a graph and explore its properties and representations.
            </Text>
            <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
            Enter your graph below to generate and analyze its properties using this tool!
            </Text>
          </Box>
          <Card width="large" pad="medium" background={{"color":"light-1"}}>
            <CardBody pad="small">
              <TextInput 
                placeholder="Example: Enter your notation here (e.g., {A, B, C}, {(A, B), (B, C), (C, A)})"
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

export default AdjacencyMatricesLists;