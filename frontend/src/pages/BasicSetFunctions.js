import React, { useState } from 'react';
import { Box, Text, Button, Heading } from 'grommet';
import { solveBasicSetFunctions } from '../api';
import SolverPage from '../components/SolverPage';
import { useDiagnostics } from '../hooks/useDiagnostics';
import SetFunctionInput from '../components/SetFunctionInput';

/*
* Name: BasicSetFunctions.js
* Author: Parker Clark
* Description: Solver page for providing basic set functions.
*/

const BasicSetFunctions = () => {
  // State for sets and expressions
  const [sets, setSets] = useState([
    { name: "A", type: "regular", value: "" }
  ]);
  const [expressions, setExpressions] = useState([
    { leftOperand: "A", operator: "⊆", rightOperand: "" }
  ]);
  
  // Results state
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { trackResults } = useDiagnostics("BASIC_SET_FUNCTIONS");

  const SAMPLE_SETS = [
    { name: "A", type: "regular", value: "{1, 2, 3, 4}" },
    { name: "B", type: "regular", value: "{3, 4, 5, 6}" }
  ];
  
  const SAMPLE_EXPRESSIONS = [
    { leftOperand: "A", operator: "⊆", rightOperand: "B" },
    { leftOperand: "1", operator: "∈", rightOperand: "A" }
  ];

  const fillWithSample = () => {
    setSets(SAMPLE_SETS);
    setExpressions(SAMPLE_EXPRESSIONS);
  };

  const Info = () => {
    return (
      <>
        <Text weight="bold" margin={{ bottom: "xsmall" }}>
          Set Functions:
        </Text>
        <Text>
          This tool evaluates set operations and relationships between sets.
        </Text>
        <Text margin={{ top: "small" }}>
          <strong>Defining Sets:</strong>
        </Text>
        <Text>
          • Regular Set Format: {'{a, b, c}'} or {'{1, 2, 3}'} or ∅ (empty set)
        </Text>
        <Text>
          • Set Builder Notation: {'{x | x ∈ Z and x > 0}'} (elements x from Z where x {">"} 0)
        </Text>
        
        <Text margin={{ top: "small" }}>
          <strong>Available Operations:</strong>
        </Text>
        <Text>• ⊆ (Subset): Tests if every element in the left set is also in the right set</Text>
        <Text>• ⊂ (Proper Subset): Tests if left is a subset of right but not equal to right</Text>
        <Text>• = (Equality): Tests if both sets contain the exact same elements</Text>
        <Text>• ∈ (Membership): Tests if an element is in a set</Text>
        <Text>• ∩ (Intersection): Finds common elements in both sets</Text>
        <Text>• ∪ (Union): Combines all elements from both sets</Text>
        <Text>• − (Difference): Returns elements in left set that aren't in right set</Text>
        <Text>• × (Cartesian Product): Creates all possible ordered pairs from the sets</Text>

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

  const Input = () => {
    return (
      <SetFunctionInput
        sets={sets}
        expressions={expressions}
        error={error}
        onSetsChange={setSets}
        onExpressionsChange={setExpressions}
        onValidate={validateInput}
      />
    );
  };

  // Validate the entire input form
  const validateInput = () => {
    // Check if all sets have names and values
    for (const set of sets) {
      if (!set.name.trim()) {
        setError("All sets must have a name.");
        return false;
      }
      
      // Check for duplicate set names
      const names = sets.map(s => s.name);
      if (names.filter(name => name === set.name).length > 1) {
        setError(`Set name "${set.name}" is used multiple times.`);
        return false;
      }
      
      // Validate set values based on type
      if (set.type === "regular") {
        if (!set.value.trim()) {
          setError(`Set ${set.name} must have a value.`);
          return false;
        }
        
        // Basic validation for regular set notation
        if (!validateRegularSet(set.value)) {
          setError(`Set ${set.name} has invalid format. Use format like {1, 2, 3} or ∅.`);
          return false;
        }
      } else if (set.type === "builder") {
        if (!set.value.trim()) {
          setError(`Set ${set.name} must have a value.`);
          return false;
        }
        
        // Basic validation for set builder notation
        if (!validateSetBuilder(set.value)) {
          setError(`Set ${set.name} has invalid builder format. Use format like {x | x ∈ Z}.`);
          return false;
        }
      }
    }
    
    // Check if all expressions have operands and operators
    for (const expr of expressions) {
      if (!expr.leftOperand || !expr.operator || !expr.rightOperand) {
        setError("All expressions must have both operands and an operator.");
        return false;
      }
      
      // Validate that operands are defined as sets
      const setNames = sets.map(s => s.name);
      if (expr.operator !== "∈") {
        // For non-membership operations, both operands should be sets
        if (!setNames.includes(expr.leftOperand)) {
          setError(`Left operand "${expr.leftOperand}" is not defined as a set.`);
          return false;
        }
        if (!setNames.includes(expr.rightOperand)) {
          setError(`Right operand "${expr.rightOperand}" is not defined as a set.`);
          return false;
        }
      } else {
        // For membership operations, only right operand needs to be a set
        if (!setNames.includes(expr.rightOperand)) {
          setError(`Right operand "${expr.rightOperand}" is not defined as a set.`);
          return false;
        }
      }
    }
    
    return true;
  };

  // Validate regular set notation
  const validateRegularSet = (value) => {
    // Accept empty set
    if (value === "∅" || value === "{}") {
      return true;
    }
    
    // Check if it starts with { and ends with }
    if (!value.startsWith("{") || !value.endsWith("}")) {
      return false;
    }
    
    // Additional validation could check for proper comma separation, etc.
    return true;
  };

  // Validate set builder notation
  const validateSetBuilder = (value) => {
    // Basic validation for pattern {x | x ∈ Domain and condition}
    const pattern = /\{x\s*\|\s*x\s*∈\s*[NZQRC]\s+(and|for)\s+.*\}/;
    return pattern.test(value);
  };

  // Helper function to render the structured output
  const renderOutput = () => {
    if (!output) {
      return "Output will be displayed here!";
    }
    
    try {
      let result;
      if (typeof output === 'string') {
        result = JSON.parse(output);
      } else {
        result = output;
      }
      
      return (
        <Box>
          {/* Display sets */}
          {result.sets && (
            <Box margin={{ bottom: "xxsmall" }}>
              <Heading level={5} margin={{ top: "none", bottom: "xsmall" }}>Sets:</Heading>
              {Object.entries(result.sets).map(([name, value]) => (
                <Box key={name} direction="row" margin={{ bottom: "xsmall" }}>
                  <Text weight="bold">{name} = </Text>
                  <Text>{value}</Text>
                </Box>
              ))}
            </Box>
          )}

          {/* Display statement results */}
          {result.statements && (
            <Box>
              <Heading level={5} margin={{ bottom: "xxsmall" }}>Results:</Heading>
              {result.statements.map((stmt, index) => (
                <Box key={index} direction="row" margin={{ bottom: "xsmall" }}>
                  <Text weight="bold">{stmt.expression}: </Text>
                  <Box margin={{ left: "xsmall" }}> {/* Add left margin for spacing */}
                    <Text>
                      {typeof stmt.result === 'boolean' 
                        ? (stmt.result ? "True" : "False") 
                        : stmt.result}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      );
    } catch (e) {
      return <Text>{String(output)}</Text>;
    }
  };

  const handleSolve = async () => {
    // Reset output and error
    setLoading(true);
    setOutput('');
    setError('');

    // Validate all inputs
    if (!validateInput()) {
      setLoading(false);
      return;
    }

    // Prepare payload
    const payload = {
      sets: {},
      statements: []
    };
    
    // Add sets to payload
    sets.forEach(set => {
      payload.sets[set.name] = {
        type: set.type,
        value: set.value
      };
    });
    
    // Add expressions to payload
    expressions.forEach(expr => {
      payload.statements.push({
        expression: `${expr.leftOperand} ${expr.operator} ${expr.rightOperand}`
      });
    });

    // Start timing for performance tracking
    const startTime = performance.now();

    try {
      const result = await solveBasicSetFunctions(payload);
      
      trackResults(
        payload,
        result,
        performance.now() - startTime
      );

      setOutput(result);
    } catch (err) {
      trackResults(
        payload,
        {error: err.message || "Error solving Basic Set Functions"},
        performance.now() - startTime
      );
      
      setError('An error occurred while solving the set functions.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <SolverPage
      title="Basic Set Functions"
      topic="Sets"
      description="This tool helps you apply basic set functions."
      paragraphs={[
        "A set is a collection of distinct objects, considered as an object in its own right. Basic set functions include the ability to test if sets are a subset of another, and determine elements of the set.",
        "By applying set functions, you can identify relationships between sets, find common elements, and determine the differences between sets. This tool allows you to input sets and apply basic set functions to generate the corresponding results.",
        "Define your sets below and create expressions to evaluate!"
      ]}
      InfoText={Info}
      InputComponent={Input}
      input_props={null}
      error={error}
      handle_solve={handleSolve}
      loading={loading}
      render_output={renderOutput}
    />
  );
};

export default BasicSetFunctions;