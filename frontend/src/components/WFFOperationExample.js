import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow, Text, Box } from 'grommet';

/*
* Name: WFFOperationsTable.js
* Author: Parker Clark
* Description: Defines the WFFOperationsTable component for displaying a table of WFF operations.
*/

const WFFOperationsTable = () => {
  return (
    <Box margin={{"bottom":"medium"}}>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Text>AND</Text>
            </TableCell>
            <TableCell>
              <Text>^</Text>
            </TableCell>
            <TableCell>
              <Text>Logical conjunction</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text>OR</Text>
            </TableCell>
            <TableCell>
              <Text>v</Text>
            </TableCell>
            <TableCell>
              <Text>Logical disjunction</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text>NOT</Text>
            </TableCell>
            <TableCell>
              <Text>' or not</Text>
            </TableCell>
            <TableCell>
              <Text>Logical negation</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text>IMPLIES</Text>
            </TableCell>
            <TableCell>
              <Text>-{'>'}</Text>
            </TableCell>
            <TableCell>
              <Text>Logical implication</Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text>IFF</Text>
            </TableCell>
            <TableCell>
              <Text>{'<>'}</Text>
            </TableCell>
            <TableCell>
              <Text>Logical biconditional</Text>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default WFFOperationsTable;