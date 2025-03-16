import React from 'react';

/*
* Name: AdjacencyMatrix.js
* Author: Parker Clark
* Description: Output component to represent Adjacency Matrix.
*/

const AdjacencyMatrix = ({ matrix }) => {
  const headers = Object.keys(matrix);
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '5px' }}></th>
          {headers.map(header => (
            <th key={header} style={{ border: '1px solid black', padding: '5px' }}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {headers.map((row, rowIndex) => (
          <tr key={row}>
            <th style={{ border: '1px solid black', padding: '5px' }}>{row}</th>
            {matrix[row].map((cell, cellIndex) => (
              <td key={cellIndex} style={{ border: '1px solid black', padding: '5px' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdjacencyMatrix;