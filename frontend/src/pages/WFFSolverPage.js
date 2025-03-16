import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner, Collapsible, ResponsiveContext} from 'grommet';
import { StatusCritical, StatusGood, CircleInformation } from 'grommet-icons';
import { solveWFF } from '../api';
import ReportFooter from '../components/ReportFooter';
import TruthTable from '../components/TruthTable';
import Background from '../components/Background';
import WFFOperationsTable from '../components/WFFOperationExample';
import HomeButton from '../components/HomeButton';
import { useDiagnostics } from '../hooks/useDiagnostics';

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
  const [showHelp, setShowHelp] = React.useState(false);

  // Initialize diagnostic hook
  const { trackResults } = useDiagnostics("WFF_SOLVER");

  // Wrap input to enable diagnostic tracking
  const handleInput = (event) => {
    const newInput = event.target.value;
    setInput(newInput);
  }

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
  
    const startTime = performance.now();
    
    try {
      const result = await solveWFF(input);
      const parsedResult = JSON.parse(result);
      console.log(parsedResult);
      
      // Track successful execution with timing
      trackResults(
        { formula: input }, // Input data
        parsedResult,       // Result data
        performance.now() - startTime      // Execution time in ms
      );
      
      setOutput(parsedResult);
    } catch (err) {
      // Track failed execution with timing
      trackResults(
        { formula: input },
        { error: err.message || 'Unknown error' },
        performance.now() - startTime
      );
      
      setError('An error occurred while solving the WFF.');
    } finally {
      setLoading(false);
    }
  }
  
  // Function to render the WFF classification
  const renderClassification = (classification, description) => {
    if (!classification) return null;
    
    let color;
    let icon;
    
    switch (classification) {
      case 'tautology':
        color = '#43a047';  // Green
        icon = <StatusGood size="medium" color={color} />;
        break;
      case 'contradiction':
        color = '#e53935';  // Red
        icon = <StatusCritical size="medium" color={color} />;
        break;
      case 'contingency':
        color = '#1565c0';  // Blue
        icon = <CircleInformation size="medium" color={color} />;
        break;
      default:
        color = '#424242';  // Grey
        icon = '?';
    }
  
    return (
      <Box 
        background={{ color: 'light-2' }} 
        pad="medium" 
        margin={{ top: 'medium' }} 
        round="small"
        border={{ color, size: '2px' }}
      >
        <Box direction="row" gap="small" align="center">
          {icon}
          <Text size="large" weight="bold" color={color}>
            {classification.toUpperCase()}
          </Text>
        </Box>
        <Text margin={{ top: 'small' }}>{description}</Text>
      </Box>
    );
  };
  
  const validateInput = (input) => {
    // Regular expression to validate WFF general form, including operators, NOT, parentheses, and brackets.
    // Regex accomodates for symbols used in unicode, keyboard and book format. To see a mapping of this check /backend/solvers/wff_solver.py
    const wffRegex = /^(\(*\[*\s*((not\s*)|¬)?[A-Z]('|′)?\s*\]*\)*(\s*(->|→|v|∨|V|~|S|`|\^|∧|>|<>|4|↔)\s*\(*\[*\s*((not\s*)|¬)?[A-Z]('|′)?\s*\]*\)*\)*)*)+|\(\s*.*\s*\)('|′)?|\[\s*.*\s*\]('|′)?$/;
  
    // Check for balanced parentheses and brackets
    const balancedParentheses = (input.match(/\(/g) || []).length === (input.match(/\)/g) || []).length;
    const balancedBrackets = (input.match(/\[/g) || []).length === (input.match(/\]/g) || []).length;
  
    // Check for at least one operator in the input
    const containsOperator = /->|→|v|∨|V|~|S|`|>|\^|∧|<>|↔|4|not|¬|′/.test(input);
  
    // Reject single pair of parentheses or brackets. Backend doesn't handle input like: (A V B), but does support A V B
    const singlePairParentheses = /^\([^()]*\)$/.test(input);
    // eslint-disable-next-line
    const singlePairBrackets = /^\[[^\[\]]*\]$/.test(input);
  
    // Allow single negated variables like ¬A, A', and not A
    const singleNegatedVariable = /^(not\s*)?[A-Z]('|′|¬)?$/.test(input);
  
    // Allow negated expressions with parentheses or brackets like (A V B)' or [A V B]'
    const negatedExpressionWithParentheses = /^\(\s*.*\s*\)('|′|¬)?$/.test(input);
    const negatedExpressionWithBrackets = /^\[\s*.*\s*\]('|′|¬)?$/.test(input);
  
    return (wffRegex.test(input) && balancedParentheses && balancedBrackets && containsOperator && !singlePairParentheses && !singlePairBrackets) || singleNegatedVariable || negatedExpressionWithParentheses || negatedExpressionWithBrackets;
  };

  return (
    <ResponsiveContext.Consumer>
    {(size) => (
        <Page>
          {/* Only show background on larger screens */}
          {size !== 'small' && <Background />}
          
          <Box 
            align="center" 
            justify="center" 
            pad={size === 'small' ? 'small' : 'medium'} 
            background="white" 
            style={{ 
              position: 'relative', 
              zIndex: 1, 
              width: size === 'small' ? '98%' : size === 'medium' ? '80%' : '55%',
              margin: 'auto', 
              borderRadius: '8px', 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              overflowX: 'hidden' // Prevent horizontal scrolling
            }}
          >
            <PageContent align="center" skeleton={false} pad={size === 'small' ? { horizontal: 'small' } : undefined}>
              {/* Responsive Home Button */}
              <Box 
                align="start" 
                style={{ 
                  position: size === 'small' ? 'relative' : 'absolute', 
                  top: size === 'small' ? undefined : 0, 
                  left: size === 'small' ? undefined : 0, 
                  padding: size === 'small' ? '5px' : '10px',
                  width: size === 'small' ? '100%' : 'auto',
                  marginBottom: size === 'small' ? '8px' : 0,
                  background: 'white', 
                  borderRadius: '8px' 
                }}
              >
                <HomeButton />
              </Box>

              {/* Title - removed duplicate title */}
              <Box 
                align="center" 
                justify="center" 
                pad={{ 
                  vertical: size === 'small' ? 'small' : 'medium',
                  top: size === 'small' ? '0' : undefined
                }}
                width="100%"
              >
                <Text 
                  size={size === 'small' ? 'xlarge' : 'xxlarge'} 
                  weight="bold"
                  textAlign="center"
                >
                  WFF to Truth Table Solver
                </Text>
              </Box>

              {/* Subtitle */}
              <Box align="center" justify="center" margin={{ bottom: size === 'small' ? 'small' : 'medium' }}>
                <Text 
                  size={size === 'small' ? 'medium' : 'large'} 
                  margin="none" 
                  weight={500}
                  textAlign="center"
                >
                  Topic: Statements and Tautologies
                </Text>
              </Box>

              {/* Explanation text - mobile optimized */}
              <Box 
                align="center" 
                justify="start" 
                direction="column" 
                width="100%"
                margin={{ bottom: size === 'small' ? 'small' : 'medium' }}
              >
                <Text 
                  margin={{ bottom: size === 'small' ? 'xsmall' : 'small' }} 
                  textAlign="center" 
                  size={size === 'small' ? 'small' : 'medium'}
                >
                  This tool helps you work with well-formed formulas (wffs) and truth tables.
                </Text>
                <Text 
                  margin={{ bottom: size === 'small' ? 'xsmall' : 'small' }} 
                  textAlign={size === 'small' ? 'start' : 'center'}
                  size={size === 'small' ? 'small' : 'medium'}
                >
                  A WFF is a valid expression in propositional logic that is constructed using logical operators (like AND, OR, NOT, IMPLIES) and propositions (like A, B, C).
                </Text>
                <Text 
                  margin={{ bottom: size === 'small' ? 'xsmall' : 'small' }} 
                  textAlign={size === 'small' ? 'start' : 'center'}
                  size={size === 'small' ? 'small' : 'medium'}
                >
                  A truth table is a systematic way to list all possible truth values for a given logical expression.
                </Text>
                <Text 
                  margin={{ bottom: size === 'small' ? 'xsmall' : 'small' }} 
                  textAlign="center"
                  size={size === 'small' ? 'small' : 'medium'}
                  weight={size === 'small' ? 'bold' : 'normal'}
                >
                  Enter your logical statement below to generate its truth table!
                </Text>
              </Box>

              {/* Input Card - Mobile optimized */}
              <Card 
                width="100%" 
                pad={size === 'small' ? 'small' : 'medium'} 
                background={{ color: "light-1" }}
              >
                <CardBody pad={size === 'small' ? 'xsmall' : 'small'}>
                  <Box margin={{ bottom: "small" }}>
                    <Box direction="row" align="start" justify="start" margin={{ bottom: 'small' }} style={{ marginLeft: '-8px', marginTop: '-8px' }}>
                      <Button icon={<CircleInformation />} onClick={() => setShowHelp(!showHelp)} plain />
                    </Box>
                    
                    {/* Help menu - scrollable on mobile */}
                    <Collapsible open={showHelp}>
                      <Box 
                        pad="small" 
                        background="light-2" 
                        round="small" 
                        margin={{ bottom: "medium" }} 
                        width="100%"
                        height={size === 'small' ? { max: '200px' } : undefined}
                        overflow={size === 'small' ? 'auto' : undefined}
                      >
                        <Text size={size === 'small' ? 'small' : 'medium'}>
                         Use the symbols from the table below to create your wff. In the symbol column, from left to right, the solver supports keyboard, unicode, and book syntax.
                        </Text>
                        <Box overflow="auto" width="100%">
                          <WFFOperationsTable />
                        </Box>
                      </Box>
                    </Collapsible>

                    <TextInput 
                      placeholder={size === 'small' ? "E.g., A V B" : "Example: Enter your formula here (e.g., A V B)"}
                      value={input}
                      onChange={handleInput}
                    />
                    {error && <Text color="status-critical" size={size === 'small' ? 'small' : 'medium'}>{error}</Text>}
                  </Box>
                </CardBody>
                <CardFooter 
                  align="center" 
                  direction="row" 
                  flex={false} 
                  justify="center" 
                  gap="medium" 
                  pad={{ top: "small" }}
                >
                  <Button 
                    label={loading ? <Spinner /> : "Solve"} 
                    onClick={handleSolve} 
                    disabled={loading}
                    size={size === 'small' ? 'small' : 'medium'} 
                  />
                </CardFooter>
              </Card>

              {/* Output Card - Mobile optimized */}
              <Card 
                width="100%" 
                pad={size === 'small' ? 'small' : 'medium'} 
                background={{ color: "light-2" }} 
                margin={{ top: "medium" }}
              >
                <CardBody pad={size === 'small' ? 'xsmall' : 'small'}>
                  <Text weight="bold" size={size === 'small' ? 'small' : 'medium'}>
                    Output:
                  </Text>
                  <Box 
                    align="center" 
                    justify="center" 
                    pad={{ vertical: "small" }} 
                    background={{ color: "light-3" }} 
                    round="xsmall"
                    overflow="auto"
                  >
                    {output ? (
                      <Box width="100%" overflow="auto">
                        {/* Make TruthTable component scrollable horizontally on mobile */}
                        <Box overflow="auto" width="100%">
                          <TruthTable headers={output.headers} rows={output.rows} />
                        </Box>
                        {output.classification && renderClassification(output.classification, output.description)}
                      </Box>
                    ) : (
                      <Text size={size === 'small' ? 'small' : 'medium'}>Output will be displayed here!</Text>
                    )}
                  </Box>
                </CardBody>
              </Card>
              <ReportFooter />
            </PageContent>
          </Box>
        </Page>
      )}
    </ResponsiveContext.Consumer>
  );
};

export default WFFSolverPage;