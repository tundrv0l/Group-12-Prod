import React from 'react';
import { Box, Table, TableBody, TableCell, TableHeader, TableRow, Text } from 'grommet';

/*
* Name: PropositionalLogicOperationsTable.js
* Author: Parker Clark
* Description: Component that displays the operations table for propositional logic.
*/

const PropositionalLogicOperationsTable = () => {
  return (
    <Box margin={{"vertical":"medium"}}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell scope="col" border="bottom">
              <Text>Operator</Text>
            </TableCell>
            <TableCell scope="col" border="bottom">
              <Text>Symbol</Text>
            </TableCell>
            <TableCell scope="col" border="bottom">
              <Text>Description</Text>
            </TableCell>
            <TableCell scope="col" border="bottom">
              <Text>Example</Text>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Text>AND</Text>
            </TableCell>
            <TableCell>
              <Text>^ | ∧ | `</Text>
            </TableCell>
            <TableCell>
              <Text>Logical conjunction</Text>
            </TableCell>
            <TableCell>
              <Text>A ^ B</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text>OR</Text>
            </TableCell>
            <TableCell>
              <Text>v | ∨ | ~ </Text>
            </TableCell>
            <TableCell>
              <Text>Logical disjunction</Text>
            </TableCell>
            <TableCell>
              <Text>A v B</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text>NOT</Text>
            </TableCell>
            <TableCell>
              <Text>' | ¬ | ′</Text>
            </TableCell>
            <TableCell>
              <Text>Logical negation</Text>
            </TableCell>
            <TableCell>
              <Text>¬A or A'</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text>IMPLIES</Text>
            </TableCell>
            <TableCell>
              <Text>-{'>'} | {'>'} | → | {">"} </Text>
            </TableCell>
            <TableCell>
              <Text>Logical implication</Text>
            </TableCell>
            <TableCell>
              <Text>A → B</Text>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default PropositionalLogicOperationsTable;