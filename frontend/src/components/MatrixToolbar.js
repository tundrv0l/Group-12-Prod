import React from 'react';
import { Box, Button } from 'grommet';

/*
* Name: MatrixToolbar.js
* Author: Parker Clark
* Description: Toolbar with buttons to manipulate a single matrix input.
*/

const MatrixToolbar = ({ matrix, setMatrix, maxDimension = 10 }) => {
  const addRow = () => {

    if (matrix.length >= maxDimension) {
      return;
    } else {
      if (matrix && matrix.length > 0) {
        const newRow = Array(matrix[0].length).fill('0');
        setMatrix([...matrix, newRow]);
      } else {
        setMatrix([['0']]);
      }
    }
  };

  const addColumn = () => {
    if (matrix[0].length >= maxDimension) {
      return;
    } else {
      if (matrix && matrix.length > 0) {
        const newMatrix = matrix.map(row => [...row, '0']);
        setMatrix(newMatrix);
      } else {
        setMatrix([['0']]);
      }
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

  const buttonStyle = {
    border: '2px solid #444444 !important',
    borderRadius: '4px',
    margin: '0 4px',
    boxShadow: '0 1px 3px rgba(0,0,0,1)'
  };
  
  return (
    <Box direction="row" gap="small" margin={{ bottom: 'small' }}>
      <Button 
        label="Add Row" 
        onClick={addRow} 
        style={buttonStyle}
      />
      <Button 
        label="Add Column" 
        onClick={addColumn} 
        style={buttonStyle}
      />
      <Button 
        label="Remove Row" 
        onClick={removeRow} 
        style={buttonStyle}
      />
      <Button 
        label="Remove Column" 
        onClick={removeColumn} 
        style={buttonStyle}
      />
    </Box>
  );
};

export default MatrixToolbar;