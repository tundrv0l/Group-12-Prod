import React from 'react';
import { Box, Button, Text } from 'grommet';
import { LinkNext } from 'grommet-icons';
import { Link } from 'react-router-dom';

const AccordionPanelContent = ({ content, size = 'medium' }) => {
  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  return (
    <Box 
      pad={{ left: size === 'small' ? 'xsmall' : 'small' }} 
      gap={size === 'small' ? 'xsmall' : 'small'}
      align='start'
    >
      {content.map((item, index) => (
        <Link
          to={item.path}
          key={index}
          style={{ textDecoration: 'none' }}
          onClick={scrollToTop}
        >
          <Button
            label={<Text>{'\u00A0\u00A0\u00A0\u00A0'}{item.label}</Text>}
            icon={
              <Box margin={{ left: 'auto' }}>
                <LinkNext size={size === 'small' ? 'small' : 'medium'} />
              </Box>
            }
            alignSelf="start"
            hoverIndicator
            primary={false}
            size={size === 'small' ? 'small' : 'medium'}
            border="none"
            style={{
              borderRadius: '4px',
              width: '100%',
              justifyContent: 'space-between',
              padding: size === 'small' ? '8px 10px' : '10px 14px',
              textAlign: 'left',
              fontSize: size === 'small' ? '14px' : '16px',
              fontWeight: '500',
              outline: 'none',
              boxShadow: 'none'
            }}
            focusIndicator={false}
          />
        </Link>
      ))}
    </Box>
  );
};

export default AccordionPanelContent;