import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { Box, Text, TextInput, CheckBox, FormField, Grid, Heading } from 'grommet';

const PolynomialInput = forwardRef((props, ref) => {
  // Keep original props but add coefficients2/setCoefficients2
  const { 
    order, 
    setOrder, 
    coefficients, 
    setCoefficients,
    // New props for second polynomial 
    coefficients2 = [], 
    setCoefficients2,
    // Original props
    useLog, 
    setUseLog, 
    useRoot, 
    setUseRoot,
    setError,
    // Allow customizing labels
    label1 = "Polynomial 1",
    label2 = "Polynomial 2",
    // Flag to show/hide second polynomial
    showSecondPolynomial = !!setCoefficients2
  } = props;
  
  useEffect(() => {
    let orderNum = parseInt(order, 10);

    if (orderNum > 10) {
      setError && setError('Maximum order is 10.');
      orderNum = 10;
      setOrder('10');
      return; // Exit early after changing order
    }

    if (!isNaN(orderNum) && orderNum >= 0) {
      // Only update arrays if their length doesn't match the order+1
      if (coefficients.length !== orderNum + 1) {
        const newCoefficients = Array(orderNum + 1).fill('');
        
        // Preserve existing values
        for (let i = 0; i < Math.min(coefficients.length, newCoefficients.length); i++) {
          newCoefficients[i] = coefficients[i];
        }
        
        setCoefficients(newCoefficients);
      }
      
      // Similar check for second polynomial
      if (showSecondPolynomial && setCoefficients2 && coefficients2.length !== orderNum + 1) {
        const newCoefficients2 = Array(orderNum + 1).fill('');
        
        for (let i = 0; i < Math.min(coefficients2.length, newCoefficients2.length); i++) {
          newCoefficients2[i] = coefficients2[i];
        }
        
        setCoefficients2(newCoefficients2);
      }
    }

  }, [order, setCoefficients, setCoefficients2, setOrder, setError, showSecondPolynomial]);

  // Original coefficient change handler
  const handleCoefficientChange = (index, value) => {
    const newCoefficients = [...coefficients];
    newCoefficients[index] = value;
    setCoefficients(newCoefficients);
  };
  
  // New handler for second polynomial
  const handleCoefficientChange2 = (index, value) => {
    if (!setCoefficients2) return;
    
    const newCoefficients = [...coefficients2];
    newCoefficients[index] = value;
    setCoefficients2(newCoefficients);
  };

  // Generate polynomial text (can be reused for both polynomials)
  const generatePolynomialText = (coeffs) => {
    if (!coeffs || coeffs.length === 0) return "";
    
    return coeffs.map((coef, index) => {
      const power = coeffs.length - 1 - index;
      
      if (power === 0) {
        return coef || '0';
      } else if (power === 1) {
        return `${coef || '0'}x`;
      } else {
        return `${coef || '0'}x^${power}`;
      }
    }).join(' + ');
  };

  // Validator for both polynomials
  const validateInputs = () => {
    const orderNum = parseInt(order, 10);
    if (isNaN(orderNum) || orderNum < 0 || !Number.isInteger(orderNum)) {
      setError && setError('Order must be a non-negative integer.');
      return false;
    }

    // Validate first polynomial
    for (let i = 0; i < coefficients.length; i++) {
      if (coefficients[i].trim() === '') {
        setError && setError(`${label1}: Coefficient for x^${coefficients.length - 1 - i} cannot be empty.`);
        return false;
      }
      
      const value = parseFloat(coefficients[i]);
      if (i == 0.0 && value <= 0.0) {
        setError && setError(`${label1}: Leading Coefficient should be greater than 0.`);
        return false;
      }

      if (isNaN(value)) {
        setError && setError(`${label1}: Invalid number for coefficient of x^${coefficients.length - 1 - i}.`);
        return false;
      }
    }
    
    // Validate second polynomial if shown
    if (showSecondPolynomial) {
      for (let i = 0; i < coefficients2.length; i++) {
        if (coefficients2[i].trim() === '') {
          setError && setError(`${label2}: Coefficient for x^${coefficients2.length - 1 - i} cannot be empty.`);
          return false;
        }
        
        const value = parseFloat(coefficients2[i]);
          if (i == 0.0 && value <= 0.0) {
            setError && setError(`${label2}: Leading Coefficient should be greater than 0.`);
            return false;
          }

        if (isNaN(value)) {
          setError && setError(`${label2}: Invalid number for coefficient of x^${coefficients2.length - 1 - i}.`);
          return false;
        }
      }
    }

    return true;
  };

  // Expose the validation method
  useImperativeHandle(ref, () => ({
    validate: validateInputs
  }));

  return (
    <Box margin={{ bottom: 'medium' }}>
      <FormField label="Order (non-negative integer)" margin={{ bottom: 'small' }}>
        <TextInput
          placeholder="Enter the order (e.g., 2)"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          type="number"
        />
      </FormField>
      
      <Box direction="row" gap="medium" margin={{ bottom: 'medium' }}>
        <CheckBox
          label="Use Logarithm"
          checked={useLog}
          onChange={(e) => setUseLog(e.target.checked)}
        />
        <CheckBox
          label="Use Root"
          checked={useRoot}
          onChange={(e) => setUseRoot(e.target.checked)}
        />
      </Box>
      
      {/* First Polynomial */}
      <Box margin={{ top: 'medium', bottom: 'small' }} background="light-2" pad="medium" round="small">
        <Heading level={4} margin={{ top: 'none', bottom: 'small' }}>{label1}</Heading>
        <Text size="small">Enter the coefficients for your polynomial:</Text>
        
        <Grid columns={{ count: 'fit', size: 'small' }} gap="small">
          {coefficients.map((coef, index) => {
            const power = coefficients.length - 1 - index;
            return (
              <FormField 
                key={index} 
                label={power === 0 ? 'Constant term' : power === 1 ? 'x' : `x^${power}`}
              >
                <TextInput
                  placeholder={`Coefficient`}
                  value={coef}
                  onChange={(e) => handleCoefficientChange(index, e.target.value)}
                  type="number"
                />
              </FormField>
            );
          })}
        </Grid>
        
        <Box margin={{ top: 'small' }} align="center">
          <Text weight="bold">Your polynomial:</Text>
          <Text>{generatePolynomialText(coefficients)}</Text>
        </Box>
      </Box>
      
      {/* Second Polynomial (conditional) */}
      {showSecondPolynomial && (
        <Box margin={{ top: 'medium', bottom: 'small' }} background="light-2" pad="medium" round="small">
          <Heading level={4} margin={{ top: 'none', bottom: 'small' }}>{label2}</Heading>
          <Text size="small">Enter the coefficients for your polynomial:</Text>
          
          <Grid columns={{ count: 'fit', size: 'small' }} gap="small">
            {coefficients2.map((coef, index) => {
              const power = coefficients2.length - 1 - index;
              return (
                <FormField 
                  key={index} 
                  label={power === 0 ? 'Constant term' : power === 1 ? 'x' : `x^${power}`}
                >
                  <TextInput
                    placeholder={`Coefficient`}
                    value={coef}
                    onChange={(e) => handleCoefficientChange2(index, e.target.value)}
                    type="number"
                  />
                </FormField>
              );
            })}
          </Grid>
          
          <Box margin={{ top: 'small' }} align="center">
            <Text weight="bold">Your polynomial:</Text>
            <Text>{generatePolynomialText(coefficients2)}</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
});

export default PolynomialInput;
