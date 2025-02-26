import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner } from 'grommet';
import { solveWeightedGraphs } from '../api';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';
import HomeButton from '../components/HomeButton';

/*
* Name: WeightedGraphRepresentations.js
* Author: Parker Clark
* Description: Solver page for weighted graphs.
*/

const WeightedGraphRepresentations = () => {
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
      const result = await solveWeightedGraphs(input);
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
            Weighted Graph Representations
            </Text>
          </Box>
          <Box align="center" justify="center">
            <Text size="large" margin="none" weight={500}>
              Topic: Graphs And Their Representations
            </Text>
          </Box>
          <Box align="center" justify="start" direction="column" cssGap={false} width='large'>
            <Text margin={{"bottom":"small"}} textAlign="center">
            This tool helps you analyze weighted graphs in discrete mathematics.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            Weighted graphs are a type of graph where each edge has an associated numerical value, called a weight. These weights can represent various quantities such as distances, costs, or capacities, depending on the context of the problem.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            In a weighted graph, the vertices (or nodes) are connected by edges that have weights. This allows for more detailed modeling of real-world problems, such as finding the shortest path in a transportation network, optimizing network flows, or analyzing social networks.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            By analyzing weighted graphs, you can understand the relationships and connections between different entities, taking into account the significance of the connections. This is useful in various applications such as network analysis, algorithm design, and optimization problems. This tool allows you to input a weighted graph and explore its properties and representations.
            </Text>
            <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
            Enter your weighted graph below to generate and analyze its properties using this tool!
            </Text>
          </Box>
          <Card width="large" pad="medium" background={{"color":"light-1"}}>
            <CardBody pad="small">
              <TextInput 
                placeholder="Example: Enter your graph here (e.g., {A, B, C}, {(A, B), (B, C), (C, A)})"
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

export default WeightedGraphRepresentations;