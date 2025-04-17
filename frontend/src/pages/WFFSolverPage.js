import React from 'react';
import { Box, Text, TextInput, Button } from 'grommet';
import { StatusCritical, StatusGood, CircleInformation } from 'grommet-icons';
import { solveWFF } from '../api';
import SolverPage from '../components/SolverPage';
import TruthTable from '../components/TruthTable';
import WFFOperationsTable from '../components/WFFOperationExample';
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

  // Initialize diagnostic hook
  const { trackResults } = useDiagnostics("WFF_SOLVER");

  const SAMPLE_WFF = "A → (B ∧ C)";
  
  const fillWithSample = () => {
    setInput(SAMPLE_WFF);
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          WFF Syntax:
        </Text>
        <Text>
          Use the symbols from the table below to create your Well-Formed Formula (WFF). 
          In the symbol column, from left to right, the solver supports keyboard, unicode, and book syntax.
        </Text>
        <WFFOperationsTable />
        <Text margin={{ top: "small" }}>
          Ensure that tokens and operators are delimited by spaces or parentheses.
        </Text>
        
        <Box margin={{ top: 'medium' }} align="center">
          <Button 
            label="Fill with Sample" 
            onClick={fillWithSample} 
            primary 
            size="small"
            border={{ color: 'black', size: '2px' }}
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
          />
        </Box>
      </>
    );
  };

  const Input = ({setInput}) => {
    return (
      <Box>
        <TextInput
          placeholder="Example: Enter your formula here (e.g., A V B)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </Box>
    );
  };

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

  const AssociativityBox = () => {
    return (
      <Box
        background="light-2"
        pad="medium"
        margin={{ vertical: 'medium' }}
        round="small"
        border={{ color: 'brand', size: '1px' }}
      >
        <Text weight="bold" margin={{ bottom: 'small' }}>
          Important Note on Associativity:
        </Text>
        <Text>
          This solver uses left-to-right associativity for operations at the same precedence level. 
          This means that expressions like "A ∧ B ∧ C" are evaluated as "(A ∧ B) ∧ C" rather 
          than "A ∧ (B ∧ C)". Use parentheses to enforce specific grouping if needed.
        </Text>
      </Box>
    );
  };

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
    // First, check if input is empty or only whitespace
    if (!input || !input.trim()) {
      return false;
    }
    
    // Check for balanced parentheses and brackets
    const balancedParentheses = (input.match(/\(/g) || []).length === (input.match(/\)/g) || []).length;
    const balancedBrackets = (input.match(/\[/g) || []).length === (input.match(/\]/g) || []).length;
    if (!balancedParentheses || !balancedBrackets) {
      return false;
    }
    
    // Sanitize the input - only allow valid logical operators, letters, and structural characters
    // Valid operators: and, or, not, implies, equivalent, negation
    // Valid symbols: ->, →, v, ∨, V, ~, S, `, ^, ∧, >, <>, 4, ↔, ¬, ', ′
    // Valid variables: A-Z (single uppercase letters)
    // Valid structural: (, ), [, ]
    
    // Replace all valid tokens with spaces to help check if any invalid characters remain
    let sanitized = input;
    
    // Replace all variables
    sanitized = sanitized.replace(/\b[A-Z]\b/g, ' ');
    
    // Replace all valid operators and symbols
    const validSymbols = [
      '->', '→', 'v', '∨', 'V', '~', 'S', '`', '^', '∧', '>', '<>', '4', '↔', '¬', "'", '′',
      'and', 'or', 'not'
    ];
    
    for (const symbol of validSymbols) {
      sanitized = sanitized.replace(new RegExp(symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ' ');
    }
    
    // Replace structural characters
    sanitized = sanitized.replace(/[()[\]]/g, ' ');
    
    // Replace whitespace
    sanitized = sanitized.replace(/\s+/g, '');
    
    // If anything remains, it's an invalid character
    if (sanitized.length > 0) {
      return false;
    }
    
    // Check that we have at least one variable
    const hasVariable = /\b[A-Z]\b/.test(input);
    if (!hasVariable) {
      return false;
    }
    
    // Check that we have at least one operator (if more than one variable)
    // Otherwise, formulas like just "A" would be invalid, which seems wrong
    const variableMatches = input.match(/\b[A-Z]\b/g) || [];
    if (variableMatches.length > 1) {
      const containsOperator = /->|→|v|∨|V|~|S|`|>|\^|∧|<>|↔|4|not|¬|′/.test(input);
      if (!containsOperator) {
        return false;
      }
    }
    
    // Reject single pair of parentheses or brackets without operators
    const singlePairNoOperator = /^\([A-Z]\)$|^\[[A-Z]\]$/.test(input.trim());
    if (singlePairNoOperator) {
      return false;
    }
    
    return true;
  };

  const renderOutput = () => {
    if (!output) {
      return <Text>Output will be displayed here!</Text>;
    }
    
    return (
      <Box>
        <TruthTable headers={output.headers} rows={output.rows} />
        {output.classification && renderClassification(output.classification, output.description)}
      </Box>
    );
  };

  return (
    <SolverPage
      title="WFF to Truth Table Solver"
      topic="Statement And Tautologies"
      description="This tool helps you work with well-formed formulas (wffs) and truth tables."
      paragraphs={[
        "A WFF is a valid expression in propositional logic that is constructed using logical operators (like AND, OR, NOT, IMPLIES) and propositions (like A, B, C). These formulas strictly adhere to the syntax rules of logic, making them suitable for mathematical reasoning.",
        "A truth table is a systematic way to list all possible truth values for a given logical expression. It shows how the truth value of the entire formula depends on the truth values of its components. Truth tables are especially useful for verifying tautologies (statements that are always true) or contradictions (statements that are always false).",
        "WFFs use symbolic notation rather than natural language to represent logical operations. Instead of writing 'A AND B', we use symbols like '∧' or '^' to represent conjunction. Similarly, '∨' represents OR, '¬' represents NOT, and '→' represents IMPLIES. This symbolic notation allows for concise and precise representation of logical statements, making them easier to analyze and evaluate."
      ]}
      InfoText={Info}
      InputComponent={Input}
      input_props={{ setInput }}
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      render_output={renderOutput}
      ExtraComponent={AssociativityBox}
    />
  );
};

export default WFFSolverPage;
