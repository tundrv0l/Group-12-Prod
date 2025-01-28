import React from 'react';
import { Box, Text } from 'grommet';

/*
* Name: AccordionPanel.js
* Author: Parker Clark
* Description: Component that defines bounds on AccordionPanel.
*/ 

const AccordionPanelContent = ({ content }) => (
  <Box align="center" justify="center" pad="small" gap="small">
    {content.map((item, index) => (
      <Text key={index}>{item}</Text>
    ))}
  </Box>
);

export default AccordionPanelContent;
