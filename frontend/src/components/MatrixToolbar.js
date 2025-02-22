import React from 'react';
import { Box, Button } from 'grommet';

/*
* Name: MatrixToolbar.js
* Author: Parker Clark
* Description: Toolbar with buttons to manipulate two matrice inputs .
*/

const MatrixToolbar = ({ matrix1, setMatrix1, matrix2, setMatrix2 }) => {
  const addRow = () => {

    // Add a new row to each matrix
    const newRow1 = Array(matrix1[0].length).fill('');
    const newRow2 = Array(matrix2[0].length).fill('');
    setMatrix1([...matrix1, newRow1]);
    setMatrix2([...matrix2, newRow2]);
  };

  // Add a column to each matrix
  const addColumn = () => {
    const newMatrix1 = matrix1.map(row => [...row, '']);
    const newMatrix2 = matrix2.map(row => [...row, '']);
    setMatrix1(newMatrix1);
    setMatrix2(newMatrix2);
  };


  // Remove a row from each matrix
  const removeRow = () => {
    if (matrix1.length > 1 && matrix2.length > 1) {
      setMatrix1(matrix1.slice(0, -1));
      setMatrix2(matrix2.slice(0, -1));
    }
  };

  // Remove a column from each matrix
  const removeColumn = () => {
    if (matrix1[0].length > 1 && matrix2[0].length > 1) {

      // Remove the last element from each row
      const newMatrix1 = matrix1.map(row => row.slice(0, -1));
      const newMatrix2 = matrix2.map(row => row.slice(0, -1));
      setMatrix1(newMatrix1);
      setMatrix2(newMatrix2);
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