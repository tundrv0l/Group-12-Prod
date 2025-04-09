import React from 'react';
import { Box, Text, Button, Heading, TextInput } from 'grommet';
import { Add, Trash } from 'grommet-icons';

/*
* Name: BaseCaseInput.js
* Author: Parker Clark
* Description: Component for dynamic recursive base case inputs
*/

const BaseCaseInput = ({ baseCases, onChange }) => {
  // Add a new base case
  const addBaseCase = () => {
    // Find the next n value (typically n+1 from the last one)
    const nextN = baseCases.length > 0 
      ? Math.max(...baseCases.map(bc => bc.n)) + 1 
      : 0;
    
    onChange([...baseCases, { n: nextN, value: '' }]);
  };

  // Remove a base case
  const removeBaseCase = (index) => {
    if (baseCases.length <= 1) return; // Keep at least one base case
    
    const newBaseCases = [...baseCases];
    newBaseCases.splice(index, 1);
    onChange(newBaseCases);
  };

  // Update a base case value
  const updateBaseCase = (index, field, value) => {
    const newBaseCases = [...baseCases];
    newBaseCases[index] = { ...newBaseCases[index], [field]: value };
    onChange(newBaseCases);
  };

  return (
    <Box margin={{ bottom: "medium" }}>
      <Box direction="row" justify="between" align="center">
        <Heading level={4} margin={{ bottom: "small" }}>Base Cases</Heading>
        <Button 
          icon={<Add />} 
          label="Add Base Case" 
          onClick={addBaseCase} 
          size="small"
        />
      </Box>
      
      {baseCases.map((baseCase, index) => (
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
          <Text weight="bold">f({baseCase.n})</Text>
          
          <TextInput
            placeholder="Value (e.g., 1)"
            value={baseCase.value}
            onChange={(e) => updateBaseCase(index, 'value', e.target.value)}
            style={{ flex: 1 }}
          />
          
          <Button
            icon={<Trash />}
            onClick={() => removeBaseCase(index)}
            disabled={baseCases.length <= 1}
            plain
          />
        </Box>
      ))}
    </Box>
  );
};

export default BaseCaseInput;