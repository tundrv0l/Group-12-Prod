import React, { useCallback, useEffect } from 'react';
import { Box, Button, Text, TextInput, Grid } from 'grommet';
import { Add, Trash } from 'grommet-icons';

const GraphInput = ({ value, onChange }) => {
  // Parse the initial value if it exists - memoize to prevent unnecessary recalculations
  const parseInitialEdges = useCallback(() => {
    if (!value || value === '{}') return [];
    
    try {
      // Remove outer braces, then split by "),(" to get individual edges
      const edgesStr = value.substring(1, value.length - 1).split(/\)\s*,\s*\(/);
      
      return edgesStr.map(edge => {
        // Clean up the edge string
        edge = edge.replace(/^\(|\)$/g, '');
        const [source, target] = edge.split(',');
        
        return {
          source: source.trim(),
          target: target.trim()
        };
      });
    } catch (e) {
      console.error("Error parsing edges:", e);
      return [];
    }
  }, [value]); // Add value as a dependency

  const [edges, setEdges] = React.useState(parseInitialEdges());
  const [newEdge, setNewEdge] = React.useState({ source: '', target: '' });
  const [inputError, setInputError] = React.useState('');

  // Add this effect to update internal state when value changes from outside
  useEffect(() => {
    setEdges(parseInitialEdges());
  }, [parseInitialEdges]); // This will run when value changes through the dependency chain

  // Update the parent component when edges change
  useEffect(() => {
    if (edges.length === 0) {
      onChange('{}');
      return;
    }
    
    // Format edges into {(x1, y1), (x2, y2), ...} format
    const formattedValue = '{' + edges.map(e => 
      `(${e.source}, ${e.target})`
    ).join(', ') + '}';
    
    onChange(formattedValue);
  }, [edges, onChange]);



    const validateEdgeInput = (edge) => {
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        
        if (!edge.source || !alphanumericRegex.test(edge.source)) {
        return "Source vertex must be alphanumeric (letters or numbers)";
        }
        
        if (!edge.target || !alphanumericRegex.test(edge.target)) {
        return "Target vertex must be alphanumeric (letters or numbers)";
        }
        
        return "";
    };

  // Add a new edge
  const addEdge = () => {
    const error = validateEdgeInput(newEdge);
    if (error) {
      setInputError(error);
      return;
    }
    
    setEdges([...edges, newEdge]);
    setNewEdge({ source: '', target: '' });
    setInputError('');
  };

  // Remove an edge at specified index
  const removeEdge = (index) => {
    const newEdges = [...edges];
    newEdges.splice(index, 1);
    setEdges(newEdges);
  };

  // Update an input field of the new edge
  const updateNewEdge = (field, value) => {
    setNewEdge({
      ...newEdge,
      [field]: value
    });
    // Clear error when user starts typing again
    if (inputError) setInputError('');
  };

  return (
    <Box>
      <Text margin={{ bottom: 'small' }}>Add edges:</Text>
      
      {edges.map((edge, index) => (
        <Box key={index} direction="row" align="center" margin={{ bottom: 'xsmall' }}>
            <Text margin={{ right: 'small' }}>
            ({edge.source}, {edge.target})
            </Text>
            <Button
            icon={<Trash />}
            onClick={() => removeEdge(index)}
            tip={{
                content: "Remove this edge",
                dropProps: { align: { left: 'right' } }
            }}
            plain
            />
        </Box>
        ))}
      
      <Box>
        <Grid
          columns={['1/3', '1/3', '1/3']}
          gap="small"
          margin={{ bottom: 'small' }}
        >
          <TextInput
            placeholder="Source"
            value={newEdge.source}
            onChange={(e) => updateNewEdge('source', e.target.value)}
          />
          <TextInput
            placeholder="Target"
            value={newEdge.target}
            onChange={(e) => updateNewEdge('target', e.target.value)}
          />
          <Button
            icon={<Add />}
            label="Add"
            onClick={addEdge}
            primary
          />
        </Grid>
        {inputError && (
          <Text color="status-critical" size="small" margin={{ bottom: 'small' }}>
            {inputError}
          </Text>
        )}
      </Box>
      
      {/* Preview of the formatted value */}
      <Box margin={{ top: 'small' }} background="light-2" pad="small" round="small">
        <Text size="small">
          Preview: {edges.length > 0 ? 
            '{' + edges.map(e => `(${e.source}, ${e.target})`).join(', ') + '}' : 
            '{}'}
        </Text>
      </Box>
    </Box>
  );
};

export default GraphInput;