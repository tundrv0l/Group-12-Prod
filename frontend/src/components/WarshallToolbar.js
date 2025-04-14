import React from 'react';
import { Box, Button } from 'grommet';

/*
* Name: WarshallToolbar.js
* Author: Mathias Buchanan
* Description: Altered MatrixToolbar.js to only have 2 buttons and always be a square
*/

const MatrixToolbar = ({ matrix, setMatrix }) => {
  const addRowAndColumn = () => {
    let newMatrix = [...matrix];

    if (newMatrix.length === 0) {
      newMatrix = [['']];
    } else {
      // Add a new column to each row
      newMatrix = newMatrix.map(row => [...row, '0']);
      // Add a new row with the correct number of columns
      const newRow = Array(newMatrix[0].length).fill('0');
      newMatrix.push(newRow);
    }

    setMatrix(newMatrix);
  };

  const removeRowAndColumn = () => {
    if (matrix && matrix.length > 1) {
      const newMatrix = matrix.slice(0, -1).map(row => row.slice(0, -1));
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
    <Box direction="row" gap="small" margin={{ bottom: 'small' }} justify="center" align="center">
      <Button 
        label="Add Column and Row" 
        onClick={addRowAndColumn} 
        style={buttonStyle}
      />
      <Button 
        label="Remove Column and Row" 
        onClick={removeRowAndColumn} 
        style={buttonStyle}
      />
    </Box>
  );
};

export default MatrixToolbar;