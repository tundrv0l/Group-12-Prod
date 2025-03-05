import React from 'react';

/*
* Name: AdjacencyList.js
* Author: Parker Clark
* Description: Output component to represent Adjacency List.
*/


const ListRepresentation = ({ list }) => {
  return (
    <ul>
      {Object.keys(list).map(node => (
        <li key={node}>
          {node}: [{list[node].join(', ')}]
        </li>
      ))}
    </ul>
  );
};

export default ListRepresentation;