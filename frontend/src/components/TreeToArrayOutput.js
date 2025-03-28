import React from 'react';
import { Box, Text, Table, TableHeader, TableBody, TableRow, TableCell } from 'grommet';

/*
* Name: TreeToArrayOutput.js
* Author: Parker Clark
* Description: Output component to represent an array representation of a binary tree.
*/


const TreeToArrayOutput = ({ childArray }) => {
  if (!childArray) {
    return null;
  }

  return (
    <Box gap="medium">
      {/* Child Array Representation */}
      <Box>
        <Text weight="bold" margin={{ bottom: 'small' }}>
          Left Child - Right Child Array Representation:
        </Text>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell scope="col" border="bottom">
                <Text>Node</Text>
              </TableCell>
              <TableCell scope="col" border="bottom">
                <Text>Left Child</Text>
              </TableCell>
              <TableCell scope="col" border="bottom">
                <Text>Right Child</Text>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {childArray.map((row, index) => (
              <TableRow key={index}>
                <TableCell scope="row">
                  <Text>{row.node}</Text>
                </TableCell>
                <TableCell>
                  <Text>{row.leftChild === 0 ? 'NULL' : row.leftChild}</Text>
                </TableCell>
                <TableCell>
                  <Text>{row.rightChild === 0 ? 'NULL' : row.rightChild}</Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default TreeToArrayOutput;