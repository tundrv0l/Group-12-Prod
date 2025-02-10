import React from 'react';
import { Box, Heading, Text, Button } from 'grommet';
import { Link } from 'react-router-dom';

/*
* Name: NotFound.js
* Author: Parker Clark
* Description: 404 Page Not Found component.
*/

const NotFound = () => (
  <Box align="center" justify="center" pad="large">
    <Heading level="2">404 - Page Not Found</Heading>
    <Text>Sorry, the page you are looking for does not exist.</Text>
    <Link to="/">
      <Button label="Go to Home" margin={{ top: 'medium' }} />
    </Link>
  </Box>
);

export default NotFound;