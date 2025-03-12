import React from 'react';
import { Box, Button } from 'grommet';
import { LinkNext } from 'grommet-icons';
import { Link } from 'react-router-dom';

const AccordionPanelContent = ({ content, size = 'medium' }) => (
  <Box 
    pad={{ left: size === 'small' ? 'xsmall' : 'small' }} 
    gap={size === 'small' ? 'xsmall' : 'small'}
  >
    {content.map((item, index) => (
      <Link
        to={item.path}
        key={index}
        style={{ textDecoration: 'none' }}
      >
        <Button
          label={item.label}
          icon={<LinkNext size={size === 'small' ? 'small' : 'medium'} />}
          alignSelf="start"
          hoverIndicator
          primary={false}
          size={size === 'small' ? 'small' : 'medium'}
          style={{
            borderRadius: '4px',
            width: '100%',
            justifyContent: 'space-between',
            padding: size === 'small' ? '8px 10px' : '10px 14px',
            textAlign: 'left',
            fontSize: size === 'small' ? '14px' : '16px',  // Increased from 12px/14px
            fontWeight: '500',  // Adding slightly bolder text
            outline: 'none',
            boxShadow: 'none'
          }}
          focusIndicator={false}
        />
      </Link>
    ))}
  </Box>
);

export default AccordionPanelContent;