import React from 'react';
import { Box, Button } from 'grommet';

/*
* Name: MatrixToolbar.js
* Author: Parker Clark
* Description: Toolbar with buttons to manipulate a single matrix input.
*/

const MatrixToolbar = ({ matrix, setMatrix }) => {
  const addRow = () => {
    if (matrix && matrix.length > 0) {
      const newRow = Array(matrix[0].length).fill('');
      setMatrix([...matrix, newRow]);
    } else {
      setMatrix([['']]);
    }
  };

  const addColumn = () => {
    if (matrix && matrix.length > 0) {
      const newMatrix = matrix.map(row => [...row, '']);
      setMatrix(newMatrix);
    } else {
      setMatrix([['']]);
    }
  };

  const removeRow = () => {
    if (matrix && matrix.length > 1) {
      setMatrix(matrix.slice(0, -1));
    }
  };

  const removeColumn = () => {
    if (matrix && matrix[0].length > 1) {
      const newMatrix = matrix.map(row => row.slice(0, -1));
      setMatrix(newMatrix);
    }
  };

  return (
    <Box direction="row" gap="small" margin={{ bottom: 'small' }}>
      <Button label="Add Row" onClick={addRow} />
      <Button label="Add Column" onClick={addColumn} />
      <Button label="Remove Row" onClick={removeRow} />
      <Button label="Remove Column" onClick={removeColumn} />
    </Box>
  );
};

export default MatrixToolbar;