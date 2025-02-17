import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow, Text } from 'grommet';

/*
* Name: TruthTable.js
* Author: Parker Clark
* Description: Defines the TruthTable component for displaying a truth table.
*/

const TruthTable = ({ headers, rows }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableCell key={index} scope="col" border={{ color: 'light-4', side: 'all' }}>
              <Text>{header}</Text>
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex} border={{ color: 'light-4', side: 'all' }}>
                <Text>{cell}</Text>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TruthTable;