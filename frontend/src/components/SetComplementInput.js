import React from 'react';
import {
  Box, Text, FormField, TextInput
} from 'grommet';

const SetComplementInput = ({ 
  universalSet, 
  subset, 
  error,
  onUniversalSetChange, 
  onSubsetChange
}) => {
  return (
    <>
      <FormField label="Universal Set (U)" margin={{ bottom: "medium" }}>
        <TextInput
          placeholder="{1, 2, 3, 4, 5}"
          value={universalSet}
          onChange={(e) => onUniversalSetChange(e.target.value)}
        />
      </FormField>
      
      <FormField label="Subset (A)" margin={{ bottom: "small" }}>
        <TextInput
          placeholder="{1, 3}"
          value={subset}
          onChange={(e) => onSubsetChange(e.target.value)}
        />
      </FormField>
      
      {error && (
        <Box background="status-critical" pad="small" round="small" margin={{ top: "small" }}>
          <Text color="white">{error}</Text>
        </Box>
      )}
    </>
  );
};

export default SetComplementInput;