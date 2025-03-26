import React from 'react';
import { Box, Button } from 'grommet';

/*
* Name: PermutatinsToolbar.js
* Author: Mathias Buchanan
* Description: copy of Parker's MatrixToolbar.js but without the add/remove row buttons.
*/

const MatrixToolbar = ({ matrix, setMatrix }) => {

  const addColumn = () => {
    if (matrix && matrix.length > 0) {
      const newMatrix = matrix.map(row => [...row, '']);
      setMatrix(newMatrix);
    } else {
      setMatrix([['']]);
    }
  };

  const removeColumn = () => {
    if (matrix && matrix[0].length > 1) {
      const newMatrix = matrix.map(row => row.slice(0, -1));
      setMatrix(newMatrix);
    }
  };

  return (
    <Box direction="row" gap="small" margin={{ bottom: 'small' }} align="center" justify="center">
      <Button label="Add Column" onClick={addColumn} />
      <Button label="Remove Column" onClick={removeColumn} />
    </Box>
  );
};

export default MatrixToolbar;