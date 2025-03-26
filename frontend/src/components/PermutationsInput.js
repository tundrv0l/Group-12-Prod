import React, { useState, useEffect } from 'react';
import { Box, TextInput } from 'grommet';

/*
* Name: PermutationsInput.js
* Author: Mathias Buchanan
* Description: A copy of Parker's MatrixTable.js but limits the input to 2 rows by default
*/

const MatrixTable = ({ label, matrix, setMatrix }) => {
  // Ensure the matrix always has at least 2 rows
  useEffect(() => {
    if (matrix.length < 2) {
      const defaultMatrix = Array.from({ length: 2 }, () => Array(matrix[0]?.length || 1).fill(''));
      setMatrix(defaultMatrix);
    }
  }, [matrix, setMatrix]);

  // Update the matrix with the new value
  const handleChange = (rowIndex, colIndex, value) => {
    const newMatrix = matrix.map((row, rIdx) =>
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