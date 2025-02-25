import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner } from 'grommet';
import { solveOrderOfMagnitude } from '../api';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';
import HomeButton from '../components/HomeButton';

/*
* Name: OrderOfMagnitude.js
* Author: Parker Clark
* Description: Solver page for analyzing order of magnitude.
* TODO: Add latex parsing for this page.
*/

const OrderOfMagnitude = () => {
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
      setError('Invalid input. Please enter a valid number.');
      setLoading(false);
      return;
    }

    setError('');
    try {
      const result = await solveOrderOfMagnitude(input);
      setOutput(result);
    } catch (err) {
      setError('An error occurred while generating the Order of Magnitdue.');
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
              Order Of Magnitude
            </Text>
          </Box>
          <Box align="center" justify="center">
            <Text size="large" margin="none" weight={500}>
              Topic: Order of Magnitude
            </Text>
          </Box>
          <Box align="center" justify="start" direction="column" cssGap={false} width='large'>
            <Text margin={{"bottom":"small"}} textAlign="center">
            This tool helps you analyze the order of magnitude in discrete mathematics.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            The order of magnitude is a way to express the scale or size of a value in powers of ten. This tool allows you to input a number and determine its order of magnitude.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            By analyzing the order of magnitude, you can understand the relative size of numbers and compare values on a logarithmic scale. This is useful in various applications such as scientific notation, data analysis, and computational complexity. This tool allows you to input a number and explore its order of magnitude.
            </Text>
            <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
            Enter your number below to generate and analyze its order of magnitude!
            </Text>
          </Box>
          <Card width="large" pad="medium" background={{"color":"light-1"}}>
            <CardBody pad="small">
              <TextInput 
                placeholder="Example: Enter your number here (e.g., 3)"
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

export default OrderOfMagnitude;