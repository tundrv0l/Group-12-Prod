import React from 'react';
import { Box, Text } from 'grommet';

/*
* Name: MatrixOutput.js
* Author: Parker Clark
* Description: Component to display matrices from a JSON object where keys are titles and values are 2D arrays.
*/

const MatrixOutput = ({ matrices }) => {
  // If no matrices are provided, return null
  if (!matrices) return null;

  return (
    <Box>
      {Object.entries(matrices).map(([title, matrix], index) => (
        <Box key={index} margin={{ bottom: 'medium' }}>
          <Text weight="bold" margin={{ bottom: 'small' }} justify='center' alignSelf='center'>{title}</Text>
          
          <Box 
            border={{ color: 'brand', size: '2px' }}
            round="small"
            pad="small"
            background="light-1"
          >
            {Array.isArray(matrix) && matrix.map((row, rowIndex) => (
              <Box key={rowIndex} direction="row" gap="medium" margin={{ bottom: 'xsmall' }}>
                {Array.isArray(row) && row.map((cell, colIndex) => (
                  <Box 
                    key={colIndex}
                    align="center"
                    justify="center"
                    pad="small"
                    border={{ color: 'light-3' }}
                    width="50px"
                    height="50px"
                  >
                    <Text>{cell}</Text>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default MatrixOutput;