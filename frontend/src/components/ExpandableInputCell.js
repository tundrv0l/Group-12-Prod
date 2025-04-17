import React, { useState } from 'react';
import { Box, Text } from 'grommet';

const ExpandableInputCell = ({ input }) => {
    const [expanded, setExpanded] = useState(false);
    const inputString = JSON.stringify(input);
    const previewLength = 40; // Characters to show in preview
    
    // Determine if the input is long enough to need expansion
    const needsExpansion = inputString.length > previewLength;
    
    // Preview text shows first X characters
    const previewText = needsExpansion 
      ? `${inputString.substring(0, previewLength)}...` 
      : inputString;
    
    return (
      <Box>
        {expanded ? (
          <Box>
            <Text size="small" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
              {inputString}
            </Text>
            <Text 
              color="brand" 
              size="xsmall" 
              onClick={() => setExpanded(false)}
              style={{ cursor: 'pointer', marginTop: '4px' }}
            >
              Show less
            </Text>
          </Box>
        ) : (
          <Box>
            <Text size="small">{previewText}</Text>
            {needsExpansion && (
              <Text 
                color="brand" 
                size="xsmall" 
                onClick={() => setExpanded(true)}
                style={{ cursor: 'pointer', marginTop: '4px' }}
              >
                Show more
              </Text>
            )}
          </Box>
        )}
      </Box>
    );
  };

  export default ExpandableInputCell;