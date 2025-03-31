import React, { useState } from 'react';
import {
  Box, Text, Button, FormField, TextInput, Select,
  Heading, Collapsible
} from 'grommet';
import { Add, Trash, CircleInformation } from 'grommet-icons';

/*
* Name: SetFunctionInput.js
* Author: Parker Clark
* Description: Main input for Set Function page
*/

// Set operators available for expressions
const SET_OPERATORS = [
  { label: "Subset (⊆)", value: "⊆" },
  { label: "Proper Subset (⊂)", value: "⊂" },
  { label: "Element Of (∈)", value: "∈" },
  { label: "Equality (=)", value: "=" },
  { label: "Union (∪)", value: "∪" },
  { label: "Intersection (∩)", value: "∩" },
  { label: "Difference (-)", value: "-" },
  { label: "Cartesian Product (×)", value: "×" }
];

// Default set types
const SET_TYPES = [
  { label: "Regular Set", value: "regular" },
  { label: "Set Builder Notation", value: "builder" }
];

const SetFunctionInput = ({ 
  sets, 
  expressions, 
  error,
  onSetsChange, 
  onExpressionsChange, 
  onValidate 
}) => {
  const [showHelp, setShowHelp] = useState(false);

  // Add a new set definition
  const addSet = () => {
    // Generate next available set name (A, B, C, ...)
    const nextName = String.fromCharCode(65 + sets.length);
    const newSets = [...sets, { name: nextName, type: "regular", value: "" }];
    onSetsChange(newSets);
  };

  // Remove a set definition
  const removeSet = (index) => {
    if (sets.length <= 1) return; // Keep at least one set
    
    const newSets = [...sets];
    const removedName = newSets[index].name;
    newSets.splice(index, 1);
    
    // Update expressions that used the removed set
    const newExpressions = expressions.map(expr => {
      if (expr.leftOperand === removedName) {
        return { ...expr, leftOperand: newSets[0].name };
      }
      if (expr.rightOperand === removedName) {
        return { ...expr, rightOperand: newSets[0].name };
      }
      return expr;
    });
    
    onSetsChange(newSets);
    onExpressionsChange(newExpressions);
  };

  // Update a set definition
  const updateSet = (index, field, value) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    onSetsChange(newSets);
  };

  // Add a new expression
  const addExpression = () => {
    const newExpressions = [...expressions, { 
      leftOperand: sets[0]?.name || "", 
      operator: "⊆", 
      rightOperand: sets[1]?.name || sets[0]?.name || "" 
    }];
    onExpressionsChange(newExpressions);
  };

  // Remove an expression
  const removeExpression = (index) => {
    if (expressions.length <= 1) return; // Keep at least one expression
    
    const newExpressions = [...expressions];
    newExpressions.splice(index, 1);
    onExpressionsChange(newExpressions);
  };

  // Update an expression
  const updateExpression = (index, field, value) => {
    const newExpressions = [...expressions];
    newExpressions[index] = { ...newExpressions[index], [field]: value };
    onExpressionsChange(newExpressions);
  };

  return (
    <>
      <Box margin={{bottom : "xxsmall" }}>
        <Box direction="row" align="start" justify="start" margin={{ bottom: 'small' }} style={{ marginLeft: '-8px', marginTop: '-8px' }}>
          <Button icon={<CircleInformation />} onClick={() => setShowHelp(!showHelp)} plain />
        </Box>
        <Collapsible open={showHelp}>
          <Box pad="small" background="light-2" round="small" margin={{ bottom: "medium" }} width="full">
            <Heading level={5} margin={{ bottom: "xsmall" }} weight="bold">Regular Set Notation</Heading>
            <Text>Enter sets using curly braces with comma-separated elements:</Text>
            <Text margin={{ top: "xsmall" }}>
              <strong>{"{1, 2, 3}"}</strong> - Set containing numbers 1, 2, and 3
            </Text>
            <Text><strong>{"{a, b, c}"}</strong> - Set containing elements a, b, and c</Text>
            <Text><strong>{"∅"}</strong> or <strong>{"{}"}</strong> - Empty set</Text>
            <Text><strong>{"{1, {2, 3}}"}</strong> - Nested set</Text>
            
            <Heading level={5} margin={{ vertical: "xsmall" }} weight="bold">Set Builder Notation</Heading>
            <Text>Describe sets using conditions:</Text>
            <Text margin={{ top: "xsmall" }}>
              <strong>{"{x | x ∈ Z and x > 3}"}</strong> - Integers greater than 3
            </Text>
            <Text><strong>{"{x | x ∈ N and x < 10}"}</strong> - Natural numbers less than 10</Text>
            
            <Heading level={5} margin={{ vertical: "xsmall" }} weight="bold">Available Set Operations</Heading>
            <Text>A ⊆ B - A is a subset of B</Text>
            <Text>A ⊂ B - A is a proper subset of B</Text>
            <Text>a ∈ A - Element a is in set A</Text>
            <Text>A = B - Sets A and B are equal</Text>
            <Text>A ∪ B - Union of sets A and B</Text>
            <Text>A ∩ B - Intersection of sets A and B</Text>
            <Text>A - B - Difference of sets A and B</Text>
            <Text>A × B - Cartesian product of sets A and B</Text>
          </Box>
        </Collapsible>
      </Box>

      {/* Set Definitions Section */}
      <Box margin={{ bottom: "medium" }}>
        <Box direction="row" justify="between" align="center">
          <Heading level={4} margin={{ bottom: "small" }}>Define Your Sets</Heading>
          <Button 
            icon={<Add />} 
            label="Add Set" 
            onClick={addSet} 
            size="small"
          />
        </Box>
        
        {sets.map((set, index) => (
          <Box 
            key={index} 
            direction="row" 
            align="center" 
            gap="small" 
            margin={{ bottom: "small" }}
            background="light-2"
            pad="small"
            round="small"
          >
            <FormField label="Name" width="xsmall">
              <TextInput
                value={set.name}
                onChange={(e) => updateSet(index, 'name', e.target.value)}
                size="small"
              />
            </FormField>
            
            <FormField label="Type" width="medium">
              <Select
                options={SET_TYPES}
                labelKey="label"
                valueKey={{ key: 'value', reduce: true }}
                value={set.type}
                onChange={({ value }) => updateSet(index, 'type', value)}
                dropProps={{ 
                  align: { top: 'bottom' },
                  overflow: "auto"
                }}
              />
            </FormField>
            
            <FormField label="Value" flex>
              <TextInput
                placeholder={set.type === "regular" ? "{1, 2, 3} or ∅" : "{x | x ∈ Z and x > 3}"}
                value={set.value}
                onChange={(e) => updateSet(index, 'value', e.target.value)}
              />
            </FormField>
            
            <Button
              icon={<Trash />}
              onClick={() => removeSet(index)}
              disabled={sets.length <= 1}
              plain
            />
          </Box>
        ))}
      </Box>
      
      {/* Expressions Section */}
      <Box margin={{ top: "medium", bottom: "medium" }}>
        <Box direction="row" justify="between" align="center">
          <Heading level={4} margin={{ bottom: "small" }}>Create Expressions</Heading>
          <Button 
            icon={<Add />} 
            label="Add Expression" 
            onClick={addExpression} 
            size="small"
          />
        </Box>
        
        {expressions.map((expr, index) => (
          <Box 
            key={index} 
            direction="row" 
            align="center" 
            gap="small" 
            margin={{ bottom: "small" }}
            background="light-2"
            pad="small"
            round="small"
            wrap={false} // Prevent wrapping to ensure single line
          >
            <Box basis="25%" flex={false}>
              <Select
                options={[
                  ...sets.map(s => s.name),
                  ...(expr.operator === "∈" ? ["1", "2", "3", "{1, 2}", "∅"] : [])
                ]}
                value={expr.leftOperand}
                onChange={({ option }) => updateExpression(index, 'leftOperand', option)}
                dropProps={{ 
                  align: { top: 'bottom' },
                  overflow: "auto",
                  elevation: "small"
                }}
              />
            </Box>
            
            <Box basis="35%" flex={false}>
              <Select
                options={SET_OPERATORS}
                labelKey="label"
                valueKey={{ key: 'value', reduce: true }}
                value={expr.operator}
                onChange={({ value }) => updateExpression(index, 'operator', value)}
                dropProps={{ 
                  align: { top: 'bottom' },
                  overflow: "auto"
                }}
              />
            </Box>
            
            <Box basis="25%" flex={false}>
              <Select
                options={sets.map(s => s.name)}
                value={expr.rightOperand}
                onChange={({ option }) => updateExpression(index, 'rightOperand', option)}
                dropProps={{ 
                  align: { top: 'bottom' },
                  overflow: "auto"
                }}
              />
            </Box>
            
            <Box basis="15%" flex={false} align="center">
              <Button
                icon={<Trash />}
                onClick={() => removeExpression(index)}
                disabled={expressions.length <= 1}
                plain
              />
            </Box>
          </Box>
        ))}
      </Box>
      
      {/* Error Display */}
      {error && (
        <Box background="status-critical" pad="small" round="small" margin={{ vertical: "small" }}>
          <Text color="white">{error}</Text>
        </Box>
      )}
    </>
  );
};

export default SetFunctionInput;