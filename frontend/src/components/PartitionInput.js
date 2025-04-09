import React from 'react';
import { Page, PageContent, Box, Text, Card, CardBody, TextInput, CardFooter, Button, Spinner, Collapsible } from 'grommet';
import { solvePartitions } from '../api';
import { CircleInformation, Add, Trash } from 'grommet-icons';
import ReportFooter from '../components/ReportFooter';
import HomeButton from '../components/HomeButton';
import Background from '../components/Background';
import { useDiagnostics } from '../hooks/useDiagnostics';

// Custom component for adding multiple partitions
const PartitionInput = ({ value, onChange }) => {
  // Parse the initial value if it exists
  const parseInitialPartitions = () => {
    if (!value) return [''];  // Start with one empty partition by default
    try {
      // Remove outer braces and split by },{ to get individual partition sets
      const partitionsStr = value.substring(1, value.length - 1).split('},{');
      const result = partitionsStr.map(p => {
        // Clean up the individual partition strings
        return p.replace('{', '').replace('}', '').trim();
      });
      // Return at least one partition
      return result.length > 0 ? result : [''];
    } catch (e) {
      return [''];
    }
  };

  const [partitions, setPartitions] = React.useState(parseInitialPartitions());

    // Update the parent component when partitions change
  React.useEffect(() => {
    // Handle empty partitions - for empty partitions, represent as empty sets
    const formattedPartitions = partitions.map(p => {
      const trimmedValue = p.trim();
      
      // Case 1: Empty partition - represent as {}
      if (trimmedValue === '') {
        return '{}';
      }
      
      // Case 2: Already has outer braces - preserve as is
      if (trimmedValue.startsWith('{') && trimmedValue.endsWith('}')) {
        return trimmedValue;
      }
      
      // Case 3: Contains nested braces - parse carefully
      const hasBraces = trimmedValue.includes('{') || trimmedValue.includes('}');
      if (hasBraces) {
        // Split by commas but respect nested braces
        const elements = [];
        let bracketCount = 0;
        let currentElement = '';
        
        for (let i = 0; i < trimmedValue.length; i++) {
          const char = trimmedValue[i];
          
          if (char === '{') bracketCount++;
          if (char === '}') bracketCount--;
          
          if (char === ',' && bracketCount === 0) {
            elements.push(currentElement.trim());
            currentElement = '';
          } else {
            currentElement += char;
          }
        }
        
        // Add the last element
        if (currentElement.trim()) {
          elements.push(currentElement.trim());
        }
        
        return `{${elements.join(',')}}`;
      }
      
      // Case 4: Simple comma-separated list
      return `{${trimmedValue}}`;
    });
    
    // Join all partitions with commas and wrap in outer braces
    const formattedValue = `{${formattedPartitions.join(',')}}`;
    onChange(formattedValue);
  }, [partitions, onChange]);

  // Add a new empty partition
  const addPartition = () => {
    setPartitions([...partitions, '']);
  };

  // Remove a partition at specified index
  const removePartition = (index) => {
    // Don't remove if it's the last partition
    if (partitions.length <= 1) return;
    
    const newPartitions = [...partitions];
    newPartitions.splice(index, 1);
    setPartitions(newPartitions);
  };

  // Update a partition at specified index
  const updatePartition = (index, value) => {
    const newPartitions = [...partitions];
    newPartitions[index] = value;
    setPartitions(newPartitions);
  };

  return (
    <Box>
      <Text margin={{ bottom: 'xsmall' }}>Partitions:</Text>
      
      {partitions.map((partition, index) => (
        <Box key={index} direction="row" align="center" margin={{ bottom: 'xsmall' }}>
          <Box flex={true} margin={{ right: 'small' }}>
            <TextInput
              placeholder={`Enter partition elements (e.g., a, b, c)`}
              value={partition}
              onChange={(e) => updatePartition(index, e.target.value)}
            />
          </Box>
          <Button
            icon={<Trash />}
            onClick={() => removePartition(index)}
            tip="Remove this partition"
            disabled={partitions.length <= 1}
          />
        </Box>
      ))}
      
      <Box margin={{ top: 'small' }}>
        <Button
          icon={<Add />}
          label="Add Partition"
          onClick={addPartition}
          plain={false}
          primary
          size="small"
        />
      </Box>
      
      <Box margin={{ top: 'small' }} background="light-2" pad="small" round="small">
        <Text size="small">
        Preview: {`{${partitions.map(p => {
          const trimmed = p.trim();
          if (trimmed === '') return '{}';
          if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed;
          return `{${trimmed}}`;
        }).join(',')}}`}
        </Text>
      </Box>
    </Box>
  );
};

export default PartitionInput;