import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, CardFooter, Button, Spinner } from 'grommet';
import { solveBooleanMatrices } from '../api';
import ReportFooter from '../components/ReportFooter';
import Background from '../components/Background';
import MatrixTable from '../components/MatrixTable';
import MatrixToolbar from '../components/MatrixToolbar';

/*
* Name: BooleanMatrices.js
* Author: Parker Clark
* Description: Solver page for boolean matrices.
* Note: Each matrix will be parsed as a 2D array of strings.
*/

const BooleanMatrices = () => {
  const [matrix1, setMatrix1] = React.useState([['']]);
  const [matrix2, setMatrix2] = React.useState([['']]);
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSolve = async () => {
    // Empty output and error messages
    setLoading(true);
    setOutput('');
    setError('');

    // Validate input
    if (!validateMatrices(matrix1, matrix2)) {
        setError('Invalid input. Please ensure both matrices only contain only 0s and 1s.');
        setLoading(false);
        return;
    }

    setError('');
    try {
      const result = await solveBooleanMatrices(matrix1, matrix2);
      setOutput(result);
    } catch (err) {
      setError('An error occurred while generating the matrix.');
    } finally {
      setLoading(false);
    }
  }

  const validateMatrices = (matrix1, matrix2) => {
    if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
      return false;
    }
    const isValid = matrix => matrix.every(row => row.every(cell => cell === '0' || cell === '1'));
    return isValid(matrix1) && isValid(matrix2);
  };

  return (
    <Page>
      <Background />
      <Box align="center" justify="center" pad="medium" background="white" style={{ position: 'relative', zIndex: 1, width: '55%', margin: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <PageContent align="center" skeleton={false}>
          <Box align="center" justify="center" pad={{ vertical: 'medium' }}>
            <Text size="xxlarge" weight="bold">
              Boolean Matrices
            </Text>
          </Box>
          <Box align="center" justify="center">
            <Text size="large" margin="none" weight={500}>
              Topic: Matrices
            </Text>
          </Box>
          <Box align="center" justify="start" direction="column" cssGap={false} width='large'>
            <Text margin={{"bottom":"small"}} textAlign="center">
            This tool helps you generate and analyze Boolean matrices.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            A Boolean matrix is a matrix with entries from the Boolean domain {"{0, 1}"}. This tool allows you to input a Boolean matrix and perform various operations such as matrix multiplication, transposition, and finding the transitive closure.
            </Text>
            <Text margin={{"bottom":"small"}} textAlign="start" weight="normal">
            By analyzing Boolean matrices, you can solve problems in graph theory, computer science, and combinatorics. This tool allows you to input a Boolean matrix and explore its properties through different operations.
            </Text>
            <Text textAlign="start" weight="normal" margin={{"bottom":"medium"}}>
            Enter your Boolean matrix below to generate and analyze its properties!
            </Text>
          </Box>
          <Card width="large" pad="medium" background={{"color":"light-1"}}>
            <CardBody pad="small">
                <MatrixTable label="Boolean Matrix 1" matrix={matrix1} setMatrix={setMatrix1} />
                <MatrixTable label="Boolean Matrix 2" matrix={matrix2} setMatrix={setMatrix2} />
            </CardBody>
            <MatrixToolbar matrix1={matrix1} setMatrix1={setMatrix1} matrix2={matrix2} setMatrix2={setMatrix2} />
            <CardFooter align="center" direction="row" flex={false} justify="center" gap="medium" pad={{"top":"small"}}>
              <Button label={loading ? <Spinner /> : "Solve"} onClick={handleSolve} disabled={loading} />
            </CardFooter>
          </Card>
          {error && (
            <Text color="status-critical" margin={{"top":"small"}}>
              {error}
            </Text>
          )}
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

export default BooleanMatrices;