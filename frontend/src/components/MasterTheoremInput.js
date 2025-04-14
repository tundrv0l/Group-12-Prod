import React, { forwardRef, useImperativeHandle } from 'react';
import { Box, Text, TextInput, FormField, Grid, Heading } from 'grommet';

/*
* Name: MasterTheoremInput.js
* Author: Parker Clark
* Description: Input component for Master Theorem parameters
*/

const MasterTheoremInput = forwardRef((props, ref) => {
  const { 
    a, 
    setA, 
    b, 
    setB, 
    c, 
    setC, 
    setError 
  } = props;
  
  // Generate the recurrence relation text for display
  const generateRecurrenceText = () => {
    if (!a || !b || c === undefined) return "T(n) = ?";
    
    const divisionFactor = b > 1 ? `n/${b}` : 'n';
    const workFactor = c > 0 ? `n^${c}` : '1';
    
    return `T(n) = ${a}T(${divisionFactor}) + ${workFactor}`;
  };

  // Validator that can be called from parent
  const validateInputs = () => {
    // Validate a is an integer ≥ 1
    const aNum = parseInt(a, 10);
    if (isNaN(aNum) || aNum < 1 || !Number.isInteger(aNum)) {
      setError && setError('Parameter a must be an integer ≥ 1.');
      return false;
    }

    // Validate b is an integer > 1
    const bNum = parseInt(b, 10);
    if (isNaN(bNum) || bNum <= 1 || !Number.isInteger(bNum)) {
      setError && setError('Parameter b must be an integer > 1.');
      return false;
    }

    // Validate c is a non-negative number
    const cNum = parseFloat(c);
    if (isNaN(cNum) || cNum < 0) {
      setError && setError('Parameter c must be a non-negative number.');
      return false;
    }

    return true;
  };

  // Expose the validation method via ref
  useImperativeHandle(ref, () => ({
    validate: validateInputs
  }));

  return (
    <Box margin={{ bottom: 'medium' }}>
      <Box margin={{ top: 'medium', bottom: 'small' }} background="light-2" pad="medium" round="small">
        <Heading level={4} margin={{ top: 'none', bottom: 'small' }}>Master Theorem Parameters</Heading>
        <Text size="small">Enter the parameters for your recurrence relation:</Text>
        
        <Grid columns={{ count: 3, size: 'small' }} gap="small" margin={{ top: 'small' }}>
          <FormField label="a (Integer ≥ 1)">
            <TextInput
              placeholder="e.g., 2"
              value={a}
              onChange={(e) => setA(e.target.value)}
              type="number"
            />
          </FormField>
          
          <FormField label="b (Integer > 1)">
            <TextInput
              placeholder="e.g., 2"
              value={b}
              onChange={(e) => setB(e.target.value)}
              type="number"
            />
          </FormField>
          
          <FormField label="c (Number ≥ 0)">
            <TextInput
              placeholder="e.g., 1"
              value={c}
              onChange={(e) => setC(e.target.value)}
              type="number"
              step="0.1"
            />
          </FormField>
        </Grid>
        
        <Box margin={{ top: 'medium' }} align="center">
          <Text weight="bold">Your recurrence relation:</Text>
          <Text>{generateRecurrenceText()}</Text>
          <Text size="small" margin={{ top: 'small' }} color="dark-3">
            This follows the form: T(n) = aT(n/b) + n^c
          </Text>
        </Box>
      </Box>
    </Box>
  );
});

export default MasterTheoremInput;
