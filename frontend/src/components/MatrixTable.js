import React from 'react';
import { Box, TextInput } from 'grommet';

/*
* Name: MatrixTable.js
* Author: Parker Clark
* Description: Input table to emulate matrices .
*/

const MatrixTable = ({ label, matrix, setMatrix }) => {

  // Update the matrix with the new value
  const handleChange = (rowIndex, colIndex, value) => {
    const newMatrix = matrix.map((row, rIdx) =>
      // If the current row and column match the index, update the value
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? value : cell))
    );
    setMatrix(newMatrix);
  };

  return (
    <Box>
      <Box margin={{ bottom: 'medium' }}>
        {Array.isArray(matrix) && matrix.map((row, rowIndex) => (
          <Box key={rowIndex} direction="row" gap="small" margin={{ bottom: 'xsmall' }}>
            {Array.isArray(row) && row.map((cell, colIndex) => (
              <TextInput
                key={colIndex}
                value={cell}
                onChange={e => handleChange(rowIndex, colIndex, e.target.value)}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MatrixTable;