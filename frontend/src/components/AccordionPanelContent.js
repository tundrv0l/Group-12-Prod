import React from 'react';
import { Box, Text } from 'grommet';
import { useNavigate } from 'react-router-dom';

/*
* Name: AccordionPanelContent.js
* Author: Parker Clark
* Description: Component that defines bounds on AccordionPanel.
*/ 

const AccordionPanelContent = ({ content }) => {

  // Set up router context so each accordion panel text can be a link
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <Box align="center" justify="center" pad="small" gap="small">
      {content.map((item, index) => (
        <Text key={index} onClick={() => handleClick(item.path)} style={{ cursor: 'pointer' }}>
          {item.label}
        </Text>
      ))}
    </Box>
  );
};

export default AccordionPanelContent;