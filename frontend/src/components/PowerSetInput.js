import React from 'react';
import {
  Box, Text, Button, FormField, TextInput,
  Heading
} from 'grommet';
import { Add, Trash } from 'grommet-icons';

/*
* Name: PowerSetInput.js
* Author: Parker Clark
* Description: Simplified input component for Power Set operations
*/

const PowerSetInput = ({ 
  sets, 
  iterations,
  error,
  onSetsChange,
  onIterationsChange
}) => {
  // Add a new set
  const addSet = () => {
    const newSets = [...sets, ""];
    onSetsChange(newSets);
  };

  // Remove a set
  const removeSet = (index) => {
    if (sets.length <= 1) return; // Keep at least one set
    
    const newSets = [...sets];
    newSets.splice(index, 1);
    onSetsChange(newSets);
  };

  // Update a set value
  const updateSet = (index, value) => {
    const newSets = [...sets];
    newSets[index] = value;
    onSetsChange(newSets);
  };

  return (
    <>
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
        
        {sets.map((setValue, index) => (
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
            <Text weight="bold" width="xsmall">Set {index + 1}:</Text>
            
            <FormField label="Value" flex margin={{ bottom: "0" }}>
              <TextInput
                placeholder="{1, 2, 3} or ∅"
                value={setValue}
                onChange={(e) => updateSet(index, e.target.value)}
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
      
      {/* Power Set Iterations */}
      <Box margin={{ top: "medium", bottom: "medium" }}>
        <Heading level={4} margin={{ bottom: "small" }}>Power Set Iterations</Heading>
        
        <Box 
          direction="row" 
          align="center" 
          gap="medium" 
          margin={{ bottom: "small" }}
          background="light-2"
          pad="small"
          round="small"
        >
          <FormField label="Number of Iterations" width="medium">
            <TextInput
              type="number"
              value={iterations}
              onChange={(e) => onIterationsChange(e.target.value)}
              min={1}
              max={3}
              step={1}
            />
          </FormField>
          <Text size="small" color="dark-5">
            (Recommended: 1-2 iterations. Higher values produce very large outputs.)
          </Text>
        </Box>
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

export default PowerSetInput;